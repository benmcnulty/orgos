# Workspace Paradigm

`orgos` is a multi-organization operating environment, not a single-workspace app.

## Core desktop model

- The left runtime sidebar is the primary control surface for organizations.
- Multiple organizations may remain open at once.
- Exactly one organization is visually active in the workspace.
- Open organizations may continue autonomous work in the background.
- Per-organization runtime controls live once in the sidebar:
  - open/close
  - active/focus
  - auto/idle
  - notification summary

## App grouping

- Organization apps are the primary desktop tools.
- System apps live in the slide-out system tray.
- `About` is an organization app and deeper editor.
- `Status` is the monitoring surface for runtime detail.

## Desktop vs panel responsibilities

- Desktop:
  - quick switching
  - glanceable runtime status
  - access to organization apps
  - access to the system tray
- Status panel:
  - deeper organization and system monitoring
  - queue pressure
  - notification summaries
  - open-organization activity
- About panel:
  - organization metadata
  - archetype
  - appearance override
  - lifecycle operations

## Product intent

The shell should optimize for:

- efficient human observability
- efficient switching between concurrently running organizations
- a clear distinction between shared system infrastructure and organization-scoped work
- a stable substrate for autonomous agent workflows and future UI refinement

UI extension should follow the shared component rules documented in
`docs/design-system.md`.

This file is a handoff note for future teams. The exact visuals may evolve, but the runtime information architecture above is the intended product contract.
