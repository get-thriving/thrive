#!/usr/bin/env bash

#MISE description="Run Jupiter server with optional instance and mode (writes WEBAPI_* keys to .build-cache/run/<instance>/webapi.env)"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe" {
#USAGE   choices "dev" "thrive-sh-test"
#USAGE }
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--source <source>" default="local" help="Jupiter source (reuse: thrive-sh-test only, keeps images on the VM)" {
#USAGE   choices "local" "registry" "reuse"
#USAGE }
#USAGE flag "--version <version>" default="latest" help="Jupiter version"
#USAGE flag "--run-mode <runMode>" default="pm2" help="Run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE flag "--clear-first" help="Clear the instance first"
#USAGE flag "--webapi-storage-engine <engine>" default="sqlite" help="WebAPI primary storage (sqlite uses local Jupiter SQLite; postgres starts the sidecar and wires Postgres + Alembic)" {
#USAGE   choices "sqlite" "postgres"
#USAGE }
#USAGE flag "--telemetry <telemetry>" default="local" help="Telemetry sink (ADR 0008)" {
#USAGE   choices "local" "sentry"
#USAGE }
#USAGE flag "--webapi-search <search>" default="sql" help="WebAPI search backend (ADR 0008)" {
#USAGE   choices "sql" "algolia"
#USAGE }
#USAGE flag "--crm <crm>" default="noop" help="CRM integration (ADR 0008)" {
#USAGE   choices "noop" "wix"
#USAGE }
#USAGE flag "--auth-provider <authProvider>" default="local" help="Auth provider (ADR 0008)" {
#USAGE   choices "local" "local-google-apple"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_instance:=}"
: "${usage_source:=}"
: "${usage_version:=}"
: "${usage_run_mode:=}"
: "${usage_clear_first:=}"
: "${usage_webapi_storage_engine:=}"
: "${usage_telemetry:=}"
: "${usage_webapi_search:=}"
: "${usage_crm:=}"
: "${usage_auth_provider:=}"

set -e -o pipefail

source tasks/_common.sh

if [[ -z "${usage_instance}" ]]; then
    instance=$STANDARD_INSTANCE
    webapi_port=$STANDARD_WEBAPI_PORT
    webapi_postgres_port=$STANDARD_WEBAPI_POSTGRES_PORT
    api_port=$STANDARD_API_PORT
    mcp_port=$STANDARD_MCP_PORT
    webui_port=$STANDARD_WEBUI_PORT
    docs_port=$STANDARD_DOCS_PORT
elif [[ "${usage_instance}" == "+gen" ]]; then
    instance=$(get_instance)
    webapi_port=$(get_free_port)
    webapi_postgres_port=$(get_free_port)
    api_port=$(get_free_port)
    mcp_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
else
    instance="${usage_instance}"
    webapi_port=$(get_free_port)
    webapi_postgres_port=$(get_free_port)
    api_port=$(get_free_port)
    mcp_port=$(get_free_port)
    webui_port=$(get_free_port)
    docs_port=$(get_free_port)
fi

run_jupiter_webapp "$usage_universe" "$instance" "$webapi_port" "$webapi_postgres_port" "$api_port" "$webui_port" "$docs_port" "$mcp_port" no-wait monit dev "$usage_source" "$usage_version" "$usage_run_mode" "$usage_clear_first" "${usage_webapi_storage_engine:-sqlite}" "${usage_telemetry:-local}" "${usage_webapi_search:-sql}" "${usage_crm:-noop}" "${usage_auth_provider:-local}"
