#!/usr/bin/env bash

#MISE description="Connect to Jupiter database"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE flag "--visual" help="Open the database in a visual editor"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_visual:=false}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

db_path="$RUN_ROOT/$instance/jupiter.sqlite"

if [[ ! -f "$db_path" ]]; then
    log info "Database file not found at: $db_path"
    log info "Make sure Jupiter is running or the database exists."
    exit 1
fi

log info "Connecting to Jupiter SQLite database for instance: $instance at path: $db_path"

if [[ "$usage_visual" == true ]]; then
    log info "Opening database in a visual editor..."
    open -a DBeaver "$db_path"
else
    sqlite3 "$db_path"
fi
