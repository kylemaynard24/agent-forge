# Project — Security Review Pack

## Goal

Take one small system and produce a **developer-friendly security hardening pass** instead of a vague "be secure" checklist.

## Deliverables

1. A threat model diagram or table
2. A prioritized risk list
3. Concrete hardening changes in code
4. A secrets and identity handling note
5. A short section called `What still worries me`

## Constraints

- At least one change must improve authorization, not just authentication
- At least one change must reduce blast radius if a secret leaks
- You must state one risk you are explicitly accepting for now

## Done when

- [ ] A teammate can read the pack and know what is protected
- [ ] Risks are prioritized, not dumped into one bucket
- [ ] The remaining risks are visible instead of hidden
