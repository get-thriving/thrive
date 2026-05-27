#!/usr/bin/env bash

#MISE description="Run database migrations on Jupiter database"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

log info "Running database migrations for instance: $instance"

# Get free ports for the migration run
webapi_port=$(get_free_port)
webapi_postgres_port=$(get_free_port)
api_port=$(get_free_port)
webui_port=$(get_free_port)
docs_port=$(get_free_port)
mcp_port=$(get_free_port)

log info "Starting Jupiter for migrations with webapi port: $webapi_port and webui port: $webui_port"

# Check if webapi service is already running for this instance
if check_service_is_running pm2 "$instance" webapi:srv; then
    log info "WebAPI service is already running for instance: $instance"
    log info "Please stop the service first before running migrations"
    exit 1
fi


# Run Jupiter with migrations - it will automatically run migrations on startup
run_jupiter_webapp dev "$instance" "$webapi_port" "$webapi_postgres_port" "$api_port" "$webui_port" "$docs_port" "$mcp_port" wait:webapi:srv no-monit ci local latest pm2 "" sqlite local sql noop

get_logs pm2 "$instance" webapi:srv

log info "Migrations completed successfully!"
log info "Stopping Jupiter..."

stop_jupiter_webapp "$instance"

log info "Database migrations finished for instance: $instance"
