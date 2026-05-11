#!/usr/bin/env bash

#MISE description="Clear a Jupiter database - dangerous!"
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

jupiter_source_webapi_run_env "$instance"

db_path="$(jupiter_sqlite_database_path_abs "$instance")"
pgdata="$(jupiter_postgres_pgdata_dir_abs "$instance")"
storage_engine="${WEBAPI_STORAGE_ENGINE:-sqlite}"

if [[ "$storage_engine" == "postgres" ]]; then
    if jupiter_postgres_server_reachable "$JUPITER_POSTGRES_HOST" "$JUPITER_POSTGRES_PORT" "$JUPITER_POSTGRES_USER" "$JUPITER_POSTGRES_PASSWORD" "$JUPITER_POSTGRES_DB"; then
        log error "Postgres still accepts connections at ${JUPITER_POSTGRES_HOST}:${JUPITER_POSTGRES_PORT}. Stop the Postgres sidecar before clearing."
        exit 1
    fi
    log info "Clearing Postgres data directory for instance ${instance}: $pgdata"
    rm -rf "${pgdata:?}"
    mkdir -p "$pgdata"
else
    log info "Clearing SQLite database for instance ${instance}: $db_path"
    rm -f "$db_path" "$db_path-wal" "$db_path-shm"
fi

log info "Clear completed (${storage_engine})."
