---
name: Mail
description: Send, receive, and review organization-scoped messages between humans and agents.
version: 1.0.0
tools:
  - mail.list
  - mail.write
context: 3072
---

# Mail Skill

Use this skill to operate orgos mail within the active organization.

## Persistent Files

- `.data/organizations/{{ORG_ID}}/mail/*.json`
