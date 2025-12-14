#!/usr/bin/env bash

#MISE description="Run integration tests for CI"
#USAGE flag "--run-mode <runMode>" default="pm2" help="The run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE flag "--universe <universe>" default="local-dev" help="The universe"
#USAGE flag "--headed" help="Run tests in headed mode"
#USAGE arg "[pytestArgs]" var=#true help="The pytest args"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_run_mode:=}"
: "${usage_universe:=}"
: "${usage_headed:=}"
: "${usage_pytest_args:=}"

set -e -o pipefail

source tasks/_common.sh
source tasks/test/_common.sh

mkdir -p .build-cache/itest

if [[ "$usage_universe" == "local-dev" ]]; then
    echo "Not implemented"
    exit 1
elif [[ "$usage_universe" == "thrive" ]]; then
    echo "Not implemented"
    exit 1
else 
    universe_url=$(format_universe_url "$usage_universe")
    wait_for_service_to_start "universe" "$universe_url"
    # webui_url=$(http get $universe_url/test-manifest | jq -r '.webUiUrl')
    webui_url=$universe_url # A small hack
    webapi_url=$(http get $universe_url/test-manifest | jq -r '.webApiUrl')
    docs_url=$(http get $universe_url/test-manifest | jq -r '.docsUrl')
fi

# environ=$(get_environ)
# webapi_port=$(get_free_port)
# webapi_url=http://0.0.0.0:${webapi_port}
# webui_port=$(get_free_port)
# if [[ "$usage_run_mode" == "docker" ]]; then
#     webui_url=https://0.0.0.0:${webui_port}
# else
#     webui_url=http://0.0.0.0:${webui_port}
# fi
# docs_port=$(get_free_port)
# docs_url=http://0.0.0.0:${docs_port}

# # Are we truly in a CI environment, or on a local machine but running the CI script?
# # If we are, GitHub (and other CI providers) will set the CI environment variable.
# in_ci=
# if [[ -z "$CI" ]]; then
#     in_ci="dev"
# else
#     in_ci="ci"
# fi

log info "Testing Jupiter with Web API $webapi_url and Web UI $webui_url and Docs $docs_url and pytest args ${usage_pytest_args[*]}"

wait_for_service_to_start "webapi" "$webapi_url"
wait_for_service_to_start "webui" "$webui_url"
wait_for_service_to_start "docs" "$docs_url"

exit 1

# run_jupiter_webapp "$environ" "$webapi_port" "$webui_port" "$docs_port" wait:all no-monit $in_ci "$usage_run_mode"

log info "Running tests with pytest args ${usage_pytest_args[*]}"

run_tests "$webapi_url" "$webui_url" "$docs_url" "$usage_headed" "${usage_pytest_args[@]}" 
