#!/usr/bin/env bash

#MISE description="Build the landing page as a static site"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

mkdir -p secrets
touch secrets/Config.secrets # In build this doesn't exist
source tasks/_common.sh

# Render's static runtime has node but not necessarily the pnpm we lock with.
if ! command -v pnpm >/dev/null 2>&1; then
    npm install -g pnpm@11.0.9
fi

log info "Building the landing page"

# Where the links of the page point comes from WEBUI_URL and DOCS_URL, if set,
# and otherwise from src/Config.global (see src/landing/vite.config.mts).
pnpm install --frozen-lockfile --filter @jupiter/landing...
(cd src/landing && pnpm exec react-router build)

log info "Landing page built in src/landing/build/client"
