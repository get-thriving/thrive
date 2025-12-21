#!/usr/bin/env bash

#MISE description="Generate Playwright test code using codegen"
#USAGE arg "[environ]" help="Jupiter environ (defaults to standard environ)"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi
webapi_url=$(get_jupiter_url "$environ" webapi)
webui_url=$(get_jupiter_url "$environ" webui)
docs_url=$(get_jupiter_url "$environ" docs)

wait_for_service_to_start webapi "$webapi_url"
wait_for_service_to_start webui "$webui_url"
wait_for_service_to_start docs "$docs_url"

playwright codegen "$webui_url"
