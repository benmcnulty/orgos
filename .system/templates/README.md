# orgos Template Library

This directory contains reusable system-level organizational assets for orgos.

The template catalog is intentionally observable and file-backed so both humans
and agents can inspect, reuse, and evolve the organizational patterns that
power org bootstrap and staffing.

## Current contents

- `catalog.json`
  Canonical system template catalog for:
  - organization archetypes
  - department templates
  - team templates
  - role templates
  - process templates
  - worker and domain bundles

## Design rules

- System templates are reusable patterns above all organization silos.
- Organizations can adapt or override these locally without mutating the source
  templates.
- Provenance should be preserved in organization-scoped data so orgos can tell
  whether a structure is inherited, customized, or local-only.
- Bundle definitions are the preferred way to express default worker capability
  and domain-specialized capability.
