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

# DBeaver -con uses pipe-separated key=value; escape | and \ in values.
_jupiter_dbeaver_escape_con_value() {
    printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/|/\\|/g'
}

# https://dbeaver.com/docs/dbeaver/Command-Line/ — pass -con via --args (URLs alone do not open a connection).
# When DBeaver is already running, use …/Contents/MacOS/dbeaver -con … so Eclipse forwards the connection;
# `open -a … --args -con` often activates the app without applying -con.
_jupiter_open_dbeaver_con() {
    local con_string=$1
    local _dbeaver_root _dbeaver_bin _dbeaver_app
    local _nullglob_was_off=false

    log info "DBeaver -con: $con_string"

    if [[ "$(uname -s)" == "Darwin" ]] && command -v open >/dev/null 2>&1; then
        shopt -q nullglob || _nullglob_was_off=true
        shopt -s nullglob
        for _dbeaver_root in \
            "/Applications/DBeaver Community.app" \
            "/Applications/DBeaver.app" \
            "/Applications/DBeaver CE.app" \
            "$HOME/Applications/DBeaver Community.app" \
            "$HOME/Applications/DBeaver.app" \
            /opt/homebrew/Caskroom/dbeaver-community/*/DBeaver*.app \
            /usr/local/Caskroom/dbeaver-community/*/DBeaver*.app; do
            [[ -d "$_dbeaver_root" ]] || continue
            _dbeaver_bin="${_dbeaver_root}/Contents/MacOS/dbeaver"
            if [[ -x "$_dbeaver_bin" ]]; then
                log info "Trying DBeaver launcher (forwards -con to a running instance): $_dbeaver_bin"
                if "$_dbeaver_bin" -con "$con_string" -bringToFront 2>/dev/null; then
                    [[ "$_nullglob_was_off" == true ]] && shopt -u nullglob
                    return 0
                fi
            fi
        done
        [[ "$_nullglob_was_off" == true ]] && shopt -u nullglob

        for _dbeaver_app in "DBeaver Community" "DBeaver" "DBeaver CE"; do
            log info "Trying open -a $_dbeaver_app (fallback if CLI launcher failed)…"
            if open -a "$_dbeaver_app" --args -con "$con_string" -bringToFront 2>/dev/null; then
                return 0
            fi
        done
        log error "Could not launch DBeaver (tried Contents/MacOS/dbeaver then open). Install e.g. brew install --cask dbeaver-community"
        return 1
    fi

    if command -v dbeaver-ce >/dev/null 2>&1; then
        dbeaver-ce -con "$con_string" -bringToFront >/dev/null 2>&1 &
        return 0
    fi

    log error "No DBeaver launcher found (macOS dbeaver binary or dbeaver-ce). Paste the -con string from the log into DBeaver."
    return 1
}

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

if [[ "$usage_universe" == "dev" ]]; then
    if [[ "$usage_environment" != "local" ]]; then
        log error "Environment $usage_environment is not supported for dev universe"
        exit 1
    fi

    jupiter_source_webapi_run_env "$instance"

    if [[ "${WEBAPI_STORAGE_ENGINE:-sqlite}" == "postgres" ]]; then
        if [[ -z "${POSTGRES_HOST:-}" || -z "${POSTGRES_PORT:-}" || -z "${POSTGRES_USER:-}" || -z "${POSTGRES_DB:-}" || -z "${POSTGRES_PASSWORD+x}" ]]; then
            log error "Postgres connection parts missing from webapi.env for instance ${instance} (expected POSTGRES_HOST/PORT/USER/PASSWORD/DB)."
            log error "Re-run: mise run run:srv --instance $instance"
            exit 1
        fi
        log info "Connecting to PostgreSQL for instance: $instance (WEBAPI_STORAGE_ENGINE=postgres)"

        # Same libpq URI as save_jupiter_url(..., webapi:postgres, ...) — prefer the saved file when present.
        postgres_url_file="$RUN_ROOT/$instance/webapi:postgres.url"
        postgres_client_url=""
        if [[ -f "$postgres_url_file" ]]; then
            IFS= read -r postgres_client_url <"$postgres_url_file" || true
        fi
        if [[ -z "$postgres_client_url" ]]; then
            postgres_client_url=$(jupiter_postgres_psql_url "$POSTGRES_HOST" "$POSTGRES_PORT" "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$POSTGRES_DB")
        fi

        log info "Postgres connection URL (libpq / psql): $postgres_client_url"

        if [[ "$usage_visual" == true ]]; then
            jdbc_url="jdbc:postgresql://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"
            log info "JDBC URL (reference): $jdbc_url"
            dbeaver_connection_name="Jupiter PostgreSQL ${instance} :${POSTGRES_PORT}"
            dbeaver_con="driver=postgresql|host=$(_jupiter_dbeaver_escape_con_value "$POSTGRES_HOST")|port=$(_jupiter_dbeaver_escape_con_value "$POSTGRES_PORT")|database=$(_jupiter_dbeaver_escape_con_value "$POSTGRES_DB")|user=$(_jupiter_dbeaver_escape_con_value "$POSTGRES_USER")|password=$(_jupiter_dbeaver_escape_con_value "$POSTGRES_PASSWORD")|name=$(_jupiter_dbeaver_escape_con_value "$dbeaver_connection_name")|openConsole=true|savePassword=true"
            if ! _jupiter_open_dbeaver_con "$dbeaver_con"; then
                exit 1
            fi
        else
            if ! command -v psql >/dev/null 2>&1; then
                log error "psql not found; install PostgreSQL client tools to connect to Postgres."
                exit 1
            fi
            psql "$postgres_client_url"
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
            sqlite_db_basename="${db_path##*/}"
            dbeaver_connection_name="Jupiter SQLite ${instance} - ${sqlite_db_basename}"
            dbeaver_con="driver=sqlite|database=$(_jupiter_dbeaver_escape_con_value "$db_path")|name=$(_jupiter_dbeaver_escape_con_value "$dbeaver_connection_name")|openConsole=true"
            if ! _jupiter_open_dbeaver_con "$dbeaver_con"; then
                exit 1
            fi
        else
            sqlite3 "$db_path"
        fi
    fi
elif [[ "$usage_universe" == "thrive" ]]; then
    if [[ "$usage_environment" == "production" ]]; then
        log info "Connecting to Jupiter SQLite database on Render (thrive/production)"

        render ssh jupiter-webapi-srv -- sqlite3 /data/jupiter.sqlite
    elif [[ "$usage_environment" == "staging" ]]; then
        log info "Connecting to Jupiter SQLite database on Render (thrive/staging) for instance: $instance"

        render ssh "jupiter-webapi-srv-${instance}" -- sqlite3 /data/jupiter.sqlite
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
        --command "sudo docker exec -it jupiter-webapi-srv-1 sqlite3 /data/jupiter.sqlite"
fi
