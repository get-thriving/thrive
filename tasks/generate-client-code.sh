#!/usr/bin/env bash

set -ex

#MISE description="Generate client code for TypeScript and Python from OpenAPI spec"

source scripts/common.sh

webapi_port=$(get_free_port)
webapi_url=http://0.0.0.0:${webapi_port}
webui_port=$(get_free_port)

run_jupiter apigen "$webapi_port" "$webui_port" wait:webapi no-monit ci pm2

mkdir -p gen/ts
mkdir -p gen/py

mkdir -p .build-cache/apigen
rm -f .build-cache/apigen/openapi.json
http --timeout 2 get "$webapi_url/openapi.json" > .build-cache/apigen/openapi.json

stop_jupiter apigen

npx openapi \
    --input .build-cache/apigen/openapi.json \
    --request gen/ts/webapi-client/request-template.ts \
    --output gen/ts/webapi-client/gen \
    --client fetch \
    --name ApiClient

(cd gen/ts/webapi-client && npx tsc)

trap "rm -rf jupiter-webapi-client" EXIT
rm -rf gen/py/webapi-client
poetry run openapi-python-client generate --path .build-cache/apigen/openapi.json
mv jupiter-webapi-client gen/py/webapi-client
