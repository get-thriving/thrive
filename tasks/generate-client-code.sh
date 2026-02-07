#!/usr/bin/env bash

#MISE description="Generate client code for TypeScript and Python from OpenAPI spec"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

log info "Generating client code for TypeScript and Python from OpenAPI spec"

webapi_port=$(get_free_port)
webapi_url=http://0.0.0.0:${webapi_port}
webui_port=$(get_free_port)
docs_port=$(get_free_port)

log info "Starting Jupiter for API generation with port $webapi_port"

run_jupiter_webapp dev apigen "$webapi_port" "$webui_port" "$docs_port" wait:webapi no-monit ci local latest pm2

log info "Extracting OpenAPI spec from WebAPI"

mkdir -p .build-cache/apigen
rm -f .build-cache/apigen/openapi.json
http --timeout 2 get "$webapi_url/openapi.json" > .build-cache/apigen/openapi.json

log info "Stopping Jupiter for API generation"

stop_jupiter_webapp apigen

log info "Generating TypeScript client code"

mkdir -p gen/ts

export PACKAGE_NAME=webapi-client

npx openapi \
    --input .build-cache/apigen/openapi.json \
    --request gen/ts/$PACKAGE_NAME/request-template.ts \
    --output gen/ts/$PACKAGE_NAME/gen \
    --client fetch \
    --name ApiClient

ts_package_json="$(jo packageName="$PACKAGE_NAME")"

node tasks/_resources/render-hbs.mjs tasks/_resources/ts-package.mise.toml.hbs "$ts_package_json" > gen/ts/$PACKAGE_NAME/package.mise.toml

log info "Generating Python client code"

mkdir -p gen/py

python_generation_config=$(cat <<'EOF'
project_name_override: jupiter_webapi_client
package_name_override: jupiter_webapi_client
EOF
)

echo "$python_generation_config" > config.yaml

trap "rm -rf jupiter_webapi_client config.yaml" EXIT
rm -rf gen/py/$PACKAGE_NAME
uvx openapi-python-client generate --config config.yaml --path .build-cache/apigen/openapi.json --meta uv
mv jupiter_webapi_client gen/py/$PACKAGE_NAME

py_package_json="$(jo packageName="$PACKAGE_NAME")"
node tasks/_resources/render-hbs.mjs tasks/_resources/py-package.mise.toml.hbs "$py_package_json" > gen/py/$PACKAGE_NAME/package.mise.toml

log info "Rebuilding mise.toml files"

mise tasks run rebuild-mise gen/ts/$PACKAGE_NAME/package.mise.toml gen/py/$PACKAGE_NAME/package.mise.toml
mise tasks run prepare
