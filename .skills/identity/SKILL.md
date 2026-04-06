---
name: Identity
description: Generate, inspect, and maintain staffed identities and their associated memory silos for the active organization.
version: 1.0.0
tools:
  - memory.bootstrap
  - staff.read
context: 4096
---

# Identity Skill

Use this skill to generate or inspect persistent staffed identities tied to organizational roles.

## Persistent Files

- `.data/organizations/{{ORG_ID}}/staff.json`
- `.data/organizations/{{ORG_ID}}/memory/index.json`
- `.data/organizations/{{ORG_ID}}/memory/<identity-id>/identity.json`
- `.data/organizations/{{ORG_ID}}/memory/<identity-id>/PROFILE.md`
