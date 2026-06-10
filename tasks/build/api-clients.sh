#!/usr/bin/env bash

#MISE description="Build TypeScript and Python client packages from the API service's OpenAPI spec"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

log info "Building API client packages from OpenAPI spec (version: ${VERSION})"

webapi_port=$(get_free_port)
webapi_postgres_port=$(get_free_port)
api_port=$(get_free_port)
mcp_port=$(get_free_port)
webui_port=$(get_free_port)
published_port=$(get_free_port)
docs_port=$(get_free_port)
api_url=http://0.0.0.0:${api_port}

log info "Starting Jupiter for API client build with api port $api_port"

run_jupiter_webapp dev apigen "$webapi_port" "$webapi_postgres_port" "$api_port" "$webui_port" "$published_port" "$docs_port" "$mcp_port" wait:api no-monit ci local latest pm2 "" sqlite local sql noop

log info "Extracting OpenAPI spec from API service"

mkdir -p .build-cache/apigen
rm -f .build-cache/apigen/api-openapi.json
http --ignore-stdin --timeout 2 get "$api_url/openapi.json" > .build-cache/apigen/api-openapi.json

log info "Stopping Jupiter for API client build"

stop_jupiter_webapp apigen

PACKAGE_NAME=api-client

log info "Building TypeScript client package"

mkdir -p ".build-cache/clients/${VERSION}/ts/${PACKAGE_NAME}/gen"

npx openapi \
    --input .build-cache/apigen/api-openapi.json \
    --output ".build-cache/clients/${VERSION}/ts/${PACKAGE_NAME}/gen" \
    --client fetch \
    --name ApiClient

log info "Building Python client package"

python_generation_config=$(cat <<'EOF'
project_name_override: jupiter_api_client
package_name_override: jupiter_api_client
EOF
)

echo "$python_generation_config" > config.yaml

mkdir -p ".build-cache/clients/${VERSION}/py/${PACKAGE_NAME}"

trap "rm -rf jupiter_api_client config.yaml" EXIT
rm -rf ".build-cache/clients/${VERSION}/py/${PACKAGE_NAME}"
uvx openapi-python-client generate --config config.yaml --path .build-cache/apigen/api-openapi.json --meta uv
mv jupiter_api_client ".build-cache/clients/${VERSION}/py/${PACKAGE_NAME}"
