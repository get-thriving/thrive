#!/usr/bin/env bash

#MISE description="Run integration tests for CI"
#USAGE flag "--universe <universe>" default="dev" help="The universe"
#USAGE flag "--instance <instance>" help="The instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--headed" help="Run tests in headed mode"
#USAGE arg "[pytestArgs]" var=#true help="The pytest args"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_instance:=}"
: "${usage_headed:=}"
: "${usage_pytest_args:=}"

set -e -o pipefail

source tasks/_common.sh
source tasks/test/_common.sh

mkdir -p .build-cache/itest

if [[ "$usage_universe" == "dev" ]]; then
    if [[ -z "$usage_instance" ]]; then
        usage_instance=dev
    fi
    universe_url=$(get_webui_url_for_universe "dev" "local" "$usage_instance")
    wait_for_service_to_start "universe" "$universe_url"
    webui_url=$universe_url # A small hack
    webapi_url=$(http --verify=no get "$universe_url/test-manifest" | jq -r '.webApiUrl')
    docs_url=$(http --verify=no get "$universe_url/test-manifest" | jq -r '.docsUrl')
elif [[ "$usage_universe" == "thrive" ]]; then
    if [[ -z "$usage_instance" ]]; then
        echo "instance is required for thrive universe"
        exit 1
    fi
    universe_url=$(get_thrive_staging_webui_url "$usage_instance")
    wait_for_service_to_start "universe" "$universe_url"
    webui_url=$universe_url # A small hack
    webapi_url=$(http --verify=no get "$universe_url/test-manifest" | jq -r '.webApiUrl')
    docs_url=$(http --verify=no get "$universe_url/test-manifest" | jq -r '.docsUrl')
else 
    universe_url=$(get_webui_url_for_universe "$usage_universe" "$usage_environment" "$usage_instance")
    wait_for_service_to_start "universe" "$universe_url"
    # webui_url=$(http --verify=no get $universe_url/test-manifest | jq -r '.webUiUrl')
    webui_url=$universe_url # A small hack
    webapi_url=$(http --verify=no get "$universe_url/test-manifest" | jq -r '.webApiUrl')
    docs_url=$(http --verify=no get "$universe_url/test-manifest" | jq -r '.docsUrl')
fi

log info "Testing Jupiter with Web API $webapi_url and Web UI $webui_url and Docs $docs_url and pytest args ${usage_pytest_args[*]}"

wait_for_service_to_start "webapi" "$webapi_url"
wait_for_service_to_start "webui" "$webui_url"
wait_for_service_to_start "docs" "$docs_url"

log info "Running tests with pytest args ${usage_pytest_args[*]}"

run_tests "$webapi_url" "$webui_url" "$docs_url" "$usage_headed" "${usage_pytest_args[@]}" 
