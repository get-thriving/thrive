#!/usr/bin/env bash

#MISE description="Generate client code for TypeScript and Python from OpenAPI spec"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

log info "Generating client code for TypeScript and Python from OpenAPI spec"

# --- Port allocation ---
webapi_port=$(get_free_port)
webapi_postgres_port=$(get_free_port)
api_port=$(get_free_port)
webui_port=$(get_free_port)
docs_port=$(get_free_port)
mcp_port=$(get_free_port)
webapi_url="http://0.0.0.0:${webapi_port}"

log info "Allocated ports: webapi=$webapi_port api=$api_port webui=$webui_port docs=$docs_port mcp=$mcp_port"

# --- Cleanup trap (set once, covers everything) ---
_cleanup() {
    local exit_code=$?
    log info "Cleaning up: stopping pm2, removing temp files..."
    npx pm2 delete "$RUN_ROOT/apigen/pm2.config.js" 2>/dev/null || true
    rm -rf config.yaml
    rm -rf jupiter_webapi_client
    exit "$exit_code"
}
trap _cleanup EXIT

# --- Start services ---
log info "Starting Jupiter for API generation on webapi port $webapi_port"
run_jupiter_webapp \
    dev apigen \
    "$webapi_port" "$webapi_postgres_port" "$api_port" "$webui_port" "$docs_port" "$mcp_port" \
    wait:webapi no-monit ci local latest pm2

# --- Extract OpenAPI spec ---
log info "Extracting OpenAPI spec from $webapi_url/openapi.json"
mkdir -p .build-cache/apigen
rm -f .build-cache/apigen/openapi.json

# Use longer timeout here — service just started
if ! http --follow --timeout 30 --verify=no --check-status \
        get "${webapi_url/0.0.0.0/localhost}/openapi.json" \
        > .build-cache/apigen/openapi.json; then
    log error "Failed to fetch openapi.json from $webapi_url"
    exit 1
fi

# Validate we got actual JSON, not an error page
if ! python3 -c "import sys, json; json.load(sys.stdin)" < .build-cache/apigen/openapi.json; then
    log error "openapi.json is not valid JSON — service may have returned an error page"
    cat .build-cache/apigen/openapi.json >&2
    exit 1
fi

log info "OpenAPI spec extracted ($(wc -c < .build-cache/apigen/openapi.json) bytes)"

# --- Stop services (cleanup trap will also handle this, but stop early to free ports) ---
log info "Stopping Jupiter for API generation"
npx pm2 delete "$RUN_ROOT/apigen/pm2.config.js" 2>/dev/null || true

# --- Generate TypeScript client ---
log info "Generating TypeScript client code"
mkdir -p gen/ts
export PACKAGE_NAME=webapi-client

npx openapi \
    --input .build-cache/apigen/openapi.json \
    --request "gen/ts/$PACKAGE_NAME/request-template.ts" \
    --output "gen/ts/$PACKAGE_NAME/gen" \
    --client fetch \
    --name ApiClient

ts_package_json="$(jo packageName="$PACKAGE_NAME")"
node tasks/_resources/render-hbs.mjs \
    tasks/_resources/ts-package.mise.toml.hbs \
    "$ts_package_json" \
    > "gen/ts/$PACKAGE_NAME/package.mise.toml"

# --- Generate Python client ---
log info "Generating Python client code"
mkdir -p gen/py

cat > config.yaml <<'EOF'
project_name_override: jupiter_webapi_client
package_name_override: jupiter_webapi_client
EOF

rm -rf "gen/py/$PACKAGE_NAME"
uvx openapi-python-client generate \
    --config config.yaml \
    --path .build-cache/apigen/openapi.json \
    --meta uv
mv jupiter_webapi_client "gen/py/$PACKAGE_NAME"

py_package_json="$(jo packageName="$PACKAGE_NAME")"
node tasks/_resources/render-hbs.mjs \
    tasks/_resources/py-package.mise.toml.hbs \
    "$py_package_json" \
    > "gen/py/$PACKAGE_NAME/package.mise.toml"

# --- Rebuild mise ---
log info "Rebuilding mise.toml files"
mise tasks run rebuild-mise \
    "gen/ts/$PACKAGE_NAME/package.mise.toml" \
    "gen/py/$PACKAGE_NAME/package.mise.toml"
mise tasks run prepare

log info "Client code generation complete."
