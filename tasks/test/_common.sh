#!/usr/bin/env bash

set -e -o pipefail

source tasks/_common.sh

run_tests() {
    local webapi_url=$1
    shift
    local webui_url=$1
    shift
    local docs_url=$1
    shift
    local headed=$1
    shift
    
    log info "Running tests with pytest args ${*} and headed=${headed}"

    export WEBAPI_URL=$webapi_url 
    export WEBUI_URL=$webui_url
    export DOCS_URL=$docs_url
    # shellcheck disable=SC2068
    pytest itests \
        --last-failed \
        -o log_cli=true \
        ${headed:+--headed} \
        --html-report=.build-cache/itest/test-report.html \
        --title="Jupiter Integration Tests" \
        $@
}