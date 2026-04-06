---
name: Evals
description: Define expectations, criteria, and recorded results for prompts, agents, tools, skills, and workflows.
version: 1.0.0
tools:
  - evals.list
  - evals.write
context: 4096
---

# Evals Skill

Use this skill to store evaluation criteria and results for quality assurance and prompt/process refinement.

## Persistent File

- `.data/organizations/{{ORG_ID}}/evals.json`
