#!/usr/bin/env bash

#MISE description="Run integration tests across run modes (PM2, Docker, thrive-sh-test) and WebAPI storage engines (sqlite, postgres)"
#USAGE flag "--instance <instance>" help="Base Jupiter instance name; each matrix cell uses <base>-<runner>-<engine> (default: random codename)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--headed" help="Run tests in headed mode"
#USAGE flag "-k --filter <filter>" help="pytest -k expression (only matching tests run)"
#USAGE arg "[pytestArgs]" var=#true help="Additional pytest args (passed through to test:int)"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
#USAGE flag "--skip-thrive-sh-test" help="Skip thrive-sh-test universe cells (GCP VM); PM2 and Docker cells still run"
#USAGE flag "--clear-first" help="Clear instance data before each stack start (same semantics as run:srv)"
#USAGE flag "--source <source>" default="local" help="Jupiter image/source for run:srv (reuse: thrive-sh-test only)" {
#USAGE   choices "local" "registry" "reuse"
#USAGE }
#USAGE flag "--version <version>" default="latest" help="Jupiter version when source is registry"

: "${usage_instance:=}"
: "${usage_headed:=}"
: "${usage_filter:=}"
: "${usage_pytest_args:=}"
: "${usage_skip_thrive_sh_test:=}"
: "${usage_clear_first:=}"
: "${usage_source:=}"
: "${usage_version:=}"
: "${usage_log:=info}"

set -e -o pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

source tasks/_common.sh

mkdir -p .build-cache/itest

if [[ -n "${usage_instance}" ]]; then
    matrix_base="${usage_instance}"
else
    matrix_base="$(uvx codename -s '-')"
fi

log info "Matrix base instance name: $matrix_base"

# mise may leave a single empty string in usage_pytest_args; pytest treats '' as a path → "file or directory not found: ''".
_matrix_pytest_args_filtered=()
if ((${#usage_pytest_args[@]})); then
    for _matrix_pa in "${usage_pytest_args[@]}"; do
        [[ -n "$_matrix_pa" ]] && _matrix_pytest_args_filtered+=("$_matrix_pa")
    done
fi

run_int() {
    local universe=$1
    local environment=$2
    local instance=$3
    if ((${#_matrix_pytest_args_filtered[@]})); then
        mise run test:int \
            --universe "$universe" \
            --environment "$environment" \
            --instance "$instance" \
            ${usage_headed:+--headed} \
            ${usage_filter:+-k "$usage_filter"} \
            --log "$usage_log" \
            -- "${_matrix_pytest_args_filtered[@]}"
    else
        mise run test:int \
            --universe "$universe" \
            --environment "$environment" \
            --instance "$instance" \
            ${usage_headed:+--headed} \
            ${usage_filter:+-k "$usage_filter"} \
            --log "$usage_log"
    fi
}

run_dev_matrix_cell() {
    local run_mode=$1
    local storage_engine=$2
    local instance="${matrix_base}-${run_mode}-${storage_engine}"

    local webapi_port webapi_postgres_port api_port webui_port docs_port mcp_port
    webapi_port=$(get_free_port)
    webapi_postgres_port=$(get_free_port)
    api_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
    mcp_port=$(get_free_port)

    log info "=== Matrix cell: universe=dev run-mode=$run_mode storage=$storage_engine instance=$instance ==="

    (
        set -e -o pipefail
        cd "$REPO_ROOT"
        source tasks/_common.sh
        webapi_telemetry=local
        webapi_search=sql
        webapi_crm=noop
        webapi_auth_provider=local
        run_jupiter_webapp \
            dev \
            "$instance" \
            "$webapi_port" \
            "$webapi_postgres_port" \
            "$api_port" \
            "$webui_port" \
            "$docs_port" \
            "$mcp_port" \
            wait:all \
            no-monit \
            dev \
            "${usage_source:-local}" \
            "${usage_version:-latest}" \
            "$run_mode" \
            "${usage_clear_first:-false}" \
            "$storage_engine" \
            "$webapi_telemetry" \
            "$webapi_search" \
            "$webapi_crm" \
            "$webapi_auth_provider"
        run_int dev local "$instance"
    )
}

run_thrive_sh_test_matrix_cell() {
    local storage_engine=$1
    local instance="${matrix_base}-thsh-${storage_engine}"

    local webapi_port webapi_postgres_port api_port webui_port docs_port mcp_port
    webapi_port=$(get_free_port)
    webapi_postgres_port=$(get_free_port)
    api_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
    mcp_port=$(get_free_port)

    log info "=== Matrix cell: universe=thrive-sh-test storage=$storage_engine instance=$instance ==="

    (
        set -e -o pipefail
        cd "$REPO_ROOT"
        source tasks/_common.sh
        webapi_telemetry=local
        webapi_search=sql
        webapi_crm=noop
        webapi_auth_provider=local
        run_jupiter_webapp \
            thrive-sh-test \
            "$instance" \
            "$webapi_port" \
            "$webapi_postgres_port" \
            "$api_port" \
            "$webui_port" \
            "$docs_port" \
            "$mcp_port" \
            wait:all \
            no-monit \
            dev \
            "${usage_source:-local}" \
            "${usage_version:-latest}" \
            pm2 \
            "${usage_clear_first:-false}" \
            "$storage_engine" \
            "$webapi_telemetry" \
            "$webapi_search" \
            "$webapi_crm" \
            "$webapi_auth_provider"
        run_int thrive-sh-test staging "$instance"
    )
}

for run_mode in pm2 docker; do
    for storage_engine in sqlite postgres; do
        run_dev_matrix_cell "$run_mode" "$storage_engine"
    done
done

if [[ -z "${usage_skip_thrive_sh_test:-}" ]]; then
    for storage_engine in sqlite postgres; do
        run_thrive_sh_test_matrix_cell "$storage_engine"
    done
else
    log info "Skipping thrive-sh-test cells (--skip-thrive-sh-test)"
fi

log info "Matrix integration run finished successfully"
