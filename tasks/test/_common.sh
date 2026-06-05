#!/usr/bin/env bash

set -e -o pipefail

source tasks/_common.sh

run_tests() {
    local webapi_url=$1
    local api_url=$2
    local mcp_url=$3
    local webui_url=$4
    local docs_url=$5
    local email_verification_strategy=$6
    local auth_strategy=$7
    local headed=$8
    local filter_expr=$9
    shift 9

    log info "Running tests with Web API $webapi_url and API $api_url and MCP $mcp_url and Web UI $webui_url and Docs $docs_url and email verification strategy $email_verification_strategy and auth strategy $auth_strategy and pytest args ${*} and headed=${headed} filter=${filter_expr:-<none>}"

    if [[ -n "$RETRIES" ]]; then
        retries="$RETRIES"
    else
        retries=3
    fi

    export WEBAPI_URL=$webapi_url
    export API_URL=$api_url
    export MCP_URL=$mcp_url
    export WEBUI_URL=$webui_url
    export DOCS_URL=$docs_url
    export ITEST_EMAIL_VERIFICATION_STRATEGY=$email_verification_strategy
    export ITEST_AUTH_STRATEGY=$auth_strategy
    export ITEST_GOOGLE_USER=$ITEST_GOOGLE_USER
    export ITEST_GOOGLE_PASS=$ITEST_GOOGLE_PASS
    if [[ -n "$headed" ]]; then
        export ITEST_PLAYWRIGHT_HEADED=1
    else
        unset ITEST_PLAYWRIGHT_HEADED
    fi

    local -a _pytest_extra=()
    local _pa
    for _pa in "$@"; do
        [[ -n "$_pa" ]] && _pytest_extra+=("$_pa")
    done

    pytest itests \
        -o log_cli=true \
        --retries="${retries}" \
        ${headed:+--headed} \
        ${filter_expr:+-k "$filter_expr"} \
        --html-report=.build-cache/itest/test-report.html \
        --title="Jupiter Integration Tests" \
        "${_pytest_extra[@]}"
}

check_is_testable_universe() {
    local universe_url=$1

    log info "Checking if universe at $universe_url is testable"

    set +e
    http --check-status --ignore-stdin --follow --timeout 10 --verify=no get "${universe_url}/test-manifest" > /dev/null 2>&1
    local status=$?
    set -e

    if [[ "$status" -ne 0 ]]; then
        log error "Universe at $universe_url is not testable: /test-manifest did not return a successful status code"
        exit 1
    fi
}