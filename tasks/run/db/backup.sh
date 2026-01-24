#!/usr/bin/env bash

#MISE description="Backup Jupiter database"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

db_path="$RUN_ROOT/$instance/jupiter.sqlite"
backup_path="$RUN_ROOT/$instance/jupiter.sqlite.bak"

if [[ ! -f "$db_path" ]]; then
    log info "Database file not found at: $db_path"
    log info "Make sure Jupiter is running or the database exists."
    exit 1
fi

log info "Backing up Jupiter database for instance: $instance at path: $db_path to path: $backup_path"

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
