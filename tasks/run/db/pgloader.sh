#!/usr/bin/env bash

#MISE description="Load Jupiter SQLite into Postgres via pgloader (Docker)"
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--sqlite-file <path>" help="Path to jupiter.sqlite (requires --postgresql-uri)"
#USAGE flag "--postgresql-uri <uri>" help="Target Postgres URL (Render *.render.com Postgres: sslmode=require is appended when missing)"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_sqlite_file:=}"
: "${usage_postgresql_uri:=}"

set -e -o pipefail

source tasks/_common.sh

# libpq URI for pgloader running inside Docker (loopback host → host gateway).
_jupiter_pgloader_postgresql_uri() {
    local host=$1
    local port=$2
    local user=$3
    local password=$4
    local database=$5
    local docker_host=$host
    if [[ "$host" == "127.0.0.1" || "$host" == "localhost" ]]; then
        docker_host="host.docker.internal"
    fi
    PGLOADER_PG_HOST="$docker_host" \
        PGLOADER_PG_PORT="$port" \
        PGLOADER_PG_USER="$user" \
        PGLOADER_PG_PASSWORD="$password" \
        PGLOADER_PG_DB="$database" \
        python3 -c 'import os, urllib.parse as u
h, p, user, pw, db = os.environ["PGLOADER_PG_HOST"], os.environ["PGLOADER_PG_PORT"], os.environ["PGLOADER_PG_USER"], os.environ["PGLOADER_PG_PASSWORD"], os.environ["PGLOADER_PG_DB"]
print("postgresql://%s:%s@%s:%s/%s" % (u.quote(user, safe=""), u.quote(pw, safe=""), h, p, u.quote(db, safe="")))
'
}

# Render Postgres (*.render.com) requires TLS; append sslmode=require when absent.
_jupiter_pgloader_direct_uri_apply_default_sslmode() {
    if [[ "$postgres_uri" == *sslmode=* ]]; then
        return 0
    fi
    case "$postgres_uri" in
        *render.com*)
            if [[ "$postgres_uri" == *\?* ]]; then
                postgres_uri="${postgres_uri}&sslmode=require"
            else
                postgres_uri="${postgres_uri}?sslmode=require"
            fi
            log info "Appended sslmode=require (Render Postgres expects TLS)."
            ;;
    esac
}

sqlite_file="${usage_sqlite_file}"
postgres_uri="${usage_postgresql_uri}"
instance="${usage_instance}"
pgloader_from_instance_env=false

