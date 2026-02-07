#!/usr/bin/env bash

#MISE description="Run web app with optional instance"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe"
#USAGE flag "--environment <environment>" default="local" help="Jupiter environment" {
#USAGE   choices "production" "staging" "local"
#USAGE }
#USAGE flag "--instance <instance>" default="dev" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_environment:=}"
: "${usage_universe:=}"

set -e -o pipefail

source tasks/_common.sh

webui_url=$(get_webui_url_for_universe "$usage_universe" "$usage_environment" "$usage_instance")

log info "Running web in the browser app (universe: $usage_universe, environment: $usage_environment, instance: $usage_instance)"

open "$webui_url"
