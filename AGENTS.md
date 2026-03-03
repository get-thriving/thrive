# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Thrive (codenamed Jupiter) is a life planning tool with a monorepo containing:

| Service | Port | Tech |
|---|---|---|
| **WebAPI** (backend) | 8004 | Python/FastAPI, SQLite |
| **Public API** | 8020 | Python/FastAPI (proxies to WebAPI) |
| **WebUI** (frontend) | 10020 | TypeScript/Remix/React |
| **Docs** | 8000 | Python/MkDocs |

### Tool versions

The project uses **mise** as its tool/task runner. Required tools: Python 3.13.0, Node 22.14.0, pnpm, uv. Activate mise in your shell with `eval "$(~/.local/bin/mise activate bash)"`.

### Installing dependencies

```bash
mise run install
mise run prepare
```

### Running services

Start all 4 services (WebAPI, API, WebUI, Docs) via mise:

```bash
mise run run:srv --instance <instance-name>
```

Then open the browser to the running instance:

```bash
mise run run:web --instance <instance-name>
```

Check service status: `npx pm2 status`. Check logs: `tail .build-cache/run/<instance-name>/<service>.log`.

### Lint, fix & check commands

- Auto-fix: `mise run lint:fix`
- Lint check: `mise run lint:lint`
- Full check: `mise run check`

### Gotchas

- The `secrets/` directory is gitignored and must exist with a `Config.secrets` file (can be empty) before running services. It is sourced by `tasks/_common.sh`.
- The generated TS WebAPI client (`gen/ts/webapi-client`) must be compiled (handled by `mise run prepare`) before the WebUI can build/run.
- There is a pre-existing TypeScript error in `src/core/jupiter/core/infra/component/use-big-screen.ts`; `npx tsc` in `src/webui` will report it but the Remix dev server still runs fine.
