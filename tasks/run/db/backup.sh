#!/usr/bin/env bash

#MISE description="Backup Jupiter database"
#USAGE flag "--environ <environ>" help="Jupiter environ (defaults to standard environ)"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

db_path="$RUN_ROOT/$environ/jupiter.sqlite"
backup_path="$RUN_ROOT/$environ/jupiter.sqlite.bak"

if [[ ! -f "$db_path" ]]; then
    log info "Database file not found at: $db_path"
    log info "Make sure Jupiter is running or the database exists."
    exit 1
fi

log info "Backing up Jupiter database for environ: $environ at path: $db_path to path: $backup_path"

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
