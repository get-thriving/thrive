#!/usr/bin/env bash

#MISE description="Restore Jupiter database from backup"
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

if [[ ! -f "$backup_path" ]]; then
    log info "Backup file not found at: $backup_path"
    log info "Make sure you have created a backup first using backup.sh"
    exit 1
fi

log info "Restoring Jupiter database from backup..."
log info "Source (backup): $backup_path"
log info "Destination: $db_path"
log info "Environ: $environ"

# Create backup directory if it doesn't exist
mkdir -p "$(dirname "$db_path")"

if cp "$backup_path" "$db_path"; then
    log info "Restore completed successfully!"
    log info "Database file: $db_path"
    
    # Show file sizes
    backup_size=$(find "$backup_path" -prune -exec ls -lh {} \; | awk '{print $5}')
    restored_size=$(find "$db_path" -prune -exec ls -lh {} \; | awk '{print $5}')
    log info "Backup size: $backup_size"
    log info "Restored size: $restored_size"
else
    log info "Restore failed!"
    exit 1
fi
