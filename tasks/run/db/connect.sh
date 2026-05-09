#!/usr/bin/env bash

#MISE description="Connect to Jupiter database"
#USAGE flag "--universe <universe>" default="dev" help="Jupiter universe" {
#USAGE   choices "dev" "thrive-sh-test" "thrive"
#USAGE }
#USAGE flag "--environment <environment>" default="local" help="Jupiter environment" {
#USAGE   choices "local" "staging" "production"
#USAGE }
#USAGE flag "--instance <instance>" help="Jupiter instance (defaults to standard instance)"
#USAGE flag "--visual" help="Open the database in a visual editor"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_universe:=}"
: "${usage_environment:=}"
: "${usage_instance:=}"
: "${usage_visual:=false}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

if [[ "$usage_universe" == "dev" ]]; then
    if [[ "$usage_environment" != "local" ]]; then
        log error "Environment $usage_environment is not supported for dev universe"
        exit 1
    fi

    env_file="$RUN_ROOT/$instance/webapi.env"
    if [[ ! -f "$env_file" ]]; then
        log error "Missing WebAPI run env file: $env_file"
        log error "Start the stack once with: mise run run:srv --instance $instance"
        exit 1
    fi

    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a

    if [[ "${WEBAPI_STORAGE_ENGINE:-sqlite}" == "postgres" ]]; then
        if [[ -z "${JUPITER_POSTGRES_HOST:-}" || -z "${JUPITER_POSTGRES_PORT:-}" || -z "${JUPITER_POSTGRES_USER:-}" || -z "${JUPITER_POSTGRES_DB:-}" || -z "${JUPITER_POSTGRES_PASSWORD+x}" ]]; then
            log error "Postgres connection parts missing in $env_file (expected JUPITER_POSTGRES_HOST/PORT/USER/PASSWORD/DB)."
            log error "Re-run: mise run run:srv --instance $instance"
            exit 1
        fi
        log info "Connecting to PostgreSQL for instance: $instance (WEBAPI_STORAGE_ENGINE=postgres)"

        psql_display_url=$(jupiter_postgres_psql_url "$JUPITER_POSTGRES_HOST" "$JUPITER_POSTGRES_PORT" "$JUPITER_POSTGRES_USER" "$JUPITER_POSTGRES_PASSWORD" "$JUPITER_POSTGRES_DB")

        log info "Use this connection URL in your SQL client: $psql_display_url"

        if [[ "$usage_visual" == true ]]; then
            log info "Use this connection URL in your SQL client: $psql_display_url"
            if command -v open >/dev/null 2>&1; then
                open -a DBeaver "$psql_display_url"
            fi
        else
            if ! command -v psql >/dev/null 2>&1; then
                log error "psql not found; install PostgreSQL client tools to connect to Postgres."
                exit 1
            fi
            PGPASSWORD="${JUPITER_POSTGRES_PASSWORD}" psql \
                -h "${JUPITER_POSTGRES_HOST}" \
                -p "${JUPITER_POSTGRES_PORT}" \
                -U "${JUPITER_POSTGRES_USER}" \
                -d "${JUPITER_POSTGRES_DB}"
        fi
    else
        db_path=$(jupiter_sqlite_database_path_abs "$instance")

        if [[ ! -f "$db_path" ]]; then
            log info "Database file not found at: $db_path"
            log info "Make sure Jupiter is running or the database exists."
            exit 1
        fi

        log info "Connecting to Jupiter SQLite database for instance: $instance at path: $db_path"

        if [[ "$usage_visual" == true ]]; then
            log info "Opening database in a visual editor..."
            open -a DBeaver "$db_path"
        else
            sqlite3 "$db_path"
        fi
    fi
elif [[ "$usage_universe" == "thrive" ]]; then
    if [[ "$usage_environment" == "production" ]]; then
        log info "Connecting to Jupiter SQLite database on Render (thrive/production)"

        render ssh jupiter-webapi -- sqlite3 /data/jupiter.sqlite
    elif [[ "$usage_environment" == "staging" ]]; then
        log info "Connecting to Jupiter SQLite database on Render (thrive/staging) for instance: $instance"

        render ssh "jupiter-webapi-${instance}" -- sqlite3 /data/jupiter.sqlite
    else
        log error "Environment $usage_environment is not supported for thrive universe"
        exit 1
    fi
elif [[ "$usage_universe" == "thrive-sh-test" ]]; then
    if [[ "$usage_environment" != "staging" ]]; then
        log error "Environment $usage_environment is not supported for thrive-sh-test universe"
        exit 1
    fi

    gcp_vm_name="thrive-sh-test-${instance}"

    log info "Connecting to Jupiter SQLite database for instance: $instance on GCP VM: $gcp_vm_name"

    log info "Opening interactive sqlite3 session on GCP VM..."
    gcloud compute ssh "$gcp_vm_name" \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT" \
        --ssh-flag="-tt" \
        --command "sudo docker exec -it jupiter-webapi-1 sqlite3 /data/jupiter.sqlite"
fi
