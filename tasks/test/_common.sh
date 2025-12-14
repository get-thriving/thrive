#!/usr/bin/env bash

set -e -o pipefail

source tasks/_common.sh

run_tests() {
    local webapi_url=$1
    local webui_url=$2
    local docs_url=$3
    local headed=$4
    shift 4
    
    log info "Running tests with Web API $webapi_url and Web UI $webui_url and Docs $docs_url and pytest args ${*} and headed=${headed}"

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

format_universe_url() {
    local universe_url=$1
    # If the URL starts with http or https return it as is
    # Otherwise add http as a prefix
    if [[ "$universe_url" =~ ^https?:// ]]; then
        echo "$universe_url"
    else
        echo "http://$universe_url"
    fi
}