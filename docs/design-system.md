# Design System Notes

This project uses a single shell and panel design system. Future teams should
extend these primitives instead of creating app-specific variants.

## Shell primitives

- Runtime sidebar on the left for organization switching and per-org controls
- Heads-up dashboard cards in the desktop workspace for concise system/org
  summaries
- Organization app launcher grid in the main desktop workspace
- Slide-out system tray for shared infrastructure apps
- Pinned active application header tab with inactive-tab scrolling

## Shared interaction patterns

- Side-list collections use a consistent bottom or trailing `plus` action for
  creating new items
- Contextual actions should be icon-first with accessible labels and tooltips
- Per-organization runtime controls live only on organization cards in the
  sidebar
- Save, discard, delete, and busy-state affordances should remain consistent
  across panels

## Component expectations

- `mode-toggle` is the canonical auto/idle control and should not be redefined
  per app
- `desktop-org-card` is the canonical runtime card for organizations
- `desktop-dashboard__card` is the canonical summary-card surface
- `desktop-icon` is the canonical app launcher tile
- `chrome-button` and `icon-button` are the standard action controls

## Responsive contract

- Wide layouts keep sidebar and main workspace side by side
- Medium layouts preserve the same information architecture with denser grids
- Narrow layouts stack the sidebar and collapse summary/app grids intentionally
- No viewport should rely on overlap or hidden overflow to preserve layout

This document is intentionally short. It exists to preserve the UI contract and
prevent future teams from re-fragmenting the interface.
