#!/usr/bin/env bash

#MISE description="Connect to Jupiter database"
#USAGE flag "--environ <environ>" help="Jupiter environ (defaults to standard environ)"
#USAGE flag "--visual" help="Open the database in a visual editor"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"
: "${usage_visual:=false}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

db_path="$RUN_ROOT/$environ/jupiter.sqlite"

if [[ ! -f "$db_path" ]]; then
    log info "Database file not found at: $db_path"
    log info "Make sure Jupiter is running or the database exists."
    exit 1
fi

log info "Connecting to Jupiter SQLite database for environ: $environ at path: $db_path"

if [[ "$usage_visual" == true ]]; then
    log info "Opening database in a visual editor..."
    open -a DBeaver "$db_path"
else
    sqlite3 "$db_path"
fi
