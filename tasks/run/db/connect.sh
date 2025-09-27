#!/usr/bin/env bash

set -ex

#MISE description="Connect to Jupiter database"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace (defaults to standard namespace)"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"

: "${usage_namespace:=}"

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

db_path="$RUN_ROOT/$namespace/jupiter.sqlite"

if [[ ! -f "$db_path" ]]; then
    echo "Database file not found at: $db_path"
    echo "Make sure Jupiter is running or the database exists."
    exit 1
fi

echo "Connecting to Jupiter SQLite database..."
echo "Database path: $db_path"
echo "Namespace: $namespace"
echo ""

sqlite3 "$db_path"
