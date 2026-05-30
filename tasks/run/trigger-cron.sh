#!/usr/bin/env bash

#MISE description="Trigger a WebAPI cron job immediately (SIGUSR1)"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--run-mode <runMode>" required help="Run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE arg "<service>" required help="Cron service (e.g. webapi:stats-do-all, webapi:gc-do-all)"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_run_mode:=}"
: "${usage_service:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"
if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

log info "Triggering cron ${usage_service} for instance ${instance} (run-mode=${usage_run_mode})"
jupiter_trigger_webapi_cron "$instance" "$usage_service" "$usage_run_mode"
