#!/usr/bin/env bash

set -e -o pipefail

source tasks/_common.sh

run_tests() {
    local webapi_url=$1
    local api_url=$2
    local webui_url=$3
    local docs_url=$4
    local headed=$4
    shift 4
    
    log info "Running tests with Web API $webapi_url and API $api_url and Web UI $webui_url and Docs $docs_url and pytest args ${*} and headed=${headed}"

    export WEBAPI_URL=$webapi_url 
    export API_URL=$api_url
    export WEBUI_URL=$webui_url
    export DOCS_URL=$docs_url
    # shellcheck disable=SC2068
    pytest itests \
        --retries=3 \
        -o log_cli=true \
        ${headed:+--headed} \
        --html-report=.build-cache/itest/test-report.html \
        --title="Jupiter Integration Tests" \
        $@
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