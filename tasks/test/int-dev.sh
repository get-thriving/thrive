#!/usr/bin/env bash

#MISE description="Run integration tests on a dev machine"
#USAGE flag "--webapi-url <webapiUrl>" help="The webapi url"
#USAGE flag "--webui-url <webuiUrl>" help="The webui url"
#USAGE flag "--namespace <namespace>" help="The namespace"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--run-mode <runMode>" default="pm2" help="The run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE arg "[pytestArgs]" double_dash="required" var=#true help="The pytest args"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_run_mode:=}"
: "${usage_pytest_args:=}"
: "${usage_webapi_url:=}"
: "${usage_webui_url:=}"
: "${usage_namespace:=}"

set -e -o pipefail

source tasks/_common.sh
source tasks/test/_common.sh

mkdir -p .build-cache/itest

webapi_url=$usage_webapi_url
webui_url=$usage_webui_url

if [[ -n "$usage_namespace" ]]; then
    webapi_port=$(get_jupiter_port "$usage_namespace" webapi)
    webui_port=$(get_jupiter_port "$usage_namespace" webui)
    webapi_url="http://0.0.0.0:$webapi_port"
    webui_url="http://0.0.0.0:$webui_port"
fi

if [[ -z "$webapi_url" ]]; then
    webapi_url="http://0.0.0.0:${STANDARD_WEBAPI_PORT}"
fi

if [[ -z $webui_url ]]; then
    webui_url="http://0.0.0.0:${STANDARD_WEBUI_PORT}"
fi

echo "Using Web API $webapi_url and Web UI $webui_url and pytest args ${usage_pytest_args[*]}"

wait_for_service_to_start "webapi" "$webapi_url"
wait_for_service_to_start "webui" "$webui_url"

run_tests "$webapi_url" "$webui_url" --headed "${usage_pytest_args[*]}"

