#!/usr/bin/env bash

#MISE description="Regenerate the pictures of the docs and of the README from a fresh demo instance"
#USAGE flag "--instance <instance>" default="docs-screenshots" help="The instance to run the demo workspace on. It is cleared before every run"
#USAGE flag "--only <only>" help="Only take these shots: names or name prefixes, comma separated (see --list)"
#USAGE flag "--list" help="List the shots of the config and exit"
#USAGE flag "--config <config>" default="src/docs/screenshots/screenshots.toml" help="The config with the demo data and the shots"
#USAGE flag "--keep" help="Leave the instance running afterwards, to look at the demo data by hand"
#USAGE flag "--reuse" help="Reuse the running instance and its data from the last run, instead of a fresh one (only for fixing a shot)"
#USAGE flag "--seed-only" help="Create the demo data and stop"
#USAGE flag "--no-install" help="Leave the pictures in .build-cache/docs-screenshots/out instead of copying them into the docs"
#USAGE flag "--headed" help="Show the browser while taking the pictures"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_only:=}"
: "${usage_list:=}"
: "${usage_config:=}"
: "${usage_keep:=}"
: "${usage_reuse:=}"
: "${usage_seed_only:=}"
: "${usage_no_install:=}"
: "${usage_headed:=}"

set -e -o pipefail

source tasks/_common.sh

# Python runs from the itests environment, which has the WebAPI client and Playwright.
run_screenshots() {
    uv run --project itests python src/docs/screenshots/run.py --config "$usage_config" "$@"
}

if [[ -n "${usage_list}" ]]; then
    run_screenshots --list
    exit 0
fi

instance="${usage_instance}"
extra_args=()
if [[ -n "${usage_only}" ]]; then
    extra_args+=(--only "${usage_only}")
fi
if [[ -n "${usage_no_install}" ]]; then
    extra_args+=(--no-install)
fi
if [[ -n "${usage_headed}" ]]; then
    extra_args+=(--headed)
fi

log info "Making sure the browser for the pictures is installed"
uv run --project itests playwright install chromium

if [[ -z "${usage_reuse}" ]]; then
    log info "Starting a fresh instance: ${instance}"
    # A run with --keep leaves it running, and it must be stopped before it can be cleared.
    stop_jupiter_webapp "${instance}" pm2 > /dev/null 2>&1 || true
    # The instance is built to be thrown away, so it is cleared first: no leftovers of an earlier
    # run. This is what `run:srv` does too, without the pm2 dashboard it ends in, which blocks.
    run_jupiter_webapp dev "${instance}" \
        "$(get_free_port)" "$(get_free_port)" "$(get_free_port)" "$(get_free_port)" \
        "$(get_free_port)" "$(get_free_port)" "$(get_free_port)" \
        no-wait no-monit dev local latest pm2 true sqlite local sql noop local noop none false "" noop
else
    extra_args+=(--skip-seed)
fi

stop_instance() {
    if [[ -z "${usage_keep}" ]]; then
        stop_jupiter_webapp "${instance}" pm2 || true
    else
        log info "Leaving the instance ${instance} running"
    fi
}
trap stop_instance EXIT

webui_url=$(get_dev_service_url "${instance}" "webui")
wait_for_service_to_start "webui" "${webui_url}"
test_manifest=$(http --ignore-stdin --verify=no get "${webui_url}/test-manifest")
webapi_url=$(echo "${test_manifest}" | jq -r '.webApiUrl')
wait_for_service_to_start "webapi:srv" "${webapi_url}"

if [[ -n "${usage_seed_only}" ]]; then
    extra_args+=(--seed-only)
fi

log info "Taking the pictures from ${webui_url} (WebAPI ${webapi_url})"
run_screenshots --webui-url "${webui_url}" --webapi-url "${webapi_url}" "${extra_args[@]}"
log info "Done. Review the changes with: git status src/docs assets"
