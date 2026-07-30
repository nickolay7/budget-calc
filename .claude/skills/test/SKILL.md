---
name: test
description: Run a test file by path
argumentsHint: "test_file_path"
allowedTools:
  - Bash(jest *)
  - Bash(npx jest *)
  - Bash(vitest *)
  - Bash(npx vitest *)
model: claude-sonnet-4-5
---
# Test skill

Run a specific test file from the project.

## Args

| Position | Required | Description |
|---|---|---|
| `$0` | Yes | Path to test file, e.g. `apps/web/src/lib/utils.test.ts` |

## Usage

```
/test apps/api/test/app.e2e-spec.ts
/test apps/web/src/lib/utils.test.ts
```

## Workflow

1. Determine scope from path:
   - `apps/api/**` → API workspace (Jest)
   - `apps/web/**` → Web workspace (Vitest)
2. Run test file:
   - API e2e: `npx jest --config apps/api/test/jest-e2e.json $0`
   - Web: `npx vitest run $0 --config apps/web/vitest.config.ts`
3. Show test output (pass/fail summary + error details if any)