if [[ -n "$sqlite_file" && -n "$postgres_uri" ]]; then
    if [[ "$sqlite_file" != /* ]]; then
        sqlite_file="$(pwd)/$sqlite_file"
    fi
    db_path="$sqlite_file"
    pgloader_label="direct: $db_path"
elif [[ -n "$sqlite_file" || -n "$postgres_uri" ]]; then
    log error "Pass both --sqlite-file and --postgresql-uri, or use --instance alone."
    exit 1
else
    if [[ -z "$instance" ]]; then
        instance=$STANDARD_INSTANCE
    fi
    pgloader_from_instance_env=true
    pgloader_label="instance: $instance"
    jupiter_source_webapi_run_env "$instance"
    db_path="$(jupiter_sqlite_database_path_abs "$instance")"
fi

if [[ "$pgloader_from_instance_env" != true && -n "$postgres_uri" ]]; then
    _jupiter_pgloader_direct_uri_apply_default_sslmode
fi

if ! command -v docker >/dev/null 2>&1; then
    log error "docker not found; install Docker to run pgloader."
    exit 1
fi

if [[ ! -f "$db_path" ]]; then
    log error "SQLite database not found at: $db_path"
    log error "Nothing to load; create or copy a jupiter.sqlite there first."
    exit 1
fi

if ! command -v pg_isready >/dev/null 2>&1; then
    log error "pg_isready not found; install PostgreSQL client tools (same as for mise postgres)."
    exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
    log error "psql not found; install PostgreSQL client tools (needed after pgloader to sync ref_id sequences)."
    exit 1
fi

if [[ "$pgloader_from_instance_env" == true ]]; then
    if ! jupiter_postgres_server_reachable "$JUPITER_POSTGRES_HOST" "$JUPITER_POSTGRES_PORT" "$JUPITER_POSTGRES_USER" "$JUPITER_POSTGRES_PASSWORD" "$JUPITER_POSTGRES_DB"; then
        log error "Postgres not reachable at ${JUPITER_POSTGRES_HOST}:${JUPITER_POSTGRES_PORT}."
        exit 1
    fi
    target_uri="$(_jupiter_pgloader_postgresql_uri "$JUPITER_POSTGRES_HOST" "$JUPITER_POSTGRES_PORT" "$JUPITER_POSTGRES_USER" "$JUPITER_POSTGRES_PASSWORD" "$JUPITER_POSTGRES_DB")"
    psql_uri="$(jupiter_postgres_libpq_uri "$JUPITER_POSTGRES_HOST" "$JUPITER_POSTGRES_PORT" "$JUPITER_POSTGRES_USER" "$JUPITER_POSTGRES_PASSWORD" "$JUPITER_POSTGRES_DB")"
else
    if ! pg_isready -q -d "$postgres_uri" 2>/dev/null; then
        log error "Postgres not reachable (--postgresql-uri)."
        exit 1
    fi
    target_uri="$postgres_uri"
    psql_uri="$postgres_uri"
fi

sqlite_dir="$(cd "$(dirname "$db_path")" && pwd)"
sqlite_base="$(basename "$db_path")"
sqlite_in_container="/sqlite-source/${sqlite_base}"

docker_hosts=(--add-host=host.docker.internal:host-gateway)
docker_it=()
if [[ -t 0 && -t 1 ]]; then
    docker_it+=(-it)
else
    docker_it+=(-i)
fi

PGL_IMAGE="${JUPITER_PGLOADER_IMAGE:-ghcr.io/dimitri/pgloader:latest}"
# SBCL heap (MiB): default Docker pgloader often tops out ~1GB and dies on larger DBs.
# Override if needed, e.g. JUPITER_PGLOADER_DYNAMIC_SPACE_SIZE_MB=16384
: "${JUPITER_PGLOADER_DYNAMIC_SPACE_SIZE_MB:=8192}"

# ghcr.io/dimitri/pgloader has no linux/arm64 manifest; Apple Silicon / aarch64 need amd64 emulation.
docker_platform=()
case "$(uname -m)" in
    arm64 | aarch64)
        docker_platform=(--platform linux/amd64)
        ;;
esac

log info "Loading SQLite into Postgres ($pgloader_label)"
log info "Source (read-only mount): $db_path"
log info "Target (inside container): $target_uri"
log info "Using image: $PGL_IMAGE (override with JUPITER_PGLOADER_IMAGE)"
if ((${#docker_platform[@]})); then
    log info "Docker: ${docker_platform[*]} (pgloader image is amd64-only on this host)."
fi
log info "Pgloader runs with schema-neutral options: data only (no CREATE TABLE); existing tables from migrations."
log info "Pgloader also uses reset sequences; afterward this script runs setval for every public table whose ref_id is backed by a sequence (SERIAL / IDENTITY)."
log info "Target tables should be truncated or empty before load to avoid duplicate keys."
log info "SBCL dynamic heap: ${JUPITER_PGLOADER_DYNAMIC_SPACE_SIZE_MB}MiB (heap exhausted? raise JUPITER_PGLOADER_DYNAMIC_SPACE_SIZE_MB; see https://github.com/dimitri/pgloader/issues/962)."

log info "Running pgloader (see https://github.com/dimitri/pgloader)…"

# SQLite → Postgres WITH options must be repeated; comma-separated --with fails to parse (pgloader CLI).
docker run --rm "${docker_it[@]}" "${docker_hosts[@]}" "${docker_platform[@]}" \
    -v "${sqlite_dir}:/sqlite-source:ro" \
    "$PGL_IMAGE" \
    pgloader \
    --dynamic-space-size "$JUPITER_PGLOADER_DYNAMIC_SPACE_SIZE_MB" \
    --with "include no drop" \
    --with "create no tables" \
    --with "create no indexes" \
    --with "reset sequences" \
    --with "downcase identifiers" \
    --encoding "UTF-8" \
    "$sqlite_in_container" \
    "$target_uri"

if [[ "${JUPITER_PGLOADER_SKIP_REF_ID_SETVAL:-}" == "1" ]]; then
    log info "Skipping ref_id setval (JUPITER_PGLOADER_SKIP_REF_ID_SETVAL=1)."
    exit 0
fi

log info "Syncing sequences for public.*.ref_id (tables with a sequence / identity on ref_id only)…"

psql "$psql_uri" -v ON_ERROR_STOP=1 <<'PGLOADER_POST_SQL'
DO $body$
DECLARE
    rec record;
    rel text;
    seqname text;
    vmax bigint;
BEGIN
    FOR rec IN
        SELECT c.table_schema AS sch, c.table_name AS tbl
        FROM information_schema.columns c
        INNER JOIN information_schema.tables t
            ON t.table_schema = c.table_schema
            AND t.table_name = c.table_name
        WHERE c.table_schema = 'public'
          AND c.column_name = 'ref_id'
          AND t.table_type = 'BASE TABLE'
    LOOP
        rel := rec.sch || '.' || rec.tbl;
        seqname := pg_get_serial_sequence(rel, 'ref_id');
        IF seqname IS NULL THEN
            CONTINUE;
        END IF;
        EXECUTE format('SELECT coalesce(max(ref_id), 0) FROM %I.%I', rec.sch, rec.tbl) INTO vmax;
        IF vmax = 0 THEN
            PERFORM setval(seqname::regclass, 1, false);
        ELSE
            PERFORM setval(seqname::regclass, vmax, true);
        END IF;
    END LOOP;
END
$body$;
PGLOADER_POST_SQL

log info "Pgloader import and ref_id sequence sync finished ($pgloader_label)"
