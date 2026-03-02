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

### Running services

All 4 services are started together via PM2. To generate the PM2 config and start services:

```bash
source src/Config.global
source infra/Config.infra
source secrets/Config.secrets
export RUN_ROOT=.build-cache/run STANDARD_INSTANCE=dev STANDARD_WEBAPI_PORT=8004 STANDARD_API_PORT=8020 STANDARD_WEBUI_PORT=10020 STANDARD_DOCS_PORT=8000
mkdir -p $RUN_ROOT/dev
data=$(jo instance="dev" webapiLogFile="../../$RUN_ROOT/dev/webapi.log" webapiSqliteDbUrl="sqlite+aiosqlite:///../../$RUN_ROOT/dev/jupiter.sqlite" webapiPort="8004" webapiServerUrl="http://localhost:8004" apiLogFile="../../$RUN_ROOT/dev/api.log" apiPort="8020" apiServerUrl="http://localhost:8020" webuiLogFile="../../$RUN_ROOT/dev/webui.log" webuiPort="10020" webuiServerUrl="http://localhost:10020" docsLogFile="../../$RUN_ROOT/dev/docs.log" docsPort="8000" docsServerUrl="http://localhost:8000" docsPublicName="Thrive" docsAuthor="Horia Coman" docsCopyright="2026 Horia Coman")
node tasks/_resources/render-hbs.mjs tasks/_resources/pm2.config.ci.js.hbs "$data" > $RUN_ROOT/dev/pm2.config.js
npx pm2 --no-color start $RUN_ROOT/dev/pm2.config.js
```

Check service status: `npx pm2 status`. Check logs: `tail .build-cache/run/dev/<service>.log`.

### Gotchas

- The `secrets/` directory is gitignored and must exist with a `Config.secrets` file (can be empty) before running services. It is sourced by `tasks/_common.sh`.
- `STANDARD_API_PORT` is referenced in `tasks/run/srv.sh` but not defined in `_common.sh`; set it to `8020`.
- pnpm may fail to install via mise due to GitHub API rate limits. Fallback: `npm install -g pnpm`.
- The generated TS WebAPI client (`gen/ts/webapi-client`) must be compiled with `npx tsc` before the WebUI can build/run.
- There is a pre-existing TypeScript error in `src/core/jupiter/core/infra/component/use-big-screen.ts`; `npx tsc` in `src/webui` will report it but the Remix dev server still runs fine.

### Lint & test commands

- Python lint (ruff): `uv run ruff check --cache-dir=.build-cache/ruff --config=./tasks/_resources/check/lint/ruff.toml src/<package>`
- Python lint (pyflakes): `uv run pyflakes src/<package>`
- TS/JS lint (ESLint): `npx eslint src/webui`
- Core tests: `python -m pytest src/core -x -q`
- See `package.mise.toml` files in each package for all available lint/test tasks.
