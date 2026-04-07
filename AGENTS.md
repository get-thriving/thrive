# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Thrive (codenamed Jupiter) is a life planning tool with a monorepo containing:

| Service | Tech |
|---|---|
| **WebAPI** (backend) | Python/FastAPI, SQLite |
| **WebUI** (frontend) | TypeScript/Remix/React |
| **API** | Python/FastAPI |
| **MCP** | Python/FastAPI |
| **Docs** | Python/MkDocs |

### Tool versions

The project uses **mise** as its tool/task runner. Required tools: Python 3.13.0, Node 22.14.0, pnpm, uv. Activate mise in your shell with `eval "$(~/.local/bin/mise activate bash)"`.

### Installing dependencies

```bash
mise run install
mise run prepare
```

### Running services

Start all 5 services (WebAPI, API, MCP, WebUI, Docs) via mise:

```bash
mise run run:srv --instance <instance-name>
```

Then open the browser to the running instance:

```bash
mise run run:web --instance <instance-name>
```

Check service status: `npx pm2 status`. Check logs: `tail .build-cache/run/<instance-name>/<service>.log`.

## Generating code

Whenever some model from the core package is changed, code on the
client-side needs to be updated too. This is achieved by running:

```bash
mise run generate-client-code
```

This is the **only** way to properly update the code in `gen`.
This script exits non-zero on failure — wait for the line Client code generation complete on stderr before considering it done

## Adding migrations

If you want to make changes to the database, generate a migration
scaffold with

```bash
mise run add-migration "The name of the migration"
```

This will generate a new file in src/core/migrations/versions, link it in the sequence of migrations,
and you can then edit it there, based on the patterns established.

### Lint, fix & check commands

- Auto-fix: `mise run lint:fix`
- Lint check: `mise run lint:lint`
- Full check: `mise run check`

### Gotchas

- The `secrets/` directory is gitignored and must exist with a `Config.secrets` file (can be empty) before running services. It is sourced by `tasks/_common.sh`.
- The generated TS WebAPI client (`gen/ts/webapi-client`) must be compiled (handled by `mise run prepare`) before the WebUI can build/run.
- There is a pre-existing TypeScript error in `src/core/jupiter/core/infra/component/use-big-screen.ts`; `npx tsc` in `src/webui` will report it but the Remix dev server still runs fine.
