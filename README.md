# orgos

`orgos` is an agent-first organizational operating system. It is being built as
an observable local environment where shared system infrastructure, active
organization data, staffed agent identities, flow sequencing, memory, files,
and text assets all live on disk in readable JSON, Markdown, and plaintext.

This is an experimental local application. The capabilities below describe the
committed implementation; this documentation review does not certify every
autonomous workflow, inference model or browser interaction.

## Current scope

The repository now includes a working desktop-style shell plus the first
organization and orchestration applications:

- `Sources`
  shared inference source discovery, verification, tiering, and context windows
- `Color`
  live system theme and accent control
- `Files`
  orgos filesystem browser rooted in system, organization, and deleted areas
- `Text`
  raw and parsed editing for supported text assets
- `Web`
  organization intranet fragments, preview, and custom-tool test surface
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
- `Status`
  deeper monitoring for system and organization runtime state
- `About`
  organization records, metadata, archetypes, overrides, and lifecycle editing
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
  organization index, open-org runtime state, active org, and appearance overrides
- `.data/system/notifications.json`
  Board notification inbox and unread state
- `.data/system/telemetry.json`
  deterministic inference and queue telemetry rollups
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
- `.data/organizations/<org-id>/memory/datamap.json`
  deterministic full-memory datamap with citations back to source files
- `.data/organizations/<org-id>/orgos-runtime.json`
  org bootstrap/runtime summary for the organization-scoped orgos instance
- `.data/organizations/<org-id>/web/`
  intranet fragments and preview source files

### `.agents/` and `.skills/`

Shared reusable assets available to the system and its agents:

- `.agents/`
  role templates, including the shared system-level `orgos` agent
- `.skills/`
  shared skill definitions that expose orgos capabilities to internal agents

## Current operating model

- System-level infrastructure lives above organization silos.
- Multiple organizations can remain open simultaneously while one is visually active.
- The desktop runtime sidebar is the primary monitor/switcher for open organizations,
  their auto or idle state, Board notification status, and create-new flow.
- Organization apps are the primary visible desktop tools.
- System apps live in the slide-out system tray.
- `Status` is the deep monitoring panel for runtime observability.
- Organization-facing applications persist their data inside the active
  organization folder.
- `Sources` tracks inference tiers and context windows:
  - standard sources default to `128k`
  - top-tier `gemma4:26b` defaults to `256k`
- `Staff` is the organization-structure source of truth.
- `Flow` is objective-driven and queue-aware, not time-of-day based.
- `Web` is fragment-based and stored inside each organization silo.
- `Auto` mode can bootstrap initial executive staffing and memory for:
  - `CEO`
  - `COO`
  - `CTO`
  - `Orgos`
  - `Facilitator`
- Identity memory is observable on disk and structured for later consolidation,
  reflection, compaction, and deterministic datamap generation.
- The shared system-level `orgos` agent coordinates infrastructure, notifications,
  facilitation, and cross-app workflows above individual organizations.

Design handoff notes:

- `docs/workspace-paradigm.md`
  product-level information architecture and runtime responsibilities
- `docs/design-system.md`
  shell, component, and responsive UI primitives for future teams

## Development

Install Bun, clone this repository and run from its root. The package manifest
declares no external dependencies and no build step:

```sh
git clone https://github.com/benmcnulty/orgos.git
cd orgos
```

Run the local development server with:

```bash
bun run dev
```

Default local URL:

```text
http://127.0.0.1:52464/
```

The server binds to `127.0.0.1`. `PORT` overrides the default port; for PowerShell,
set `$env:PORT = '52465'` before `bun run dev`. `bun run start` runs the same
entrypoint without watching. Stop it with Ctrl+C.

Configure inference sources through the Sources app. Model availability and
capacity belong to your chosen Ollama-compatible servers; this checkout does not
install them. Those configured endpoints receive inference input.

The ignored `.data/` directory holds mutable instance state. Start in a disposable
checkout for exploration and keep private organization data out of commits. The
optional `bun run seed:demo` writes demo records into `.data/`; use it only on a
fresh instance or after backing up existing state. It is not required to start.
Loopback binding does not sandbox tools or authenticate a remote deployment.

## Testing

Run the automated suite with:

```bash
bun test ./.system/tests
```

The committed test suite includes checks for:

- isolated server helpers and inference discovery logic
- persistence and filesystem APIs
- bootstrap payloads and org-scoped/system-scoped data boundaries
- UI regression for the integrated shell and application panels

## Guidance

Read the architecture notes in
[`docs/workspace-paradigm.md`](docs/workspace-paradigm.md) and
[`docs/design-system.md`](docs/design-system.md). Runtime role templates live in
[`.agents`](.agents), with reusable skill definitions in [`.skills`](.skills).
`AGENTS.md` and `CLAUDE.md` are ignored and are not distributed in this public tree.

For contributions, describe the affected application/state boundary and provide
actual test results. Use isolated state for persistence tests, and state which
live inference and browser checks remain unverified. This documentation-only
review did not run the suite or seed an instance.

## License

This project is licensed under the MIT License. See `LICENSE`.
