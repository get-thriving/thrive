#!/usr/bin/env bash

#MISE description="Connect to Jupiter database"
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

db_path="$RUN_ROOT/$namespace/jupiter.sqlite"

if [[ ! -f "$db_path" ]]; then
    log info "Database file not found at: $db_path"
    log info "Make sure Jupiter is running or the database exists."
    exit 1
fi

log info "Connecting to Jupiter SQLite database for namespace: $namespace at path: $db_path"

sqlite3 "$db_path"
