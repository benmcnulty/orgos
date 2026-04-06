# orgos

`orgos` is a clean-slate reinvention of an organizational operating system
built first for the agents that will operate within it, with human-facing
surfaces added as observation and contribution layers rather than as the
primary organizing model.

## Current scope

The repository now includes the first working desktop-style operating shell:

- Bun serves a live-reloading local application
- `.system/` owns framework/runtime code
- `.data/` owns saved system configuration and organization data
- the browser renders an always-available header with the `orgos` mark,
  subtle display controls, and a tab rail for active applications
- the desktop currently exposes two application launchers:
  - `About`
  - `Sources`
- `About` manages organization records and active-organization selection
- `Sources` manages shared inference-source configuration and LAN discovery

This is still an early baseline. The goal is to establish the operating-system
patterns, data boundaries, and interaction contracts now so later agent
features can build on stable foundations instead of ad hoc UI.

## Applied technologies

- Bun as the runtime and development server
- Pure HTML for document structure
- Pure CSS for layout, geometry, reset behavior, and responsive scaling
- Pure JavaScript for browser behavior and application state
- Ollama-hosted Gemma-family inference sources

## Architecture

### `.system/`

Owns the reusable application and framework layer:

- `.system/server/`
  Bun server runtime, route handling, inference discovery, and persistence APIs
- `.system/public/`
  browser-delivered HTML, CSS, and JavaScript
- `.system/tests/`
  automated unit, integration, and regression tests

### `.data/`

Owns the instance-specific and user-generated layer:

- `.data/system/sources.json`
  shared inference-source configuration for the whole installation
- `.data/system/organizations.json`
  active organization index and system-level organization state
- `.data/organizations/<organization-id>/about.json`
  siloed organization metadata for each organization
- `.data/content/`
  instance presentation content such as the app title

The intended pattern is:

- system-level configuration above organization silos
- each organization in its own folder
- future agent-readable documents and outputs stored inside the active
  organization’s data space
- `.system/` updates remaining separate from local saved data

## Current UI contract

The current regression baseline includes:

- neutral gray desktop-style shell with a fixed top header
- embossed white hexagon/cube `orgos` mark centered in the header
- subtle icon-only fullscreen and exit-fullscreen controls
- tab rail at the bottom of the header for active applications
- desktop launcher tiles for:
  - `About`
  - `Sources`
- integrated application panels that fill the space below the header instead of
  floating as overlays
- `About` application with:
  - left sidebar of organizations
  - plus control for new organizations
  - organization detail form for name, industry, custom industry, and description
  - `save`, `load`, and `active` states
- `Sources` application with:
  - left sidebar of shared inference sources
  - localhost source active by default
  - authoritative LAN discovery of compatible Ollama nodes
  - prepopulated but inactive detected sources
  - verify flow that persists verified sources into system configuration
  - verified badge state and disabled verify control during verification
  - manual rescan and manual source creation/removal

## Development

Run the local development server with:

```bash
bun run dev
```

The default working URL for this repo is:

```text
http://127.0.0.1:52464/
```

## Testing

Run the automated suite with:

```bash
bun test ./.system/tests/*.test.ts
```

The suite covers:

- unit tests for helper logic and invariants
- integration tests for served routes, discovery APIs, and persisted data files
- regression tests for the current shell, application panels, and interaction baseline

## Agent guidance

Repository guidance for development agents is documented in:

- `AGENTS.md`
- `CLAUDE.md`

These files should evolve as the agent-first operating-system model becomes
more concrete.

## License

This project is licensed under the MIT License. See `LICENSE`.
