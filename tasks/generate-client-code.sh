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

log info "Starting Jupiter for API generation with port $webapi_port"

run_jupiter_webapp apigen "$webapi_port" "$webui_port" wait:webapi no-monit ci pm2

log info "Extracting OpenAPI spec from WebAPI"

mkdir -p .build-cache/apigen
rm -f .build-cache/apigen/openapi.json
http --timeout 2 get "$webapi_url/openapi.json" > .build-cache/apigen/openapi.json

log info "Stopping Jupiter for API generation"

stop_jupiter_webapi apigen

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
npx hbs-cli --stdout -D "$ts_package_json" tasks/_resources/ts-package.mise.toml.hbs > gen/ts/$PACKAGE_NAME/package.mise.toml

log info "Generating Python client code"

mkdir -p gen/py

trap "rm -rf jupiter-webapi-client" EXIT
rm -rf gen/py/$PACKAGE_NAME
poetry run openapi-python-client generate --path .build-cache/apigen/openapi.json --meta poetry
mv jupiter-webapi-client gen/py/$PACKAGE_NAME

py_package_json="$(jo packageName="$PACKAGE_NAME")"
npx hbs-cli --stdout -D "$py_package_json" tasks/_resources/py-package.mise.toml.hbs > gen/py/$PACKAGE_NAME/package.mise.toml

log info "Rebuilding mise.toml files"

mise tasks run rebuild-mise gen/ts/$PACKAGE_NAME/package.mise.toml gen/py/$PACKAGE_NAME/package.mise.toml
mise tasks run prepare
