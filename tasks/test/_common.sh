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

    log info "Running tests with pytest args ${*}"

    export WEBAPI_URL=$webapi_url 
    export WEBUI_URL=$webui_url
    export DOCS_URL=$docs_url
    pytest itests \
        --last-failed \
        -o log_cli=true \
        --html-report=.build-cache/itest/test-report.html \
        --title="Jupiter Integration Tests" \
        --base-url="$webui_url" \
        $@ # shellcheck disable=SC2068
}
