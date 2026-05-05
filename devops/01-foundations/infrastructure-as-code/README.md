# Infrastructure as Code

Infrastructure as Code (IaC) is the practice of defining, provisioning, and managing cloud infrastructure using version-controlled code rather than through manual portal operations or ad-hoc scripts.

The surface definition understates the shift. IaC is not just automation — it is a change in how you think about infrastructure: not as a set of resources you manage, but as a desired state that a tool continuously enforces.

## The problem IaC solves

Before IaC, infrastructure was managed manually. Someone clicked through a portal, typed values into forms, and created resources. This produces several compounding problems:

**No record of what exists or why.** The portal created a resource, but there is no document that explains which settings were chosen and why. A year later, no one knows if a particular setting was intentional or a default that was never changed.

**No reproducibility.** If you need to recreate the environment (disaster recovery, new region, new client), you are manually re-creating something from memory or incomplete documentation. The result is subtly different from the original in ways you won't discover until something breaks.

**No review process.** A developer changing a production security group setting looks exactly the same as them creating a development storage account. There is no diff, no review, no audit trail.

**Drift is invisible.** Manual changes accumulate over time, and the actual state of production gradually diverges from what anyone thinks it is. This is called configuration drift, and it is one of the most common causes of "works in staging, fails in production."

IaC solves all four problems at once: the code is the record, the code is reproducible, the code can be reviewed and version-controlled, and the tool detects and corrects drift.

## Declarative vs imperative

There are two approaches to defining infrastructure in code:

**Imperative**: describe the steps to get to the desired state. "Create a resource group named X. Then create a storage account named Y in that resource group. Then configure it with these settings."

**Declarative**: describe the desired state. The tool figures out how to get there. "The following resources should exist with these properties." The tool compares the current state to the desired state and makes the changes needed to reconcile them.

Bicep and Terraform are declarative. ARM templates are partially declarative. Pulumi supports both.

Declarative is almost always the right choice for infrastructure. The reasons:

- Idempotency: you can apply the same definition multiple times and get the same result. This makes it safe to re-run your IaC on every deployment without fear of duplicating resources.
- Drift correction: the tool can detect that a resource has drifted from its defined state and correct it.
- Readability: a description of what should exist is easier to understand than a script of how to create it.

## Bicep and the Azure mental model

Bicep is Azure's domain-specific language for IaC. It compiles to ARM (Azure Resource Manager) templates and deploys via the ARM API. The key concepts:

**Resources** are the fundamental unit. Every resource has a type (e.g., `Microsoft.Storage/storageAccounts`), a name, a location, and properties. The type determines what properties are available.

**Parameters** are values that can be set at deployment time. They allow the same template to be used for dev, staging, and production with different values.

**Variables** are computed values used within the template. They reduce duplication.

**Modules** are reusable templates that can be called from other templates. They are Bicep's primary composition mechanism.

**Outputs** are values that the template produces after deployment — connection strings, resource IDs, URLs. They can be passed to other templates or used in pipeline steps.

## The idempotency guarantee

One of the most important properties of good IaC is idempotency: applying the same template multiple times produces the same result as applying it once. In ARM and Bicep, this means:

- If a resource already exists with the right properties, the deployment does not change it
- If a resource exists with different properties, the deployment updates it to match
- If a resource does not exist, the deployment creates it

This makes it safe to run your IaC on every CI/CD pipeline execution. The pipeline doesn't need to know whether it's setting up a new environment or updating an existing one.

## The `what-if` operation

Before applying an IaC change to production, `az deployment group what-if` shows you exactly what the deployment will change: which resources will be created, modified, or deleted. This is the IaC equivalent of a git diff — it shows you the impact before you commit to it.

Running `what-if` in CI on every pull request touching infrastructure files is one of the highest-return DevOps practices you can adopt. It makes infrastructure changes visible and reviewable, exactly like code changes.

## Common failure modes in IaC

**Hardcoded secrets**: never put credentials, keys, or passwords in IaC templates. They are code and go into version control. Use Key Vault references or pipeline secret variables instead.

**Hardcoded locations**: templates that hardcode `eastus` or `westeurope` cannot be deployed to other regions without modification. Use parameters.

**No idempotency testing**: templates that work the first time but fail on the second run (because they assume the resource doesn't exist) produce subtle, hard-to-diagnose bugs. Always test that your templates are idempotent.

**Missing `what-if` before production changes**: applying an IaC change to production without previewing it first is the infrastructure equivalent of pushing code without running tests. Don't skip the preview step.

**Module over-engineering**: Bicep modules are powerful, but deeply nested modules with many parameters are hard to read and debug. Prefer flat over deeply nested. Prefer explicit over clever.
