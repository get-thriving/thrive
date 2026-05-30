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

jupiter_source_webapi_run_env "$instance"

storage_engine="${WEBAPI_STORAGE_ENGINE:-sqlite}"
db_path="$(jupiter_sqlite_database_path_abs "$instance")"
postgres_dump="$(pwd)/${RUN_ROOT}/${instance}/jupiter.postgres.dump"
postgres_archive="$(pwd)/${RUN_ROOT}/${instance}/jupiter.postgres.pgdata.tar.gz"

if [[ "$storage_engine" == "postgres" ]]; then
    if [[ -z "${POSTGRES_HOST:-}" || -z "${POSTGRES_PORT:-}" ]]; then
        log error "Postgres settings missing from webapi.env for instance ${instance}"
        exit 1
    fi
    uri="$(jupiter_postgres_libpq_uri "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB")"
    pgdata="$(jupiter_postgres_pgdata_dir_abs "$instance")"
    mkdir -p "$(dirname "$postgres_dump")"

    if jupiter_postgres_server_reachable "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB"; then
        if ! command -v pg_dump >/dev/null 2>&1; then
            log error "pg_dump not found; install PostgreSQL client tools."
            exit 1
        fi
        log info "Postgres is reachable — pg_dump custom format → $postgres_dump"
        rm -f "$postgres_archive"
        set +e
        PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump --dbname="$uri" -Fc -f "$postgres_dump"
        pg_dump_rc=$?
        set -e
        if [[ "$pg_dump_rc" -gt 1 ]]; then
            log error "pg_dump failed with exit code $pg_dump_rc"
            exit "$pg_dump_rc"
        fi
        if [[ "$pg_dump_rc" -eq 1 ]]; then
            log info "pg_dump reported warnings (exit 1)."
        fi
        dump_size=$(find "$postgres_dump" -prune -exec ls -lh {} \; | awk '{print $5}')
        log info "Backup completed (pg_dump -Fc)."
        log info "Dump size: $dump_size"
    else
        log info "Postgres not reachable — tarring host pgdata: $pgdata → $postgres_archive"
        if [[ ! -d "$pgdata" ]] || [[ -z "$(ls -A "$pgdata" 2>/dev/null || true)" ]]; then
            log error "pgdata missing or empty at $pgdata. Start the stack once so Postgres initializes this directory, or run backup while Postgres is up."
            exit 1
        fi
        rm -f "$postgres_dump"
        tar -czf "$postgres_archive" -C "$(dirname "$pgdata")" "$(basename "$pgdata")"
        arch_size=$(find "$postgres_archive" -prune -exec ls -lh {} \; | awk '{print $5}')
        log info "Backup completed (offline pgdata archive)."
        log info "Archive size: $arch_size"
    fi
else
    if [[ ! -f "$db_path" ]]; then
        log error "SQLite database file not found at: $db_path"
        exit 1
    fi

    backup_path="$(pwd)/${RUN_ROOT}/${instance}/jupiter.sqlite.bak"

    log info "Backing up Jupiter SQLite for instance: $instance ($db_path → $backup_path)"

    if cp "$db_path" "$backup_path"; then
        log info "Backup completed successfully!"
        log info "Backup file: $backup_path"

        original_size=$(find "$db_path" -prune -exec ls -lh {} \; | awk '{print $5}')
        backup_size=$(find "$backup_path" -prune -exec ls -lh {} \; | awk '{print $5}')
        log info "Original size: $original_size"
        log info "Backup size: $backup_size"
    else
        log info "Backup failed!"
        exit 1
    fi
fi
