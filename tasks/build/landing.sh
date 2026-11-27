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

# Where the links of the page point comes from WEBUI_URL, DOCS_URL, COMMUNITY_URL,
# SOURCE_URL and SUPPORT_EMAIL, in the environment or in src/Config.global, and
# the build stops if one is missing (see src/landing/vite.config.mts).
#
# Render's RENDER_EXTERNAL_URL is always the onrender.com address, even for a
# service with a custom domain, so production must not take the links from the
# sibling services: it links to the hosted apps. Only a pull request preview
# (IS_PULL_REQUEST=true) links to the previews of its own WebUI and docs, which
# render.yaml hands over as PREVIEW_WEBUI_URL and PREVIEW_DOCS_URL.
#
# A production build on Render ignores WEBUI_URL and DOCS_URL altogether: Render
# keeps an env var on the service after it is removed from render.yaml, so a
# stale one (the old onrender.com address) would silently win over the hosted
# domains.
if [[ "${IS_PULL_REQUEST:-}" == "true" ]]; then
    export WEBUI_URL="${PREVIEW_WEBUI_URL:-${WEBUI_URL:-$HOSTED_GLOBAL_WEBUI_URL}}"
    export DOCS_URL="${PREVIEW_DOCS_URL:-${DOCS_URL:-$HOSTED_GLOBAL_DOCS_URL}}"
elif [[ "${RENDER:-}" == "true" ]]; then
    export WEBUI_URL="$HOSTED_GLOBAL_WEBUI_URL"
    export DOCS_URL="$HOSTED_GLOBAL_DOCS_URL"
else
    export WEBUI_URL="${WEBUI_URL:-$HOSTED_GLOBAL_WEBUI_URL}"
    export DOCS_URL="${DOCS_URL:-$HOSTED_GLOBAL_DOCS_URL}"
fi
pnpm install --frozen-lockfile --filter @jupiter/landing...
(cd src/landing && pnpm exec react-router build)

log info "Landing page built in src/landing/build/client"
