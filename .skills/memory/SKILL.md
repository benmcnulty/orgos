---
name: Memory
description: Store, recall, reflect on, and organize persistent agent memory. Memory persists across sessions in .data/organizations/<id>/memory/. Use to avoid redundant work and build organizational knowledge over time.
version: 1.0.0
tools:
  - file_read
  - file_write
  - file_list
context: 3072
---

# Memory Skill

Provides structured persistent memory for agents, stored in the organization's memory directory.

## Operations

### Memorize
Save a new memory entry.

**Format**: Markdown file with frontmatter
**Path**: `.data/organizations/{{ORG_ID}}/memory/<category>/<slug>.md`

```markdown
---
type: fact | decision | context | reference
category: <domain>
created: {{TIMESTAMP}}
tags: [<tag1>, <tag2>]
---

<memory content>
```

**Categories**: `decisions`, `facts`, `context`, `references`, `procedures`

### Recall
Search for relevant memories by reading the memory directory and filtering by category or tag.

```
LIST: organizations/{{ORG_ID}}/memory/
→ READ relevant files
→ Return matching content with file path for citation
```

### Reflect
After completing a significant task, write a reflection memory:
- What was the goal?
- What approach was taken?
- What worked, what didn't?
- What should be done differently next time?

### Organize
Periodically consolidate memory files:
- Merge duplicate or overlapping entries
- Archive stale entries (older than 90 days with no recall)
- Produce a `MEMORY_INDEX.md` with a summary of current memory contents

### Compact
When memory directory exceeds 50 files, compact by:
1. Reading all files
2. Grouping by category
3. Merging related entries into consolidated documents
4. Deleting merged source files

## Memory File Naming

```
<category>/<YYYY-MM-DD>-<slug>.md

Examples:
  decisions/2026-04-01-infrastructure-approach.md
  facts/2026-04-05-gemma4-model-tiers.md
  context/2026-04-05-current-org-priorities.md
```

## When to Use This Skill

- Before starting a task: recall relevant prior decisions or context
- After completing a task: memorize key outcomes and learnings
- When asked a question answered in prior sessions: recall before reasoning from scratch

## Anti-Patterns

- Do not memorize raw conversation transcripts — extract the key insight
- Do not create a new file for every small fact — batch related facts
- Do not recall indiscriminately — retrieve targeted to the current task
- Do not store duplicates — check for existing entries before writing
