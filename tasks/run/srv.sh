#!/usr/bin/env bash

#MISE description="Run Jupiter server with optional environ and mode"
#USAGE flag "--universe <universe>" default="local-dev" help="Jupiter universe"
#USAGE flag "--environ <environ>" help="Jupiter environ (defaults to standard environ)"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--source <source>" default="local" help="Jupiter source" {
#USAGE   choices "local" "registry"
#USAGE }
#USAGE flag "--version <version>" default="latest" help="Jupiter version"
#USAGE flag "--run-mode <runMode>" default="pm2" help="Run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_environ:=}"
: "${usage_source:=}"
: "${usage_version:=}"
: "${usage_run_mode:=}"

set -e -o pipefail

source tasks/_common.sh

# Set ports based on environ
if [[ -z "${usage_environ}" ]]; then
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
    environ="${usage_environ}"
    webapi_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
fi

echo "environ: $environ"

run_jupiter_webapp "$environ" "$webapi_port" "$webui_port" "$docs_port" no-wait monit dev "$usage_source" "$usage_version" "$usage_run_mode"
