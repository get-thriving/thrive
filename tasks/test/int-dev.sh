#!/usr/bin/env bash

#MISE description="Run integration tests on a dev machine"
#USAGE flag "--webapi-url <webapiUrl>" help="The webapi url"
#USAGE flag "--webui-url <webuiUrl>" help="The webui url"
#USAGE flag "--docs-url <docsUrl>" help="The docs url"
#USAGE flag "--environ <environ>" help="The environ"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
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
: "${usage_docs_url:=}"
: "${usage_environ:=}"

set -e -o pipefail

source tasks/_common.sh
source tasks/test/_common.sh

mkdir -p .build-cache/itest

webapi_url="${usage_webapi_url}"
webui_url="${usage_webui_url}"
docs_url="${usage_docs_url}"
if [[ -n "$usage_environ" ]]; then
    webapi_port=$(get_jupiter_port "$usage_environ" webapi)
    webui_port=$(get_jupiter_port "$usage_environ" webui)
    docs_port=$(get_jupiter_port "$usage_environ" docs)
    webapi_url="http://0.0.0.0:$webapi_port"
    webui_url="http://0.0.0.0:$webui_port"
    docs_url="http://0.0.0.0:$docs_port"
fi

if [[ -z "$webapi_url" ]]; then
    webapi_url="http://0.0.0.0:${STANDARD_WEBAPI_PORT}"
fi

if [[ -z $webui_url ]]; then
    webui_url="http://0.0.0.0:${STANDARD_WEBUI_PORT}"
fi

if [[ -z "$docs_url" ]]; then
    docs_url="http://0.0.0.0:${STANDARD_DOCS_PORT}"
fi

log info "Testing Jupiter with Web API $webapi_url and Web UI $webui_url and Docs $docs_url and pytest args ${usage_pytest_args[*]}"

wait_for_service_to_start "webapi" "$webapi_url"
wait_for_service_to_start "webui" "$webui_url"
wait_for_service_to_start "docs" "$docs_url"

log info "Running tests with pytest args ${usage_pytest_args[*]}"

run_tests "$webapi_url" "$webui_url" "$docs_url" --headed "${usage_pytest_args[@]}"

