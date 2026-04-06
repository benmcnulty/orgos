# orgos

`orgos` is an agent-first organizational operating system. It is being built as
an observable local environment where shared system infrastructure, active
organization data, staffed agent identities, flow sequencing, memory, files,
and text assets all live on disk in readable JSON, Markdown, and plaintext.

## Current scope

The repository now includes a working desktop-style shell plus the first
organization and orchestration applications:

- `About`
  organization records, activation, and siloed org metadata
- `Sources`
  shared inference source discovery, verification, tiering, and context windows
- `Color`
  live system theme and accent control
- `Files`
  orgos filesystem browser rooted in system, organization, and deleted areas
- `Text`
  raw and parsed editing for supported text assets
- `Agents`
  shared role-template definitions
- `Skills`
  shared skill registry
- `Tools`
  shared tool registry and orgos-integrated operations
- `Flow`
  continuous objective sequencing instead of human calendar scheduling
- `Meet`
  structured group discussion and consensus capture
- `Mail`
  human/agent and agent/agent messaging
- `Queue`
  inference dispatch and node telemetry observability
- `Staff`
  departments, teams, roles, staffed identities, and executive bootstrap
- `Projects`
  participant and output-focused project definition
- `Evals`
  quality and expectation records for workflows and assets

## Architecture

### `.system/`

Owns runtime and application code:

- `.system/server/`
  Bun server, persistence APIs, inference discovery, bootstrap, and queue logic
- `.system/public/`
  HTML, CSS, and JavaScript for the shell and applications
- `.system/tests/`
  unit, integration, and regression coverage

### `.data/`

Owns instance-specific system and organization state:

- `.data/system/appearance.json`
  shared appearance and theme state
- `.data/system/sources.json`
  shared inference sources, tiers, and context windows
- `.data/system/organizations.json`
  organization index and active-org state
- `.data/system/deleted/<org-id>/`
  per-organization deleted-file area
- `.data/organizations/<org-id>/about.json`
  organization metadata
- `.data/organizations/<org-id>/staff.json`
  departments, teams, roles, and staffed identities
- `.data/organizations/<org-id>/flow.json`
  continuous sequencing and bootstrap flow records
- `.data/organizations/<org-id>/mail.json`
  organization mail records
- `.data/organizations/<org-id>/meetings.json`
  meeting records
- `.data/organizations/<org-id>/projects.json`
  project records
- `.data/organizations/<org-id>/evals.json`
  evaluation records
- `.data/organizations/<org-id>/memory/`
  per-identity memory silos with JSON maps and markdown/text artifacts

### `.agents/` and `.skills/`

Shared reusable assets available to the system and its agents:

- `.agents/`
  role templates and prompt-oriented agent definitions
- `.skills/`
  shared skill definitions that expose orgos capabilities to internal agents

## Current operating model

- System-level infrastructure lives above organization silos.
- Organization-facing applications persist their data inside the active
  organization folder.
- `Sources` tracks inference tiers and context windows:
  - standard sources default to `128k`
  - top-tier `gemma4:26b` defaults to `256k`
- `Staff` is the organization-structure source of truth.
- `Flow` is objective-driven and queue-aware, not time-of-day based.
- `Auto` mode can bootstrap initial executive staffing and memory for:
  - `CEO`
  - `COO`
  - `CTO`
  - `Facilitator`
- Identity memory is observable on disk and structured for later consolidation,
  reflection, and compaction.

## Development

Run the local development server with:

```bash
bun run dev
```

Default local URL:

```text
http://127.0.0.1:52464/
```

## Testing

Run the automated suite with:

```bash
bun test ./.system/tests/*.test.ts
```

The test suite covers:

- isolated server helpers and inference discovery logic
- persistence and filesystem APIs
- bootstrap payloads and org-scoped/system-scoped data boundaries
- UI regression for the integrated shell and application panels

## Guidance

Repository guidance for implementation agents is documented in:

- `AGENTS.md`
- `CLAUDE.md`

## License

This project is licensed under the MIT License. See `LICENSE`.
