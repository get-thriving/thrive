#!/usr/bin/env bash

#MISE description="Run desktop app with optional instance"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe"
#USAGE flag "--environment <environment>" default="local" help="Jupiter environment" {
#USAGE   choices "production" "staging" "local"
#USAGE }
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--distribution <distribution>" default="mac-web" help="Distribution value"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_environment:=}"
: "${usage_instance:=}"
: "${usage_distribution:=}"

set -e -o pipefail

source tasks/_common.sh

webui_url=$(get_webui_url_for_universe "$usage_universe" "$usage_environment" "$usage_instance")

echo "webui_url: $webui_url"

export HOSTED_GLOBAL_WEBUI_URL="$webui_url"
export DISTRIBUTION="${usage_distribution}"

log info "Running desktop app with universe $usage_universe, environment $usage_environment, instance $usage_instance"

cd src/desktop
npx vite build
npx electron-forge start
