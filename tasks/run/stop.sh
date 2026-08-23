#!/usr/bin/env bash

#MISE description="Stop a locally running Jupiter instance"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--run-mode <runMode>" default="pm2" help="Run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_run_mode:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"
if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

run_mode="${usage_run_mode:-pm2}"

log info "Stopping Jupiter instance: $instance (run-mode: $run_mode)"

stop_jupiter_webapp "$instance" "$run_mode"

log info "Stopped Jupiter instance: $instance"
