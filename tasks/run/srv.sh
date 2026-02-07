#!/usr/bin/env bash

#MISE description="Run Jupiter server with optional instance and mode"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe" {
#USAGE   choices "dev" "thrive-sh-test"
#USAGE }
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--source <source>" default="local" help="Jupiter source" {
#USAGE   choices "local" "registry"
#USAGE }
#USAGE flag "--version <version>" default="latest" help="Jupiter version"
#USAGE flag "--run-mode <runMode>" default="pm2" help="Run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE flag "--clear-first" help="Clear the instance first"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_instance:=}"
: "${usage_source:=}"
: "${usage_version:=}"
: "${usage_run_mode:=}"
: "${usage_clear_first:=}"

set -e -o pipefail

source tasks/_common.sh

if [[ -z "${usage_instance}" ]]; then
    instance=$STANDARD_INSTANCE
    webapi_port=$STANDARD_WEBAPI_PORT
    webui_port=$STANDARD_WEBUI_PORT
    docs_port=$STANDARD_DOCS_PORT
elif [[ "${usage_instance}" == "+gen" ]]; then
    instance=$(get_instance)
    webapi_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
else
    instance="${usage_instance}"
    webapi_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
fi

run_jupiter_webapp "$usage_universe" "$instance" "$webapi_port" "$webui_port" "$docs_port" no-wait monit dev "$usage_source" "$usage_version" "$usage_run_mode" "$usage_clear_first"
