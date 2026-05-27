#!/usr/bin/env bash

#MISE description="Generate Playwright test code using codegen"
#USAGE arg "[instance]" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi
webapi_url=$(get_dev_service_url "$instance" webapi:srv)
webui_url=$(get_dev_service_url "$instance" webui)

wait_for_service_to_start webapi:srv "$webapi_url"
wait_for_service_to_start webui "$webui_url"

playwright codegen "$webui_url"
