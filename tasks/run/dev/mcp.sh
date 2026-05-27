#!/usr/bin/env bash

#MISE description="Open the MCP Inspector connected to the Jupiter MCP server"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe"
#USAGE flag "--environment <environment>" default="local" help="Jupiter environment" {
#USAGE   choices "production" "staging" "local"
#USAGE }
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--mcp-key <mcp_key>" help="MCP key for authentication"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }


: "${usage_instance:=}"
: "${usage_environment:=}"
: "${usage_universe:=}"
: "${usage_mcp_key:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"
universe="${usage_universe}"
environment="${usage_environment}"
mcp_key="${usage_mcp_key}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

log info "Opening MCP Inspector (universe: $universe, environment: $environment, instance: $instance)"

if [[ "$universe" == "dev" ]]; then
    if ! check_service_is_running pm2 "$instance" mcp; then
        log info "MCP service is not running for instance: $instance"
        log info "Please start the service first"
        exit 1
    fi
fi

mcp_url=$(get_mcp_url_for_universe "$universe" "$environment" "$instance")
server_url="${mcp_url}/v1/${mcp_key}/mcp"

log info "Connecting MCP Inspector to $server_url"

npx @modelcontextprotocol/inspector --server-url "$server_url"
