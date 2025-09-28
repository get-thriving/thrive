#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Run Jupiter server with optional namespace and mode"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace (defaults to standard namespace)"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--run-mode <runMode>" default="pm2" help="Run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_namespace:=}"
: "${usage_run_mode:=pm2}"

source tasks/_common.sh

namespace="${usage_namespace}"

# Set ports based on namespace
if [[ -z "${namespace}" ]]; then
    namespace=$STANDARD_NAMESPACE
    webapi_port=$STANDARD_WEBAPI_PORT
    webui_port=$STANDARD_WEBUI_PORT
elif [[ "${namespace}" == "+gen" ]]; then
    namespace=$(get_namespace)
    webapi_port=$(get_free_port)
    webui_port=$(get_free_port)
else
    webapi_port=$(get_free_port)
    webui_port=$(get_free_port)
fi

echo "Running Jupiter with namespace: $namespace, webapi port: $webapi_port, webui port: $webui_port, mode: $usage_run_mode"

run_jupiter "$namespace" "$webapi_port" "$webui_port" no-wait monit dev "$usage_run_mode"
