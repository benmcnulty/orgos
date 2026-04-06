---
name: Coding
description: Write, run, review, and test scripts and code. Uses Bun as the execution runtime. Applies to automation scripts, data transformation, API integration, and technical validation tasks.
version: 1.0.0
tools:
  - bash
  - file_read
  - file_write
context: 4096
---

# Coding Skill

Provides code writing, execution, and review capabilities using Bun as the runtime.

## Operations

### Script
Write a TypeScript or JavaScript script to accomplish a task.

**Runtime**: Bun (prefer Bun built-ins over npm packages)
**Style**: TypeScript with strict types at module boundaries

```typescript
// Always start with clear intent comment
// Script: <what this does>
// Input: <what it expects>
// Output: <what it produces>

const result = await fetch(url).then(r => r.json());
console.log(JSON.stringify(result, null, 2));
```

### Run
Execute a script or shell command via Bash.

```
RUN: bun run .system/scripts/<name>.ts
RUN: bun test .system/tests/*.test.ts
```

**Capture output**: Always capture stdout/stderr for analysis.

### Review
Analyze existing code for issues:

1. **Correctness**: Does it do what it claims?
2. **Safety**: Path traversal, injection, unvalidated input?
3. **Error handling**: Unhandled rejections, silent failures?
4. **Performance**: Unnecessary awaits in loops, unbounded data reads?
5. **Style**: Consistent with project conventions?

### Update
Modify existing code based on review findings or new requirements. Always:
1. Read the current file
2. Understand the change scope
3. Apply the minimal change that achieves the goal
4. Re-read to verify no unintended changes

### Test
Write or run tests to validate behavior.

**Framework**: Bun's built-in test runner
**Location**: `.system/tests/*.test.ts`
**Command**: `bun test .system/tests/*.test.ts`

```typescript
import { test, expect } from "bun:test";

test("description of behavior", () => {
  expect(actual).toBe(expected);
});
```

## Code Standards

- `const` over `let`; no `var`
- `async/await` over Promise chains
- Optional chaining (`?.`) and nullish coalescing (`??`)
- Explicit error messages at boundaries: `throw new Error("X failed: " + detail)`
- No hardcoded paths — use relative paths from project root
- No external npm packages unless explicitly approved

## Anti-Patterns

- Do not write scripts that delete or overwrite files without reading first
- Do not run commands that affect system state outside `.data/` and `.system/`
- Do not loop on a shell command without a clear exit condition
- Do not import packages not already in `package.json`
- Do not write `// TODO` comments in production code — finish the task or raise it explicitly
