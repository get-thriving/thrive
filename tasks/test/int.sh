#!/usr/bin/env bash

#MISE description="Run integration tests for CI"
#USAGE flag "--universe <universe>" default="dev" help="The universe"
#USAGE flag "--environment <environment>" default="local" help="The environment" {
#USAGE   choices "production" "staging" "local"
#USAGE }
#USAGE flag "--instance <instance>" help="The instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--headed" help="Run tests in headed mode"
#USAGE arg "[pytestArgs]" var=#true help="The pytest args"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_environment:=}"
: "${usage_instance:=}"
: "${usage_headed:=}"
: "${usage_pytest_args:=}"

set -e -o pipefail

source tasks/_common.sh
source tasks/test/_common.sh

mkdir -p .build-cache/itest

webui_url=$(get_webui_url_for_universe "$usage_universe" "$usage_environment" "$usage_instance")
wait_for_service_to_start "universe" "$webui_url"
check_is_testable_universe "$webui_url"
webapi_url=$(http --verify=no get "$webui_url/test-manifest" | jq -r '.webApiUrl')
docs_url=$(http --verify=no get "$webui_url/test-manifest" | jq -r '.docsUrl')

log info "Testing Jupiter with Web API $webapi_url and Web UI $webui_url and Docs $docs_url and pytest args ${usage_pytest_args[*]}"

wait_for_service_to_start "webapi" "$webapi_url"
wait_for_service_to_start "docs" "$docs_url"

log info "Running tests with pytest args ${usage_pytest_args[*]}"

run_tests "$webapi_url" "$webui_url" "$docs_url" "$usage_headed" "${usage_pytest_args[@]}" 
