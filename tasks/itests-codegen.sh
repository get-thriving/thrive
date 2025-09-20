#!/usr/bin/env bash

set -ex

#MISE description="Generate Playwright test code using codegen"
#USAGE arg "[namespace]" help="Jupiter namespace (defaults to standard namespace)"

: "${usage_namespace:=}"

source scripts/common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi
webapi_port=$(get_jupiter_port "$namespace" webapi)
webapi_url="http://0.0.0.0:${webapi_port}"
webui_port=$(get_jupiter_port "$namespace" webui)
webui_url="http://0.0.0.0:${webui_port}"

wait_for_service_to_start webapi "$webapi_url"
wait_for_service_to_start webui "$webui_url"

playwright codegen "$webui_url"
