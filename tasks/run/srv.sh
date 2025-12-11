#!/usr/bin/env bash

#MISE description="Run Jupiter server with optional environ and mode"
#USAGE flag "--environ <environ>" help="Jupiter environ (defaults to standard environ)"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--run-mode <runMode>" default="pm2" help="Run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"
: "${usage_run_mode:=pm2}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

# Set ports based on environ
if [[ -z "${environ}" ]]; then
    environ=$STANDARD_ENVIRON
    webapi_port=$STANDARD_WEBAPI_PORT
    webui_port=$STANDARD_WEBUI_PORT
    docs_port=$STANDARD_DOCS_PORT
elif [[ "${environ}" == "+gen" ]]; then
    environ=$(get_environ)
    webapi_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
else
    webapi_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
fi

run_jupiter_webapp "$environ" "$webapi_port" "$webui_port" "$docs_port" no-wait monit dev "$usage_run_mode"
