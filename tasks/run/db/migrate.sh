#!/usr/bin/env bash

#MISE description="Run database migrations on Jupiter database"
#USAGE flag "--environ <environ>" help="Jupiter environ (defaults to standard environ)"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

log info "Running database migrations for environ: $environ"

# Get free ports for the migration run
webapi_port=$(get_free_port)
webui_port=$(get_free_port)
docs_port=$(get_free_port)

log info "Starting Jupiter for migrations with webapi port: $webapi_port and webui port: $webui_port"

# Check if webapi service is already running for this environ
if check_service_is_running pm2 "$environ" webapi; then
    log info "WebAPI service is already running for environ: $environ"
    log info "Please stop the service first before running migrations"
    exit 1
fi


# Run Jupiter with migrations - it will automatically run migrations on startup
run_jupiter_webapp "$environ" "$webapi_port" "$webui_port" "$docs_port" wait:webapi no-monit ci local latest pm2

get_logs pm2 "$environ" webapi

log info "Migrations completed successfully!"
log info "Stopping Jupiter..."

stop_jupiter_webapp "$environ"

log info "Database migrations finished for environ: $environ"
