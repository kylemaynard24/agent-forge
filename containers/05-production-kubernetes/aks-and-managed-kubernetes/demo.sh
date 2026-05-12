#!/usr/bin/env bash
# demo.sh — AKS and Managed Kubernetes
# Run: bash demo.sh
# Requires: az CLI logged in (az login), sufficient subscription quota for 2x Standard_D2s_v3 VMs
# WARNING: This creates real Azure resources. Run the cleanup section when done.

set -euo pipefail

RG="rg-aks-demo"
CLUSTER="aks-demo"
LOCATION="eastus"
KEYVAULT="kv-aks-demo-$RANDOM"  # must be globally unique

echo "=== 1. Create resource group ==="
az group create \
  --name "$RG" \
  --location "$LOCATION" \
  --output table

echo ""
echo "=== 2. Create AKS cluster with OIDC issuer + workload identity ==="
echo "This takes 5-10 minutes..."
az aks create \
  --resource-group "$RG" \
  --name "$CLUSTER" \
  --enable-oidc-issuer \
  --enable-workload-identity \
  --network-plugin azure \
  --node-count 2 \
  --node-vm-size Standard_D2s_v3 \
  --enable-addons monitoring \
  --generate-ssh-keys \
  --output table

echo ""
echo "=== 3. Get credentials ==="
az aks get-credentials \
  --resource-group "$RG" \
  --name "$CLUSTER" \
  --overwrite-existing

echo ""
echo "=== 4. Show cluster info ==="
kubectl cluster-info
kubectl get nodes -o wide

echo ""
echo "=== 5. Show existing node pools ==="
az aks nodepool list \
  --resource-group "$RG" \
  --cluster-name "$CLUSTER" \
  --output table

echo ""
echo "=== 6. Add a spot user node pool (scales to zero when idle) ==="
az aks nodepool add \
  --resource-group "$RG" \
  --cluster-name "$CLUSTER" \
  --name spotpool \
  --priority Spot \
  --spot-max-price -1 \
  --node-count 0 \
  --min-count 0 \
  --max-count 3 \
  --enable-cluster-autoscaler \
  --node-vm-size Standard_D2s_v3 \
  --node-taints "kubernetes.azure.com/scalesetpriority=spot:NoSchedule" \
  --output table

echo ""
echo "Node pools after adding spotpool:"
az aks nodepool list \
  --resource-group "$RG" \
  --cluster-name "$CLUSTER" \
  --output table

echo ""
echo "=== 7. Show cluster OIDC issuer URL ==="
OIDC_ISSUER=$(az aks show \
  --resource-group "$RG" \
  --name "$CLUSTER" \
  --query "oidcIssuerProfile.issuerUrl" \
  --output tsv)
echo "OIDC Issuer: $OIDC_ISSUER"

echo ""
echo "=== 8. Set up workload identity for Key Vault access ==="
echo "Creating a Managed Identity..."
IDENTITY_NAME="id-aks-demo-workload"
az identity create \
  --name "$IDENTITY_NAME" \
  --resource-group "$RG" \
  --output table

IDENTITY_CLIENT_ID=$(az identity show \
  --name "$IDENTITY_NAME" \
  --resource-group "$RG" \
  --query clientId \
  --output tsv)

IDENTITY_OBJECT_ID=$(az identity show \
  --name "$IDENTITY_NAME" \
  --resource-group "$RG" \
  --query principalId \
  --output tsv)

echo "Managed Identity client ID: $IDENTITY_CLIENT_ID"

echo ""
echo "Creating Key Vault..."
az keyvault create \
  --name "$KEYVAULT" \
  --resource-group "$RG" \
  --location "$LOCATION" \
  --enable-rbac-authorization true \
  --output table

KEYVAULT_ID=$(az keyvault show \
  --name "$KEYVAULT" \
  --resource-group "$RG" \
  --query id \
  --output tsv)

