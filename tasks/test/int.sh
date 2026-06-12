#!/usr/bin/env bash

#MISE description="Run integration tests for CI"
#USAGE flag "--webui-url <webui_url>" help="Web UI base URL (skips universe resolution)"
#USAGE flag "--universe <universe>" default="dev" help="The universe"
#USAGE flag "--environment <environment>" default="local" help="The environment" {
#USAGE   choices "production" "staging" "local"
#USAGE }
#USAGE flag "--instance <instance>" help="The instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--headed" help="Run tests in headed mode"
#USAGE flag "-k --filter <filter>" help="pytest -k expression (only matching tests run)"
#USAGE arg "[pytestArgs]" var=#true help="The pytest args"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_webui_url:=}"
: "${usage_universe:=}"
: "${usage_environment:=}"
: "${usage_instance:=}"
: "${usage_headed:=}"
: "${usage_filter:=}"
: "${usage_pytest_args:=}"

set -e -o pipefail

source tasks/_common.sh
source tasks/test/_common.sh

mkdir -p .build-cache/itest

if [[ -n "${usage_webui_url}" ]]; then
    webui_url="$usage_webui_url"
elif [[ -n "${usage_instance}" ]] || [[ "${usage_universe}" != "dev" || "${usage_environment}" != "local" ]]; then
    webui_url=$(get_webui_url_for_universe "$usage_universe" "$usage_environment" "$usage_instance")
else
    log error "Either --webui-url or --universe/--environment/--instance must be provided"
    exit 1
fi
wait_for_service_to_start "universe" "$webui_url"
check_is_testable_universe "$webui_url"
test_manifest=$(http --verify=no get "$webui_url/test-manifest")
webapi_url=$(echo "$test_manifest" | jq -r '.webApiUrl')
api_url=$(echo "$test_manifest" | jq -r '.apiUrl')
mcp_url=$(echo "$test_manifest" | jq -r '.mcpUrl')
docs_url=$(echo "$test_manifest" | jq -r '.docsUrl')
published_url=$(echo "$test_manifest" | jq -r '.publishedUrl')
email_verification_strategy=$(echo "$test_manifest" | jq -r '.emailVerificationStrategy // "none"')
auth_strategy=$(echo "$test_manifest" | jq -r '.authStrategy // "local"')

log info "Testing Jupiter with Web API $webapi_url and Web UI $webui_url and MCP $mcp_url and Docs $docs_url and email verification strategy $email_verification_strategy and auth strategy $auth_strategy and filter=${usage_filter:-<none>} and pytest args ${usage_pytest_args[*]}"

wait_for_service_to_start webapi:srv "$webapi_url"
wait_for_service_to_start "api" "$api_url"
# wait_for_service_to_start "mcp" "$mcp_url"
# Docs (MkDocs) can be slow to boot; itests do not require it before pytest.

log info "Running tests with pytest args ${usage_pytest_args[*]}"

run_tests "$webapi_url" "$api_url" "$mcp_url" "$webui_url" "$published_url" "$docs_url" "$email_verification_strategy" "$auth_strategy" "$usage_headed" "$usage_filter" "${usage_pytest_args[@]}"
