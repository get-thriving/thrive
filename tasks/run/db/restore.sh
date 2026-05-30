#!/usr/bin/env bash

#MISE description="Restore Jupiter database from backup"
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
backup_path="$(pwd)/${RUN_ROOT}/${instance}/jupiter.sqlite.bak"
postgres_dump="$(pwd)/${RUN_ROOT}/${instance}/jupiter.postgres.dump"
postgres_archive="$(pwd)/${RUN_ROOT}/${instance}/jupiter.postgres.pgdata.tar.gz"

if [[ "$storage_engine" == "postgres" ]]; then
    uri="$(jupiter_postgres_libpq_uri "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB")"
    pgdata="$(jupiter_postgres_pgdata_dir_abs "$instance")"

    if [[ -f "$postgres_dump" ]]; then
        if ! jupiter_postgres_server_reachable "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB"; then
            log error "Found $postgres_dump but Postgres is not accepting connections. Start: mise run run:srv --instance $instance — then retry restore."
            exit 1
        fi
        if ! command -v pg_restore >/dev/null 2>&1; then
            log error "pg_restore not found; install PostgreSQL client tools."
            exit 1
        fi
        log info "Restoring Postgres from pg_dump archive: $postgres_dump"
        set +e
        PGPASSWORD="${POSTGRES_PASSWORD}" pg_restore \
            --dbname="$uri" \
            --clean \
            --if-exists \
            --no-owner \
            --no-acl \
            "$postgres_dump"
        pg_restore_rc=$?
        set -e
        if [[ "$pg_restore_rc" -gt 1 ]]; then
            log error "pg_restore failed with exit code $pg_restore_rc"
            exit "$pg_restore_rc"
        fi
        if [[ "$pg_restore_rc" -eq 1 ]]; then
            log info "pg_restore reported warnings (exit 1); data may still be usable."
        fi
        dump_size=$(find "$postgres_dump" -prune -exec ls -lh {} \; | awk '{print $5}')
        log info "Restore completed (pg_restore). Dump file size: $dump_size"
    elif [[ -f "$postgres_archive" ]]; then
        if jupiter_postgres_server_reachable "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB"; then
            log error "Found offline backup $postgres_archive but Postgres is running on this port. Stop the instance (e.g. pm2 / Docker) so nothing holds the data directory, then retry."
            exit 1
        fi
        log info "Restoring Postgres host pgdata from: $postgres_archive"
        mkdir -p "$(dirname "$pgdata")"
        rm -rf "${pgdata:?}"
        tar -xzf "$postgres_archive" -C "$(dirname "$pgdata")"
        if [[ ! -d "$pgdata" ]]; then
            log error "After extract, expected directory missing: $pgdata"
            exit 1
        fi
        arch_size=$(find "$postgres_archive" -prune -exec ls -lh {} \; | awk '{print $5}')
        log info "Restore completed (pgdata tarball). Archive size: $arch_size"
    else
        log error "No Postgres backup found (expected $postgres_dump from pg_dump, or $postgres_archive from offline backup)."
        exit 1
    fi
else
    if [[ ! -f "$backup_path" ]]; then
        log error "SQLite backup not found at: $backup_path"
        exit 1
    fi

    log info "Restoring Jupiter SQLite from backup..."
    log info "Source (backup): $backup_path"
    log info "Destination: $db_path"
    log info "Instance: $instance"

    mkdir -p "$(dirname "$db_path")"

    if cp "$backup_path" "$db_path"; then
        log info "Restore completed successfully!"
        log info "Database file: $db_path"

        backup_size=$(find "$backup_path" -prune -exec ls -lh {} \; | awk '{print $5}')
        restored_size=$(find "$db_path" -prune -exec ls -lh {} \; | awk '{print $5}')
        log info "Backup size: $backup_size"
        log info "Restored size: $restored_size"
    else
        log info "Restore failed!"
        exit 1
    fi
fi
