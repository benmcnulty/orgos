---
name: Staff
description: Shape the organization structure, assign agent templates to roles, and manage staffed identities in the active organization.
version: 1.0.0
tools:
  - staff.read
  - staff.write
  - memory.bootstrap
context: 4096
---

# Staff Skill

Use this skill to manage departments, teams, roles, and staffed identities for the active organization.

## Responsibilities

- create or update departments, teams, and roles
- assign agent templates to roles
- generate or inspect staffed identities
- keep the active organization structure coherent and observable

## Persistent Files

- `.data/organizations/{{ORG_ID}}/staff.json`
- `.data/organizations/{{ORG_ID}}/memory/index.json`
- `.data/organizations/{{ORG_ID}}/memory/<identity-id>/...`
