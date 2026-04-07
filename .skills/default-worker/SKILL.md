# default-worker

Use this skill for general orgos worker execution when a more specialized skill is not required.

Core capabilities:
- read and write local memory artifacts
- browse, create, rename, and update files inside orgos
- inspect and edit plaintext and structured text artifacts
- use visual iteration support such as screenshots and interface inspection when available
- maintain concise handoff notes and deterministic records of work

Expected behavior:
1. Read the current objective and active organization context.
2. Inspect the relevant files, memory datamaps, and app state before acting.
3. Prefer deterministic server and filesystem workflows before inference-heavy exploration.
4. Leave observable notes, updated files, and clean status records for downstream workers.
5. Escalate to specialized skills only when the work clearly requires domain-specific behavior.
