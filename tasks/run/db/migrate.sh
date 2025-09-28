#!/usr/bin/env bash

#MISE description="Run database migrations on Jupiter database"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace (defaults to standard namespace)"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_namespace:=}"

set -e -o pipefail

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

echo "Running database migrations for namespace: $namespace"

# Get free ports for the migration run
webapi_port=$(get_free_port)
webui_port=$(get_free_port)

echo "Starting Jupiter for migrations..."
echo "WebAPI port: $webapi_port"
echo "WebUI port: $webui_port"

# Check if webapi service is already running for this namespace
if check_service_is_running pm2 "$namespace" webapi; then
    echo "WebAPI service is already running for namespace: $namespace"
    echo "Please stop the service first before running migrations"
    exit 1
fi


# Run Jupiter with migrations - it will automatically run migrations on startup
run_jupiter "$namespace" "$webapi_port" "$webui_port" wait:webapi no-monit ci pm2

get_logs pm2 "$namespace" webapi

echo "Migrations completed successfully!"
echo "Stopping Jupiter..."

stop_jupiter "$namespace"

echo "Database migrations finished for namespace: $namespace"
