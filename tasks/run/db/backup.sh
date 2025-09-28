#!/usr/bin/env bash

#MISE description="Backup Jupiter database"
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
backup_path="$RUN_ROOT/$namespace/jupiter.sqlite.bak"

if [[ ! -f "$db_path" ]]; then
    log info "Database file not found at: $db_path"
    log info "Make sure Jupiter is running or the database exists."
    exit 1
fi

log info "Backing up Jupiter database for namespace: $namespace at path: $db_path to path: $backup_path"

if cp "$db_path" "$backup_path"; then
    log info "Backup completed successfully!"
    log info "Backup file: $backup_path"
    
    # Show file sizes
    original_size=$(find "$db_path" -prune -exec ls -lh {} \; | awk '{print $5}')
    backup_size=$(find "$backup_path" -prune -exec ls -lh {} \; | awk '{print $5}')
    log info "Original size: $original_size"
    log info "Backup size: $backup_size"
else
    log info "Backup failed!"
    exit 1
fi
