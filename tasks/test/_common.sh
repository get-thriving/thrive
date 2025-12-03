#!/usr/bin/env bash

set -e -o pipefail

source tasks/_common.sh

run_tests() {
    local webapi_url=$1
    shift
    local webui_url=$1
    shift

    log info "Running tests with pytest args ${*}"

    LOCAL_OR_SELF_HOSTED_WEBAPI_SERVER_URL=$webapi_url pytest itests \
        --last-failed \
        -o log_cli=true \
        --html-report=.build-cache/itest/test-report.html \
        --title="Jupiter Integration Tests" \
        --base-url="$webui_url" \
        "$@"
}
