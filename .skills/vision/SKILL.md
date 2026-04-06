---
name: Vision
description: Capture screenshots of the application UI and analyze image content. Use for visual verification, UI inspection, accessibility review, and generating image-grounded descriptions.
version: 1.0.0
tools:
  - screenshot
  - image_analyze
context: 2048
---

# Vision Skill

Provides screenshot capture and image analysis for the orgos UI and external images.

## Operations

### Screenshot
Capture the current state of the application UI.

**Output**: PNG image passed directly to the vision model
**Scope**: Full-page or element-scoped capture

```
SCREENSHOT: full | element:#panel-id
→ Returns image for analysis
```

### Analyze
Describe or extract information from an image.

**Input**: Image (from screenshot or provided URL)
**Output**: Structured description or extracted data

**Usage pattern**:
```
SCREENSHOT: full
→ ANALYZE: What panels are currently open?
→ ANALYZE: Are there any visible error states?
→ ANALYZE: What is the current agent queue status shown?
```

### UI Verification
Use to confirm that a UI change produced the expected visual result:
1. Capture screenshot before the change
2. Apply the change
3. Capture screenshot after
4. Compare: describe the difference and confirm the expected outcome

### Accessibility Review
Analyze a screenshot for:
- Sufficient color contrast (describe foreground/background approximations)
- Text legibility at current font size
- Interactive elements that appear non-interactive
- Crowded or overlapping elements

## When to Use This Skill

- After making CSS or layout changes, verify visually
- When a user reports a visual bug, capture and describe the state
- When producing documentation that requires UI descriptions
- When an agent task involves visual design or layout decisions

## Anti-Patterns

- Do not use vision as a substitute for reading DOM state — use API data where available
- Do not analyze images with sensitive personal information
- Do not generate screenshots in a background (non-interactive) context — requires UI availability
- Do not chain more than 3 screenshot-analyze cycles without a stopping condition
