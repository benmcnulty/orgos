---
name: Flow
description: Sequence continuous objective-driven work for the active organization without relying on calendar time.
version: 1.0.0
tools:
  - flow.list
  - flow.write
  - queue.state
context: 4096
---

# Flow Skill

Use this skill to define continuous work cycles, objectives, and backpressure-aware sequencing for orgos.

## Responsibilities

- create and update flow records
- define objectives, assignees, and cadence
- keep work moving without idle gaps
- respect queue pressure and dependency structure

## Persistent File

- `.data/organizations/{{ORG_ID}}/flow.json`
