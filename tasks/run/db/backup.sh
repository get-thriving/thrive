#!/usr/bin/env bash

set -ex

#MISE description="Backup Jupiter database"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace (defaults to standard namespace)"

: "${usage_namespace:=}"

source scripts/common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

db_path="$RUN_ROOT/$namespace/jupiter.sqlite"
backup_path="$RUN_ROOT/$namespace/jupiter.sqlite.bak"

if [[ ! -f "$db_path" ]]; then
    echo "Database file not found at: $db_path"
    echo "Make sure Jupiter is running or the database exists."
    exit 1
fi

echo "Backing up Jupiter database..."
echo "Source: $db_path"
echo "Destination: $backup_path"
echo "Namespace: $namespace"

if cp "$db_path" "$backup_path"; then
    echo "Backup completed successfully!"
    echo "Backup file: $backup_path"
    
    # Show file sizes
    original_size=$(find "$db_path" -prune -exec ls -lh {} \; | awk '{print $5}')
    backup_size=$(find "$backup_path" -prune -exec ls -lh {} \; | awk '{print $5}')
    echo "Original size: $original_size"
    echo "Backup size: $backup_size"
else
    echo "Backup failed!"
    exit 1
fi