echo "Storing a test secret in Key Vault..."
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee-object-id "$(az ad signed-in-user show --query id -o tsv)" \
  --assignee-principal-type User \
  --scope "$KEYVAULT_ID" \
  --output table 2>/dev/null || echo "(skipping self role assignment — may already exist)"

sleep 10  # wait for RBAC to propagate
az keyvault secret set \
  --vault-name "$KEYVAULT" \
  --name "db-password" \
  --value "super-secret-password-123" \
  --output table

echo "Assigning Key Vault Secrets User role to the Managed Identity..."
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee-object-id "$IDENTITY_OBJECT_ID" \
  --assignee-principal-type ServicePrincipal \
  --scope "$KEYVAULT_ID" \
  --output table

echo ""
echo "Creating Kubernetes ServiceAccount with workload identity annotation..."
kubectl create namespace wi-demo --dry-run=client -o yaml | kubectl apply -f -
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: workload-sa
  namespace: wi-demo
  annotations:
    azure.workload.identity/client-id: "$IDENTITY_CLIENT_ID"
  labels:
    azure.workload.identity/use: "true"
EOF

echo ""
echo "Creating federated credential (binds Kubernetes SA to Azure MI)..."
az identity federated-credential create \
  --name "workload-federated" \
  --identity-name "$IDENTITY_NAME" \
  --resource-group "$RG" \
  --issuer "$OIDC_ISSUER" \
  --subject "system:serviceaccount:wi-demo:workload-sa" \
  --output table

echo ""
echo "=== 9. Deploy a pod that uses workload identity to read Key Vault ==="
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: keyvault-reader
  namespace: wi-demo
  labels:
    azure.workload.identity/use: "true"
spec:
  serviceAccountName: workload-sa
  containers:
  - name: reader
    image: mcr.microsoft.com/azure-cli:latest
    command:
    - /bin/bash
    - -c
    - |
      echo "Authenticating via workload identity..."
      az login --federated-token "\$(cat /var/run/secrets/azure/tokens/azure-identity-token)" \
        --service-principal \
        -u "$IDENTITY_CLIENT_ID" \
        --tenant "\$(az account show --query tenantId -o tsv 2>/dev/null || echo 'unknown')" \
        2>/dev/null || az login --identity --client-id "$IDENTITY_CLIENT_ID"
      echo "Reading secret from Key Vault..."
      az keyvault secret show --vault-name "$KEYVAULT" --name db-password --query value -o tsv
      echo "Done! Secret was read without any credentials stored in the cluster."
      sleep 3600
    resources:
      requests:
        cpu: "50m"
        memory: "64Mi"
      limits:
        cpu: "200m"
        memory: "128Mi"
  restartPolicy: Never
EOF

echo ""
echo "Waiting for pod to start (up to 60s)..."
kubectl wait --for=condition=Ready pod/keyvault-reader -n wi-demo --timeout=60s || true
echo ""
echo "Pod logs (Key Vault read result):"
kubectl logs keyvault-reader -n wi-demo --tail=20 2>/dev/null || echo "(pod may still be starting — run: kubectl logs keyvault-reader -n wi-demo)"

echo ""
echo "=== 10. Show cluster upgrade info ==="
echo "Available upgrades for this cluster:"
az aks get-upgrades \
  --resource-group "$RG" \
  --name "$CLUSTER" \
  --output table

echo ""
echo "=== 11. Cleanup — IMPORTANT: deletes all Azure resources ==="
echo ""
echo "To clean up all resources created by this demo, run:"
echo "  az group delete --name $RG --yes --no-wait"
echo ""
echo "Estimated ongoing cost if left running: ~\$6-10/hour (2x D2s_v3 nodes + Key Vault)"

echo ""
echo "--- Done. Key takeaway: AKS + OIDC issuer + workload identity eliminates all stored credentials — pods authenticate to Azure services via federated JWT with no secrets in the cluster. ---"
