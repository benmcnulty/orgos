---
name: Filesystem
description: Read, write, list, and delete files within the .data/ directory tree. All operations are scoped to the workspace data directory; path traversal outside .data/ is rejected by the server.
version: 1.0.0
tools:
  - file_read
  - file_write
  - file_list
  - file_delete
context: 2048
---

# Filesystem Skill

Provides scoped CRUD access to the `.data/` directory tree.

## Operations

### Read
Read the contents of a file.

**Path convention**: All paths are relative to `.data/`
**Example**: `organizations/org-abc123/about.json`

```
READ: organizations/{{ORG_ID}}/about.json
→ Returns file contents as string
→ Parse JSON if applicable
```

### Write
Create or overwrite a file with new content.

**Safety**: Always read before overwriting to avoid data loss.
**Atomicity**: Writes are direct; no transaction support.

```
WRITE: organizations/{{ORG_ID}}/memory/session-{{DATE}}.md
CONTENT: <markdown or JSON content>
```

### List
List files and directories at a path.

```
LIST: organizations/{{ORG_ID}}/
→ Returns array of filenames and subdirectories
```

### Delete
Remove a file. Cannot delete directories.

```
DELETE: organizations/{{ORG_ID}}/drafts/draft-001.json
```

## Directory Conventions

```
.data/
  system/
    organizations.json    — org index
    sources.json          — inference sources
    schedule.json         — scheduled tasks
  organizations/
    <org-id>/
      about.json          — org profile
      memory/             — persistent agent memory
      meetings/           — meeting records
      mail/               — inter-agent messages
```

## When to Use This Skill

- Persisting agent memory between sessions
- Reading organization context before a task
- Writing structured outputs (plans, reports, meeting minutes)
- Accessing schedule or configuration data

## Anti-Patterns

- Do not write raw, unstructured data — use JSON or markdown
- Do not overwrite `about.json` or `sources.json` without reading first
- Do not use relative paths with `..` — they will be rejected
- Do not store credentials, secrets, or PII in plaintext files
- Do not write temporary scratch files — compute in memory, write final outputs only
