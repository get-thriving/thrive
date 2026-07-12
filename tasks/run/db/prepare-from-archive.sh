#!/usr/bin/env bash

#MISE description="Prepare a Render Postgres export as a local Jupiter database"
#USAGE flag "--archive <archive>" help="Path to the Render Postgres export (.zip, .dir.tar.gz, .tar.gz, .tgz, .sql, .sql.gz, .dump, or .bak)"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--remove-extracted" help="Delete the extracted archive after import (default: keep it on disk)"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_archive:=}"
: "${usage_instance:=}"
: "${usage_remove_extracted:=false}"

set -e -o pipefail

source tasks/_common.sh

archive="${usage_archive}"
instance="${usage_instance}"

if [[ "$archive" != /* ]]; then
    archive="$(pwd)/$archive"
fi

if [[ ! -f "$archive" ]]; then
    log error "Archive not found at: $archive"
    exit 1
fi

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

jupiter_source_webapi_run_env "$instance"

storage_engine="${WEBAPI_STORAGE_ENGINE:-sqlite}"
if [[ "$storage_engine" != "postgres" ]]; then
    log error "Instance ${instance} runs with WEBAPI_STORAGE_ENGINE=${storage_engine}; a Render Postgres export can only be imported into a Postgres instance."
    log error "Restart the instance on Postgres first, e.g.: mise run run:srv --instance ${instance} --storage-engine postgres"
    exit 1
fi

if [[ -z "${POSTGRES_HOST:-}" || -z "${POSTGRES_PORT:-}" || -z "${POSTGRES_USER:-}" || -z "${POSTGRES_DB:-}" || -z "${POSTGRES_PASSWORD+x}" ]]; then
    log error "Postgres connection parts missing from webapi.env for instance ${instance} (expected POSTGRES_HOST/PORT/USER/PASSWORD/DB)."
    log error "Re-run: mise run run:srv --instance ${instance} --storage-engine postgres"
    exit 1
fi

if ! command -v pg_restore >/dev/null 2>&1; then
    log error "pg_restore not found; install PostgreSQL client tools to import the export."
    exit 1
fi
if ! command -v psql >/dev/null 2>&1; then
    log error "psql not found; install PostgreSQL client tools to import the export."
    exit 1
fi

uri="$(jupiter_postgres_libpq_uri "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB")"

if ! jupiter_postgres_server_reachable "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB"; then
    log error "Postgres for instance ${instance} is not accepting connections at ${POSTGRES_HOST}:${POSTGRES_PORT}."
    log error "Start the stack first: mise run run:srv --instance ${instance} --storage-engine postgres"
    exit 1
fi

work_dir="$(pwd)/${RUN_ROOT}/${instance}/render-import.$$"
mkdir -p "$work_dir"

_cleanup_work_dir() {
    if [[ "$usage_remove_extracted" == true ]]; then
        rm -rf "$work_dir"
        return 0
    fi
    log info "Keeping extracted archive at: $work_dir (pass --remove-extracted to delete it)"
}
trap _cleanup_work_dir EXIT

log info "Importing Postgres export into local instance: ${instance}"
log info "Archive: $archive"
log info "Target Postgres: ${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB} (user: ${POSTGRES_USER})"
log info "Working directory (extraction): $work_dir"

# Unpack the archive into $work_dir. Render's logical exports are directory-format
# pg_dump archives packaged as .dir.tar.gz; older / manual exports may be .sql.gz,
# a custom-format .dump/.bak, or a plain .sql. Handle all of them.
case "$archive" in
    *.zip)
        if ! command -v unzip >/dev/null 2>&1; then
            log error "unzip not found; install it to extract a .zip export (e.g. brew install unzip)."
            exit 1
        fi
        log info "Extracting zip archive…"
        unzip -q -o "$archive" -d "$work_dir"
        ;;
    *.tar.gz | *.tgz)
        log info "Extracting gzip tar archive…"
        tar -xzf "$archive" -C "$work_dir"
        ;;
    *.tar)
        log info "Extracting tar archive…"
        tar -xf "$archive" -C "$work_dir"
        ;;
    *.sql.gz)
        log info "Decompressing gzip SQL dump…"
        gunzip -c "$archive" > "$work_dir/dump.sql"
        ;;
    *.sql | *.dump | *.bak | *.pgdump | *.pgcustom)
        log info "Using dump file directly (no extraction needed)…"
        cp "$archive" "$work_dir/"
        ;;
    *)
        log error "Unrecognized archive type: $archive"
        log error "Supported: .zip, .dir.tar.gz, .tar.gz, .tgz, .tar, .sql, .sql.gz, .dump, .bak"
        exit 1
        ;;
esac

# Locate the actual dump inside the extracted tree.
#   - directory-format pg_dump: a directory containing a "toc.dat" file
#   - custom-format pg_dump: a *.dump / *.bak / *.pgdump / *.pgcustom file (magic "PGDMP")
#   - plain SQL: a *.sql file
dump_dir=""
toc_path="$(find "$work_dir" -type f -name toc.dat -print 2>/dev/null | head -n1)"
if [[ -n "$toc_path" ]]; then
    dump_dir="$(dirname "$toc_path")"
fi

custom_dump=""
if [[ -z "$dump_dir" ]]; then
    while IFS= read -r candidate; do
        # pg_dump custom format starts with the magic bytes "PGDMP".
        if [[ "$(head -c 5 "$candidate" 2>/dev/null)" == "PGDMP" ]]; then
            custom_dump="$candidate"
            break
        fi
    done < <(find "$work_dir" -type f \( -name '*.dump' -o -name '*.bak' -o -name '*.pgdump' -o -name '*.pgcustom' \) -print 2>/dev/null)
fi

sql_dump=""
if [[ -z "$dump_dir" && -z "$custom_dump" ]]; then
    sql_dump="$(find "$work_dir" -type f -name '*.sql' -print 2>/dev/null | head -n1)"
fi

restore_rc=0
if [[ -n "$dump_dir" ]]; then
    log info "Detected directory-format pg_dump export at: $dump_dir"
    log info "Restoring with pg_restore (--clean --if-exists --no-owner --no-privileges)…"
    set +e
    PGPASSWORD="${POSTGRES_PASSWORD}" pg_restore \
        --dbname="$uri" \
        --verbose \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        --no-acl \
        --format=directory \
        "$dump_dir"
    restore_rc=$?
    set -e
elif [[ -n "$custom_dump" ]]; then
    log info "Detected custom-format pg_dump export at: $custom_dump"
    log info "Restoring with pg_restore (--clean --if-exists --no-owner --no-privileges)…"
    set +e
    PGPASSWORD="${POSTGRES_PASSWORD}" pg_restore \
        --dbname="$uri" \
        --verbose \
        --clean \
        --if-exists \
        --no-owner \
        --no-privileges \
        --no-acl \
        "$custom_dump"
    restore_rc=$?
    set -e
elif [[ -n "$sql_dump" ]]; then
    log info "Detected plain SQL export at: $sql_dump"
    log info "Restoring with psql…"
    set +e
    PGPASSWORD="${POSTGRES_PASSWORD}" psql "$uri" -v ON_ERROR_STOP=0 -f "$sql_dump"
    restore_rc=$?
    set -e
else
    log error "Could not find a pg_dump directory (toc.dat), a custom-format dump, or a .sql file inside: $work_dir"
    log error "Contents:"
    find "$work_dir" -maxdepth 3 -print >&2 || true
    exit 1
fi

# pg_restore uses exit code 1 for warnings (e.g. missing DROP targets on a fresh DB); data is still usable.
if [[ "$restore_rc" -gt 1 ]]; then
    log error "Import failed with exit code $restore_rc"
    exit "$restore_rc"
fi
if [[ "$restore_rc" -eq 1 ]]; then
    log info "Import reported warnings (exit 1) — common on a fresh database; data should still be usable."
fi

log info "Render export imported into instance ${instance} (${POSTGRES_DB} on ${POSTGRES_HOST}:${POSTGRES_PORT})."
log info "Tip: connect and verify with: mise run run:db:connect --instance ${instance}"
