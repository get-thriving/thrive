#!/bin/bash

source src/Config.global
source infra/Config.infra
source secrets/Config.secrets

export THRIVE_SH_TEST_UNIVERSE=thrive-sh-test
export THRIVE_SH_TEST_DNS_ZONE=thrive-sh-test
export THRIVE_SH_TEST_DOMAIN=.thrive-test.xyz
export THRIVE_GCP_PROJECT=get-thriving-main
export THRIVE_GCP_ZONE=europe-west1-c
export RUN_ROOT=.build-cache/run
export STANDARD_INSTANCE=dev
export STANDARD_UNIVERSE=dev
export STANDARD_WEBAPI_PORT=8004
export STANDARD_WEBAPI_POSTGRES_PORT=8005
export STANDARD_API_PORT=8020
export STANDARD_MCP_PORT=8030
export STANDARD_WEBUI_PORT=10020
export STANDARD_DOCS_PORT=8000

# Local WebAPI Postgres sidecar defaults (pm2 docker run / dev tooling).
export DEV_POSTGRES_HOST=127.0.0.1
export DEV_POSTGRES_USER=jupiter
export DEV_POSTGRES_PASSWORD=secret
export DEV_POSTGRES_DB=jupiter

export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

: "${usage_log:=}"

if [[ "$usage_log" == "trace" ]]; then
    set -x
fi

log_level_num() {
  case "$1" in
    trace) echo 0 ;;
    debug) echo 1 ;;
    info)  echo 2 ;;
    *)     echo 99 ;;  # unknown → highest (ignored)
  esac
}

log() {
    local level="$1"
    shift

    local target
    local current

    target=$(log_level_num "$level")
    current=$(log_level_num "${usage_log:-info}")

    if [ "$target" -ge "$current" ]; then
        echo "[$level] $*" >&2
    fi
}

# Absolute filesystem path to the Jupiter SQLite DB for a dev run instance (cwd = repo root).
jupiter_sqlite_database_path_abs() {
    local instance=$1
    echo "$(pwd)/${RUN_ROOT}/${instance}/jupiter.sqlite"
}

# Host bind-mount source for the PM2 Postgres sidecar (PG 18+ → container /var/lib/postgresql).
jupiter_postgres_pgdata_dir_abs() {
    local instance=$1
    echo "$(pwd)/${RUN_ROOT}/${instance}/pgdata"
}

# SQLITE_DB_URL for processes whose cwd is src/webapi/<pkg> (srv or a cron); ../../../ reaches repo root.
jupiter_sqlite_sqlalchemy_url_webapi_relative() {
    local instance=$1
    echo "sqlite+aiosqlite:///../../../${RUN_ROOT}/${instance}/jupiter.sqlite"
}

# WebAPI cron packages (folder under src/webapi/). Image tags: jupiter/webapi-<folder> (see tasks/build/docker.sh).
WEBAPI_CRON_FOLDERS=(
    gc-do-all
    clear-abandoned-users-do-all
    sync-google-user-data-do-all
    gen-do-all
    schedule-external-sync-do-all
    search-index-backfill-do-all
    crm-backfill-do-all
    search-mutation-log-drain-do-all
    search-mutation-requeue-do-all
    stats-do-all
)

# PM2, local Compose, and thrive-sh-test: in-process scheduler. Render sets start-run-stop in render.yaml.
WEBAPI_CRON_EXECUTION_MODE_LOCAL=run-forever

jupiter_webapi_cron_image_name() {
    echo "webapi-${1}"
}

# Compose env name, e.g. gc-do-all -> DOCKER_IMAGE_WEBAPI_GC_DO_ALL.
jupiter_webapi_cron_docker_env_var() {
    local folder=$1
    echo "DOCKER_IMAGE_WEBAPI_$(echo "$folder" | tr '[:lower:]-' '[:upper:]_')"
}

jupiter_webapi_cron_tar_name() {
    echo "$(jupiter_webapi_cron_image_name "$1").tar"
}

# User-facing cron service name: webapi:<folder> (e.g. webapi:stats-do-all).
jupiter_validate_webapi_cron_service() {
    local service=$1

    if [[ "$service" != webapi:* ]]; then
        log error "Expected webapi:<folder>, got: $service"
        exit 1
    fi

    local folder="${service#webapi:}"
    if [[ -z "$folder" ]]; then
        log error "Expected webapi:<folder>, got: $service"
        exit 1
    fi

    jupiter_validate_webapi_cron_folder "$folder"
}

jupiter_webapi_cron_compose_service_name() {
    jupiter_webapi_cron_image_name "$1"
}

jupiter_validate_webapi_cron_folder() {
    local folder=$1
    local known

    for known in "${WEBAPI_CRON_FOLDERS[@]}"; do
        if [[ "$known" == "$folder" ]]; then
            return 0
        fi
    done

    log error "Unknown WebAPI cron folder: $folder (expected one of: ${WEBAPI_CRON_FOLDERS[*]})"
    exit 1
}

# Dummy env satisfies ${VAR:?...} when invoking compose against a running jupiter project.
_jupiter_dev_docker_compose_kill_service() {
    local compose_service=$1
    local signal=$2

    UNIVERSE=compose-teardown \
        INSTANCE=compose-teardown \
        AUTH_TOKEN_SECRET=compose-teardown \
        SESSION_COOKIE_SECRET=compose-teardown \
        DOMAIN=localhost \
        docker compose -f infra/self-hosted/compose.yaml kill -s "$signal" "$compose_service"
}

_jupiter_pm2_process_pid() {
    local pm2_name=$1
    local pid

    pid=$(npx pm2 pid "$pm2_name" 2>/dev/null || true)
    if [[ -z "$pid" ]]; then
        log error "PM2 process not running: $pm2_name"
        exit 1
    fi

    echo "$pid"
}

# watchfiles runs the cron in a multiprocessing.spawn child; SIGUSR1 must go there, not the PM2 root.
_jupiter_watchfiles_spawn_child_pid() {
    local root_pid=$1
    local line spawn_pid

    if ! command -v pstree >/dev/null 2>&1; then
        log error "pstree is required to trigger PM2 WebAPI crons (install via brew bundle)"
        exit 1
    fi

    while IFS= read -r line; do
        if [[ "$line" == *multiprocessing.spawn* ]]; then
            spawn_pid=$(awk '{print $2}' <<<"$line")
            break
        fi
    done < <(pstree "$root_pid" 2>/dev/null || true)

    if [[ -z "$spawn_pid" ]]; then
        return 1
    fi

    echo "$spawn_pid"
}

jupiter_trigger_webapi_cron() {
    local instance=$1
    local service=$2
    local run_mode=$3
    local folder compose_service pm2_name root_pid target_pid

    jupiter_validate_webapi_cron_service "$service"
    folder="${service#webapi:}"

    case "$run_mode" in
        pm2)
            pm2_name="${instance}:${service}"
            root_pid=$(_jupiter_pm2_process_pid "$pm2_name")
            if target_pid=$(_jupiter_watchfiles_spawn_child_pid "$root_pid"); then
                log info "Sending SIGUSR1 to watchfiles spawn child $target_pid (PM2 $pm2_name, root PID $root_pid)"
            else
                target_pid=$root_pid
                log info "Sending SIGUSR1 to PM2 process $target_pid ($pm2_name)"
            fi
            kill -SIGUSR1 "$target_pid"
            ;;
        docker)
            compose_service=$(jupiter_webapi_cron_compose_service_name "$folder")
            log info "Sending SIGUSR1 to docker compose service ${compose_service}"
            _jupiter_dev_docker_compose_kill_service "$compose_service" SIGUSR1
            ;;
        *)
            log error "Unknown run mode: $run_mode (expected pm2 or docker)"
            exit 1
            ;;
    esac
}

# Export DOCKER_IMAGE_WEBAPI_* for infra/self-hosted/compose.yaml cron services.
jupiter_export_webapi_cron_docker_images() {
    local source=$1
    local version=$2
    local platform=$3
    local folder env_var image
    for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
        env_var=$(jupiter_webapi_cron_docker_env_var "$folder")
        image=$(get_jupiter_image "$(jupiter_webapi_cron_image_name "$folder")" "$source" "$version" "$platform")
        export "${env_var}=${image}"
    done
}

# JSON array of {folder, module, logFile} for PM2 WebAPI cron apps (templates: webapiCronApps).
jupiter_webapi_cron_apps_for_pm2() {
    local instance=$1
    local run_root=$2
    local folder module entries=()
    for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
        module="jupiter_webapi_$(echo "$folder" | tr '-' '_').jupiter"
        entries+=("$(jo folder="$folder" module="$module" logFile="../../${run_root}/${instance}/webapi-cron-${folder}.log")")
    done
    jo -a "${entries[@]}"
}

# Merge base PM2 render JSON (from jo) with webapiCronApps for Handlebars.
jupiter_pm2_render_data_with_cron_apps() {
    local base_json=$1
    local instance=$2
    local run_root=$3
    local cron_json
    cron_json=$(jupiter_webapi_cron_apps_for_pm2 "$instance" "$run_root")
    node -e 'const b=JSON.parse(process.argv[1]); const c=JSON.parse(process.argv[2]); console.log(JSON.stringify({...b,webapiCronApps:c}));' "$base_json" "$cron_json"
}

# libpq-style URI (postgresql://), e.g. psql and webapi:postgres .url files.
jupiter_postgres_psql_url() {
    local host=$1
    local port=$2
    local user=$3
    local password=$4
    local database=$5
    echo "postgresql://${user}:${password}@${host}:${port}/${database}"
}

# Async SQLAlchemy URL for asyncpg (POSTGRES_DB_URL in WebAPI).
jupiter_postgres_async_sqlalchemy_url() {
    local host=$1
    local port=$2
    local user=$3
    local password=$4
    local database=$5
    echo "postgresql+asyncpg://${user}:${password}@${host}:${port}/${database}"
}

# Docker Compose DNS name for infra/self-hosted/compose.yaml postgres service (must match `services.*` key).
COMPOSE_POSTGRES_SERVICE_HOST=webapi-postgres

# Inert async URL when WebAPI uses SQLite storage but PostgresConnection is still constructed.
jupiter_postgres_async_placeholder_sqlalchemy_url() {
    local user=$1
    local password=$2
    jupiter_postgres_async_sqlalchemy_url "127.0.0.1" "1" "$user" "$password" "disabled"
}

# Source .build-cache/run/<instance>/webapi.env (WEBAPI_* + POSTGRES_*). Cwd must be repo root.
jupiter_source_webapi_run_env() {
    local instance=$1
    local env_file
    env_file="$(pwd)/${RUN_ROOT}/${instance}/webapi.env"
    if [[ ! -f "$env_file" ]]; then
        log error "Missing WebAPI run env: $env_file — start the stack: mise run run:srv --instance ${instance}"
        exit 1
    fi
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
}

# libpq URI from explicit host, port, user, password, database (delegates to jupiter_postgres_psql_url).
jupiter_postgres_libpq_uri() {
    jupiter_postgres_psql_url "$1" "$2" "$3" "$4" "$5"
}

# True when pg_isready succeeds for the given connection parts.
jupiter_postgres_server_reachable() {
    local host=$1
    local port=$2
    local user=$3
    local password=$4
    local database=$5
    command -v pg_isready >/dev/null 2>&1 || return 1
    PGPASSWORD="$password" pg_isready -q \
        -h "$host" -p "$port" -U "$user" -d "$database" 2>/dev/null
}

run_jupiter_webapp() {
    local UNIVERSE=$1
    local INSTANCE=$2
    local WEBAPI_PORT=$3
    local WEBAPI_POSTGRES_PORT=$4
    local API_PORT=$5
    local WEBUI_PORT=$6
    local DOCS_PORT=$7
    local MCP_PORT=$8
    local should_wait=$9
    shift 9
    local should_monit=$1
    local in_ci=$2
    local source=$3
    local version=$4
    local mode=$5
    local clear_first=$6
    local webapi_storage_engine=$7
    local webapi_telemetry=$8
    local webapi_search=$9
    shift 9
    local webapi_crm=$1
    local webapi_auth_provider=$2
    local webapi_email_sender=$3
    local webapi_email_verification_strategy=$4
    webapi_storage_engine=${webapi_storage_engine:-${WEBAPI_STORAGE_ENGINE:-sqlite}}
    webapi_telemetry=${webapi_telemetry:-${TELEMETRY:-local}}
    webapi_search=${webapi_search:-${WEBAPI_SEARCH:-sql}}
    webapi_crm=${webapi_crm:-${CRM:-noop}}
    webapi_auth_provider=${webapi_auth_provider:-${AUTH_PROVIDER:-local}}
    webapi_email_sender=${webapi_email_sender:-${WEBAPI_EMAIL_SENDER:-noop}}
    local email_verification_strategy=${webapi_email_verification_strategy:-${EMAIL_VERIFICATION_STRATEGY:-none}}
    if [[ "$webapi_email_sender" != "noop" && "$webapi_email_sender" != "resend" ]]; then
        log error "Invalid webapi email sender: $webapi_email_sender (expected noop or resend)"
        exit 1
    fi
    if [[ "$webapi_storage_engine" != "sqlite" && "$webapi_storage_engine" != "postgres" ]]; then
        log error "Invalid webapi storage engine: $webapi_storage_engine (expected sqlite or postgres)"
        exit 1
    fi
    if [[ "$webapi_telemetry" != "local" && "$webapi_telemetry" != "sentry" ]]; then
        log error "Invalid webapi telemetry: $webapi_telemetry (expected local or sentry)"
        exit 1
    fi
    if [[ "$webapi_search" != "sql" && "$webapi_search" != "algolia" ]]; then
        log error "Invalid webapi search: $webapi_search (expected sql or algolia)"
        exit 1
    fi
    if [[ "$webapi_crm" != "noop" && "$webapi_crm" != "wix" ]]; then
        log error "Invalid webapi crm: $webapi_crm (expected noop or wix)"
        exit 1
    fi
    if [[ "$webapi_auth_provider" != "local" && "$webapi_auth_provider" != "local-google-apple" ]]; then
        log error "Invalid webapi auth provider: $webapi_auth_provider (expected local or local-google-apple)"
        exit 1
    fi
    if [[ "$email_verification_strategy" != "none" && "$email_verification_strategy" != "verify" ]]; then
        log error "Invalid email verification strategy: $email_verification_strategy (expected none or verify)"
        exit 1
    fi
    jupiter_validate_docker_source_for_universe "$UNIVERSE" "$source"

    mkdir -p "$RUN_ROOT/$INSTANCE"

    log info "Running Jupiter WebApi in universe: $UNIVERSE, instance: $INSTANCE, webapi port: $WEBAPI_PORT, webapi postgres port: $WEBAPI_POSTGRES_PORT, api port: $API_PORT, webui port: $WEBUI_PORT, docs port: $DOCS_PORT, mcp port: $MCP_PORT, webapi blend (ADR 0008) storage=$webapi_storage_engine telemetry=$webapi_telemetry search=$webapi_search crm=$webapi_crm auth_provider=$webapi_auth_provider email_verification_strategy=$email_verification_strategy email_sender=$webapi_email_sender, source: $source, version: $version, mode: $mode"

    if [[ "$UNIVERSE" == "dev" ]]; then
        if [[ "$mode" == "pm2" ]]; then
            _run_dev_jupiter_webapp_with_pm2 "$INSTANCE" "$WEBAPI_PORT" "$WEBAPI_POSTGRES_PORT" "$API_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$MCP_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version" "$clear_first" "$webapi_storage_engine" "$webapi_telemetry" "$webapi_search" "$webapi_crm" "$webapi_auth_provider" "$webapi_email_sender" "$email_verification_strategy"
        else
            _run_dev_jupiter_webapp_with_docker "$INSTANCE" "$WEBAPI_PORT" "$WEBAPI_POSTGRES_PORT" "$API_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$MCP_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version" "$clear_first" "$webapi_storage_engine" "$webapi_telemetry" "$webapi_search" "$webapi_crm" "$webapi_auth_provider" "$webapi_email_sender" "$email_verification_strategy"
        fi
    elif [[ "$UNIVERSE" == "thrive-sh-test" ]]; then
        _run_thrive_sh_test_webapp "$INSTANCE" "$WEBAPI_PORT" "$WEBAPI_POSTGRES_PORT" "$API_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$MCP_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version" "$clear_first" "$webapi_storage_engine" "$webapi_telemetry" "$webapi_search" "$webapi_crm" "$webapi_auth_provider" "$webapi_email_sender" "$email_verification_strategy"
    else
        log error "Unknown universe: $UNIVERSE"
        exit 1
    fi
}

_run_dev_jupiter_webapp_with_pm2() {
    local instance=$1
    local webapiLogFile=../../$RUN_ROOT/$instance/webapi.log
    local webapiSqliteDbUrl
    webapiSqliteDbUrl=$(jupiter_sqlite_sqlalchemy_url_webapi_relative "$instance")
    local webapiPort=$2
    local webapiServerUrl=http://localhost:${webapiPort}
    local webapiPostgresLogFile=../../$RUN_ROOT/$instance/webapi-postgres.log
    local webapiPostgresPort=$3
    local webapiPostgresDb=$DEV_POSTGRES_DB
    local webapiPostgresUser=$DEV_POSTGRES_USER
    local webapiPostgresPassword=$DEV_POSTGRES_PASSWORD
    local webapiPostgresPgdataHostPath
    webapiPostgresPgdataHostPath=$(jupiter_postgres_pgdata_dir_abs "$instance")
    local webuiLogFile=../../$RUN_ROOT/$instance/webui.log
    local apiPort=$4
    local apiServerUrl=http://localhost:${apiPort}
    local apiLogFile=../../$RUN_ROOT/$instance/api.log
    local webuiPort=$5
    local webuiServerUrl=http://localhost:${webuiPort}
    local docsLogFile=../../$RUN_ROOT/$instance/docs.log
    local docsPort=$6
    local docsServerUrl=http://localhost:${docsPort}
    local docsPublicName=$PUBLIC_NAME
    local docsAuthor=$AUTHOR
    local docsCopyright=$COPYRIGHT
    local mcpPort=$7
    local mcpServerUrl=http://localhost:${mcpPort}
    local mcpLogFile=../../$RUN_ROOT/$instance/mcp.log
    local should_wait=$8
    local should_monit=$9
    shift 9
    local in_ci=$1
    local source=$2
    local version=$3
    local clear_first=$4
    local webapi_storage_engine=$5
    local webapi_telemetry=$6
    local webapi_search=$7
    local webapi_crm=$8
    local webapi_auth_provider=$9
    local webapi_email_sender=${10}
    local webapi_email_verification_strategy=${11}
    webapi_storage_engine=${webapi_storage_engine:-${WEBAPI_STORAGE_ENGINE:-sqlite}}
    webapi_telemetry=${webapi_telemetry:-${TELEMETRY:-local}}
    webapi_search=${webapi_search:-${WEBAPI_SEARCH:-sql}}
    webapi_crm=${webapi_crm:-${CRM:-noop}}
    webapi_auth_provider=${webapi_auth_provider:-${AUTH_PROVIDER:-local}}
    webapi_email_sender=${webapi_email_sender:-${WEBAPI_EMAIL_SENDER:-noop}}
    local email_verification_strategy=${webapi_email_verification_strategy:-${EMAIL_VERIFICATION_STRATEGY:-none}}
    export TELEMETRY="$webapi_telemetry"
    export WEBAPI_SEARCH="$webapi_search"
    export CRM="$webapi_crm"
    export AUTH_PROVIDER="$webapi_auth_provider"
    export EMAIL_VERIFICATION_STRATEGY="$email_verification_strategy"
    export WEBAPI_EMAIL_SENDER="$webapi_email_sender"

    local webapiAlembicIniPath="../../core/migrations/alembic.sqlite.ini"
    local webapiAlembicMigrationsPath="../../core/migrations/sqlite"
    local webapiPostgresDbUrl
    local webapiSqliteOnly=true
    local webapiPostgresServerUrl
    webapiPostgresServerUrl=$(jupiter_postgres_psql_url "$DEV_POSTGRES_HOST" "$webapiPostgresPort" "$webapiPostgresUser" "$webapiPostgresPassword" "$webapiPostgresDb")

    if [[ "$webapi_storage_engine" == "postgres" ]]; then
        webapiAlembicIniPath="../../core/migrations/alembic.postgres.ini"
        webapiAlembicMigrationsPath="../../core/migrations/postgres"
        webapiPostgresDbUrl=$(jupiter_postgres_async_sqlalchemy_url "$DEV_POSTGRES_HOST" "$webapiPostgresPort" "$webapiPostgresUser" "$webapiPostgresPassword" "$webapiPostgresDb")
        webapiSqliteOnly=false
    else
        webapiPostgresDbUrl=$(jupiter_postgres_async_placeholder_sqlalchemy_url "$webapiPostgresUser" "$webapiPostgresPassword")
    fi

    # If source is not local, or version is not local, then we exit
    if [[ "$source" != "local" ]] || [[ "$version" != "latest" ]]; then
        log error "Source or version is not local, exiting"
        exit 1
    fi

    if [[ "$clear_first" == "true" ]]; then
        clear_jupiter_database "$instance"
    fi

    create_jupiter_database "$instance"

    write_jupiter_run_webapi_env "$instance" "$webapi_storage_engine" "$DEV_POSTGRES_HOST" "$webapiPostgresPort" "$webapiPostgresUser" "$webapiPostgresPassword" "$webapiPostgresDb"

    pm2_base_data=$(jo instance="$instance" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webapiServerUrl="$webapiServerUrl" webapiPostgresLogFile="$webapiPostgresLogFile" webapiPostgresPort="$webapiPostgresPort" webapiPostgresDb="$webapiPostgresDb" webapiPostgresUser="$webapiPostgresUser" webapiPostgresPassword="$webapiPostgresPassword" webapiPostgresPgdataHostPath="$webapiPostgresPgdataHostPath" webapiPostgresVersion="$POSTGRES_VERSION" webapiStorageEngine="$webapi_storage_engine" jupiterTelemetry="$webapi_telemetry" webapiSearch="$webapi_search" jupiterCrm="$webapi_crm" jupiterAuthProvider="$webapi_auth_provider" jupiterEmailVerificationStrategy="$email_verification_strategy" jupiterEmailSender="$webapi_email_sender" webapiPostgresDbUrl="$webapiPostgresDbUrl" webapiAlembicIniPath="$webapiAlembicIniPath" webapiAlembicMigrationsPath="$webapiAlembicMigrationsPath" webapiSqliteOnly=$webapiSqliteOnly webapiCronExecutionMode="$WEBAPI_CRON_EXECUTION_MODE_LOCAL" apiLogFile="$apiLogFile" apiPort="$apiPort" apiServerUrl="$apiServerUrl" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webuiServerUrl="$webuiServerUrl" docsLogFile="$docsLogFile" docsPort="$docsPort" docsServerUrl="$docsServerUrl" docsPublicName="$docsPublicName" docsAuthor="$docsAuthor" docsCopyright="$docsCopyright" mcpLogFile="$mcpLogFile" mcpPort="$mcpPort" mcpServerUrl="$mcpServerUrl")
    data=$(jupiter_pm2_render_data_with_cron_apps "$pm2_base_data" "$instance" "$RUN_ROOT")
    if [[ "$in_ci" == "dev" ]]; then
        node tasks/_resources/render-hbs.mjs tasks/_resources/pm2.config.dev.js.hbs "$data" > "$RUN_ROOT/$instance/pm2.config.js"
    else
        node tasks/_resources/render-hbs.mjs tasks/_resources/pm2.config.ci.js.hbs "$data" > "$RUN_ROOT/$instance/pm2.config.js"
    fi

    # shellcheck disable=SC2064
    trap "npx pm2 delete '$RUN_ROOT/$instance/pm2.config.js'" EXIT
    log info "Starting Jupiter with pm2 config: $RUN_ROOT/$instance/pm2.config.js"
    npx pm2 --no-color start "$RUN_ROOT/$instance/pm2.config.js"

    save_jupiter_url "$instance" "webapi:srv" "$webapiServerUrl"
    save_jupiter_url "$instance" "webapi:postgres" "$webapiPostgresServerUrl"
    save_jupiter_url "$instance" "api" "$apiServerUrl"
    save_jupiter_url "$instance" "webui" "$webuiServerUrl"
    save_jupiter_url "$instance" "docs" "$docsServerUrl"
    save_jupiter_url "$instance" "mcp" "$mcpServerUrl"

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi:srv "$webapiServerUrl"
        wait_for_service_to_start api "$apiServerUrl"
        wait_for_service_to_start webui "$webuiServerUrl"
        # Skip docs in wait:all — MkDocs is slow; matrix/itest callers do not need it up first.
        wait_for_service_to_start mcp "$mcpServerUrl"
    fi

    if [[ ${should_wait} == "wait:webapi:srv" ]]; then
        wait_for_service_to_start webapi:srv "$webapiServerUrl"
    fi

    if [[ ${should_wait} == "wait:api" ]]; then
        wait_for_service_to_start api "$apiServerUrl"
    fi

    if [[ ${should_wait} == "wait:webui" ]]; then
        wait_for_service_to_start webui "$webuiServerUrl"
    fi

    if [[ ${should_wait} == "wait:docs" ]]; then
        wait_for_service_to_start docs "$docsServerUrl"
    fi

    if [[ ${should_wait} == "wait:mcp" ]]; then
        wait_for_service_to_start mcp "$mcpServerUrl"
    fi

    if [[ ${should_monit} == "monit" ]]; then
        npx pm2 monit
    fi
}

# Dummy values satisfy ${VAR:?...} in infra/self-hosted/compose.yaml. Compose still
# interpolates the full file on `down`, which may run after _run_dev_jupiter_webapp_with_docker
# locals/exports are gone.
_jupiter_dev_docker_compose_down() {
    UNIVERSE=compose-teardown \
        INSTANCE=compose-teardown \
        AUTH_TOKEN_SECRET=compose-teardown \
        SESSION_COOKIE_SECRET=compose-teardown \
        DOMAIN=localhost \
        docker compose -f infra/self-hosted/compose.yaml down
}

_run_dev_jupiter_webapp_with_docker() {
    local instance=$1
    export UNIVERSE=$UNIVERSE
    export ENV=$ENV
    export INSTANCE=$instance
    export DOMAIN=localhost
    export WEBAPI_PORT=$2
    export WEBAPI_SERVER_URL=http://localhost:${WEBAPI_PORT}
    export WEBAPI_POSTGRES_PORT=$3
    export API_PORT=$4
    export API_SERVER_URL=http://localhost:${API_PORT}
    export WEBUI_PORT=$5
    export WEBUI_SERVER_URL=https://localhost:${WEBUI_PORT}
    export DOCS_PORT=$6
    export DOCS_SERVER_URL=http://localhost:${DOCS_PORT}
    export PUBLIC_NAME
    export DOCS_AUTHOR=$AUTHOR
    export DOCS_COPYRIGHT=$COPYRIGHT
    export MCP_PORT=$7
    export MCP_SERVER_URL=http://localhost:${MCP_PORT}
    local should_wait=$8
    local should_monit=$9
    shift 9
    local in_ci=$1
    local source=$2
    local version=$3
    local clear_first=$4
    local webapi_storage_engine=$5
    local webapi_telemetry=$6
    local webapi_search=$7
    local webapi_crm=$8
    local webapi_auth_provider=$9
    local webapi_email_sender=${10}
    local webapi_email_verification_strategy=${11}
    webapi_storage_engine=${webapi_storage_engine:-${WEBAPI_STORAGE_ENGINE:-sqlite}}
    webapi_telemetry=${webapi_telemetry:-${TELEMETRY:-local}}
    webapi_search=${webapi_search:-${WEBAPI_SEARCH:-sql}}
    webapi_crm=${webapi_crm:-${CRM:-noop}}
    webapi_auth_provider=${webapi_auth_provider:-${AUTH_PROVIDER:-local}}
    webapi_email_sender=${webapi_email_sender:-${WEBAPI_EMAIL_SENDER:-noop}}
    local email_verification_strategy=${webapi_email_verification_strategy:-${EMAIL_VERIFICATION_STRATEGY:-none}}
    export TELEMETRY="$webapi_telemetry"
    export WEBAPI_SEARCH="$webapi_search"
    export CRM="$webapi_crm"
    export AUTH_PROVIDER="$webapi_auth_provider"
    export EMAIL_VERIFICATION_STRATEGY="$email_verification_strategy"
    export WEBAPI_EMAIL_SENDER="$webapi_email_sender"
    export WEBAPI_STORAGE_ENGINE="$webapi_storage_engine"
    export WEBAPI_CRON_EXECUTION_MODE="$WEBAPI_CRON_EXECUTION_MODE_LOCAL"

    unset COMPOSE_PROFILES 2>/dev/null || true
    if [[ "$webapi_storage_engine" == "postgres" ]]; then
        export COMPOSE_PROFILES=storage-engine-postgres
        # WebAPI always opens PostgresConnection + SqliteConnection; use compose service DNS name (not "postgres").
        POSTGRES_DB_URL=$(jupiter_postgres_async_sqlalchemy_url "$COMPOSE_POSTGRES_SERVICE_HOST" "5432" "$DEV_POSTGRES_USER" "$DEV_POSTGRES_PASSWORD" "$DEV_POSTGRES_DB")
        export POSTGRES_DB_URL
        export ALEMBIC_INI_PATH="../../core/migrations/alembic.postgres.ini"
        export ALEMBIC_MIGRATIONS_PATH="../../core/migrations/postgres"
        # Unused for domain data when storage is postgres, but must be a parseable URL (see jupiter.webapi.jupiter).
        export SQLITE_DB_URL="sqlite+aiosqlite:////data/jupiter.sqlite"
    else
        POSTGRES_DB_URL=$(jupiter_postgres_async_placeholder_sqlalchemy_url "$DEV_POSTGRES_USER" "$DEV_POSTGRES_PASSWORD")
        export POSTGRES_DB_URL
        export ALEMBIC_INI_PATH="../../core/migrations/alembic.sqlite.ini"
        export ALEMBIC_MIGRATIONS_PATH="../../core/migrations/sqlite"
        export SQLITE_DB_URL="sqlite+aiosqlite:////data/jupiter.sqlite"
    fi

    export WEBAPI_POSTGRES_SERVER_URL
    WEBAPI_POSTGRES_SERVER_URL=$(jupiter_postgres_psql_url "$DEV_POSTGRES_HOST" "$WEBAPI_POSTGRES_PORT" "$DEV_POSTGRES_USER" "$DEV_POSTGRES_PASSWORD" "$DEV_POSTGRES_DB")

    AUTH_TOKEN_SECRET=$(openssl rand -hex 32)
    export AUTH_TOKEN_SECRET
    SESSION_COOKIE_SECRET=$(openssl rand -hex 32)
    export SESSION_COOKIE_SECRET

    export DOCKER_IMAGE_WEBAPI
    DOCKER_IMAGE_WEBAPI=$(get_jupiter_image "webapi-srv" "$source" "$version" arm64)
    export DOCKER_IMAGE_API
    DOCKER_IMAGE_API=$(get_jupiter_image "api" "$source" "$version" arm64)
    export DOCKER_IMAGE_WEBUI
    DOCKER_IMAGE_WEBUI=$(get_jupiter_image "webui" "$source" "$version" arm64)
    export DOCKER_IMAGE_DOCS
    DOCKER_IMAGE_DOCS=$(get_jupiter_image "docs" "$source" "$version" arm64)
    export DOCKER_IMAGE_MCP
    DOCKER_IMAGE_MCP=$(get_jupiter_image "mcp" "$source" "$version" arm64)
    jupiter_export_webapi_cron_docker_images "$source" "$version" arm64

    FULLCHAIN_PEM=$(pwd)/$RUN_ROOT/$instance/fullchain.pem
    export FULLCHAIN_PEM
    PRIVKEY_PEM=$(pwd)/$RUN_ROOT/$instance/privkey.pem
    export PRIVKEY_PEM

    if [[ "$clear_first" == "true" ]]; then
        clear_jupiter_database "$instance"
    fi

    create_jupiter_database "$instance"

    write_jupiter_run_webapi_env "$instance" "$webapi_storage_engine" "$DEV_POSTGRES_HOST" "$WEBAPI_POSTGRES_PORT" "$DEV_POSTGRES_USER" "$DEV_POSTGRES_PASSWORD" "$DEV_POSTGRES_DB"

    log info "Running docker images: $DOCKER_IMAGE_WEBAPI, $DOCKER_IMAGE_API, $DOCKER_IMAGE_WEBUI, $DOCKER_IMAGE_DOCS, $DOCKER_IMAGE_MCP, and ${#WEBAPI_CRON_FOLDERS[@]} webapi cron images"

    openssl req -x509 \
        -nodes \
        -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout "$PRIVKEY_PEM" \
        -out "$FULLCHAIN_PEM"

    trap '_jupiter_dev_docker_compose_down || true' EXIT

    save_jupiter_url "$instance" "webapi:srv" "$WEBAPI_SERVER_URL"
    save_jupiter_url "$instance" "webapi:postgres" "$WEBAPI_POSTGRES_SERVER_URL"
    save_jupiter_url "$instance" "api" "$API_SERVER_URL"
    save_jupiter_url "$instance" "webui" "$WEBUI_SERVER_URL"
    save_jupiter_url "$instance" "docs" "$DOCS_SERVER_URL"
    save_jupiter_url "$instance" "mcp" "$MCP_SERVER_URL"

    log info "Starting Jupiter with docker compose: infra/self-hosted/compose.yaml"

    docker compose -f infra/self-hosted/compose.yaml up -d

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi:srv "$WEBAPI_SERVER_URL"
        wait_for_service_to_start api "$API_SERVER_URL"
        wait_for_service_to_start webui "$WEBUI_SERVER_URL"
        # Skip docs in wait:all — MkDocs is slow; matrix/itest callers do not need it up first.
        wait_for_service_to_start mcp "$MCP_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:webapi:srv" ]]; then
        wait_for_service_to_start webapi:srv "$WEBAPI_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:api" ]]; then
        wait_for_service_to_start api "$API_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:webui" ]]; then
        wait_for_service_to_start webui "$WEBUI_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:docs" ]]; then
        wait_for_service_to_start docs "$DOCS_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:mcp" ]]; then
        wait_for_service_to_start mcp "$MCP_SERVER_URL"
    fi

    if [[ ${should_monit} == "monit" ]]; then
        docker compose -f infra/self-hosted/compose.yaml logs -f
    fi
}

# local / registry / reuse (reuse: thrive-sh-test only — keep images already on the VM).
jupiter_validate_docker_source_for_universe() {
    local universe=$1
    local source=$2

    case "$source" in
        local | registry)
            return 0
            ;;
        reuse)
            if [[ "$universe" != "$THRIVE_SH_TEST_UNIVERSE" ]]; then
                log error "Docker source 'reuse' is only supported for universe ${THRIVE_SH_TEST_UNIVERSE} (got universe=${universe})"
                exit 1
            fi
            ;;
        *)
            log error "Unknown docker source: ${source} (expected local, registry, or reuse)"
            exit 1
            ;;
    esac
}

_thrive_sh_test_scp_self_hosted_files() {
    local gcp_vm_name=$1

    gcloud compute scp infra/self-hosted/compose.yaml "$gcp_vm_name":~/compose.yaml \
        --project "$THRIVE_GCP_PROJECT" \
        --zone "$THRIVE_GCP_ZONE"
    gcloud compute scp infra/self-hosted/nginx.conf "$gcp_vm_name":~/nginx.conf \
        --project "$THRIVE_GCP_PROJECT" \
        --zone "$THRIVE_GCP_ZONE"
    gcloud compute scp infra/self-hosted/webui.conf "$gcp_vm_name":~/webui.conf \
        --project "$THRIVE_GCP_PROJECT" \
        --zone "$THRIVE_GCP_ZONE"
    gcloud compute scp infra/self-hosted/webui.nodomain.conf "$gcp_vm_name":~/webui.nodomain.conf \
        --project "$THRIVE_GCP_PROJECT" \
        --zone "$THRIVE_GCP_ZONE"
}

# Bash fragment (for thrive-sh-test VM ssh): append default jupiter/* DOCKER_IMAGE_* lines to .env.
_thrive_sh_test_default_docker_image_env_append_ssh() {
    local version=$1
    local platform=${2:-arm64}
    local folder cron_env_var cron_image

    cat <<EOF
                echo "DOCKER_IMAGE_WEBAPI=jupiter/webapi-srv:${version}-${platform}" >> .env &&
                echo "DOCKER_IMAGE_API=jupiter/api:${version}-${platform}" >> .env &&
                echo "DOCKER_IMAGE_WEBUI=jupiter/webui:${version}-${platform}" >> .env &&
                echo "DOCKER_IMAGE_DOCS=jupiter/docs:${version}-${platform}" >> .env &&
                echo "DOCKER_IMAGE_MCP=jupiter/mcp:${version}-${platform}" >> .env &&
EOF
    for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
        cron_env_var=$(jupiter_webapi_cron_docker_env_var "$folder")
        cron_image="jupiter/$(jupiter_webapi_cron_image_name "$folder"):${version}-${platform}"
        echo "                echo \"${cron_env_var}=${cron_image}\" >> .env &&"
    done
}

# thrive-sh-test VM: sudo does not load ~/.env — pass --env-file explicitly.
# Use ~ (not $HOME): gcloud --command double-quotes expand local $HOME and break remote paths.
# shellcheck disable=SC2016
_THRIVE_SH_TEST_REMOTE_COMPOSE_ESC='sudo docker compose --project-directory . --env-file .env'
# shellcheck disable=SC2016
_THRIVE_SH_TEST_REMOTE_COMPOSE_DOWN_ESC='cd ~ && if [[ -f .env ]]; then sudo docker compose --project-directory . --env-file .env down || true; fi'

# Append Postgres-in-compose env to a thrive-sh-test VM ~/.env (profile storage-engine-postgres).
_thrive_sh_test_append_compose_postgres_env() {
    local gcp_vm_name=$1
    local pg_url inner
    pg_url=$(jupiter_postgres_async_sqlalchemy_url "$COMPOSE_POSTGRES_SERVICE_HOST" "5432" "$DEV_POSTGRES_USER" "$DEV_POSTGRES_PASSWORD" "$DEV_POSTGRES_DB")
    inner="echo COMPOSE_PROFILES=storage-engine-postgres >> ~/.env && echo POSTGRES_DB_URL=$(printf '%q' "$pg_url") >> ~/.env && echo ALEMBIC_INI_PATH=../../core/migrations/alembic.postgres.ini >> ~/.env && echo ALEMBIC_MIGRATIONS_PATH=../../core/migrations/postgres >> ~/.env"
    gcloud compute ssh "$gcp_vm_name" \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT" \
        --command "bash -lc $(printf '%q' "$inner")"
}

_thrive_sh_test_remote_compose_down() {
    local gcp_vm_name=$1
    if [[ -z "$gcp_vm_name" ]]; then
        return 0
    fi
    log info "Stopping remote docker compose on $gcp_vm_name"
    # gcloud compute ssh "$gcp_vm_name" \
    #     --zone "$THRIVE_GCP_ZONE" \
    #     --project "$THRIVE_GCP_PROJECT" \
    #     --command "${_THRIVE_SH_TEST_REMOTE_COMPOSE_DOWN_ESC} && rm -f .env" \
    #     || true
}

_thrive_sh_test_log_remote_env() {
    local gcp_vm_name=$1
    local env_contents

    # shellcheck disable=SC2016
    env_contents=$(gcloud compute ssh "$gcp_vm_name" \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT" \
        --command 'if [[ -f ~/.env ]]; then cat ~/.env; else echo "(no .env file)"; fi' \
        --quiet 2>/dev/null) || env_contents="(failed to read remote .env)"

    log info "Remote .env on ${gcp_vm_name} before docker compose up:"
    printf '%s\n' "$env_contents"
}

_thrive_sh_test_prepare_exit_cleanup() {
    local folder
    rm -f webapi.tar api.tar webui.tar docs.tar mcp.tar 2>/dev/null || true
    for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
        rm -f "$(jupiter_webapi_cron_tar_name "$folder")" 2>/dev/null || true
    done
    if [[ -n "${_THRIVE_SH_TEST_CLEANUP_VM_NAME:-}" ]]; then
        _thrive_sh_test_remote_compose_down "$_THRIVE_SH_TEST_CLEANUP_VM_NAME"
        unset _THRIVE_SH_TEST_CLEANUP_VM_NAME
    fi
}

_run_thrive_sh_test_webapp() {
    unset _THRIVE_SH_TEST_CLEANUP_VM_NAME 2>/dev/null || true

    local instance=$1
    local WEBAPI_PORT=$2
    local WEBAPI_POSTGRES_PORT=$3
    local API_PORT=$4
    local WEBUI_PORT=$5
    local DOCS_PORT=$6
    local MCP_PORT=$7
    local should_wait=$8
    local should_monit=$9
    shift 9
    local in_ci=$1
    local source=$2
    local version=$3
    local clear_first=$4
    local webapi_storage_engine=$5
    local webapi_telemetry=$6
    local webapi_search=$7
    local webapi_crm=$8
    local webapi_auth_provider=$9
    local webapi_email_sender=${10}
    local webapi_email_verification_strategy=${11}
    webapi_storage_engine=${webapi_storage_engine:-${WEBAPI_STORAGE_ENGINE:-sqlite}}
    webapi_telemetry=${webapi_telemetry:-${TELEMETRY:-local}}
    webapi_search=${webapi_search:-${WEBAPI_SEARCH:-sql}}
    webapi_crm=${webapi_crm:-${CRM:-noop}}
    webapi_auth_provider=${webapi_auth_provider:-${AUTH_PROVIDER:-local}}
    webapi_email_sender=${webapi_email_sender:-${WEBAPI_EMAIL_SENDER:-noop}}
    local email_verification_strategy=${webapi_email_verification_strategy:-${EMAIL_VERIFICATION_STRATEGY:-none}}
    export AUTH_PROVIDER="$webapi_auth_provider"
    export EMAIL_VERIFICATION_STRATEGY="$email_verification_strategy"
    export WEBAPI_EMAIL_SENDER="$webapi_email_sender"

    local gcp_vm_name="thrive-sh-test-${instance}"

    if [[ "$clear_first" == "true" ]]; then
        log info "Deleting GCP VM: $gcp_vm_name"
        gcloud compute instances delete "$gcp_vm_name" \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE" \
            --quiet
    fi

    log info "Creating GCP VM: $gcp_vm_name"
    if ! gcloud compute instances describe "$gcp_vm_name"    \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT" >/dev/null 2>&1
    then
        log info "GCP VM does not exist, creating it"
        gcloud compute instances create "$gcp_vm_name" \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE" \
            --machine-type "c4a-standard-2" \
            --image-family ubuntu-2204-lts-arm64 \
            --image-project ubuntu-os-cloud \
            --boot-disk-size 42GB \
            --metadata-from-file startup-script=tasks/_resources/_test-machine-shutdown-after-4hrs.sh \
            --labels "purpose=testing" \
            --tags http-server \
            --tags https-server

        log info "Waiting for GCP VM to be ready..."
        until gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --command "true" \
            --quiet >/dev/null 2>&1
        do
            log info "GCP VM not ready, waiting..."
            sleep 5
        done

        log info "Preparing $gcp_vm_name"
        gcloud compute scp ./tasks/_resources/_test-machine-startup.sh "$gcp_vm_name":~/startup-script.sh \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE"
        gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --command "chmod +x ~/startup-script.sh && sudo ~/startup-script.sh"
    fi

    log info "Checking if GCP VM is running"
    if [[ "$(gcloud compute instances describe "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --format='get(status)')" != "RUNNING" ]];
    then
      log info "GCP VM is not running, starting it"
      gcloud compute instances start "$gcp_vm_name" \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT"
    fi

    gcp_ip=$(gcloud compute instances describe "$gcp_vm_name" \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT" \
        --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

    log info "VM external IP: $gcp_ip"

    local gcp_dns_name="${instance}${THRIVE_SH_TEST_DOMAIN}"
    local webapi_server_url="http://${gcp_dns_name}:${WEBAPI_TESTING_PORT}"

    existing_ips=$(gcloud dns record-sets list \
        --zone="$THRIVE_SH_TEST_DNS_ZONE" \
        --project="$THRIVE_GCP_PROJECT" \
        --name="$gcp_dns_name" \
        --format="value(rrdatas)" \
        --type=A || true)

    gcloud dns record-sets transaction abort --zone="$THRIVE_SH_TEST_DNS_ZONE" --project="$THRIVE_GCP_PROJECT" || true
    gcloud dns record-sets transaction start --zone="$THRIVE_SH_TEST_DNS_ZONE" --project="$THRIVE_GCP_PROJECT"

    if [[ -n "$existing_ips" ]]; then
        log info "Removing existing DNS record for $gcp_dns_name"
        gcloud dns record-sets transaction remove \
            --zone="$THRIVE_SH_TEST_DNS_ZONE" \
            --project="$THRIVE_GCP_PROJECT" \
            --name="$gcp_dns_name" \
            --type=A \
            --ttl="60" \
            "$existing_ips"
    fi

    gcloud dns record-sets transaction add \
        --zone="$THRIVE_SH_TEST_DNS_ZONE" \
        --project="$THRIVE_GCP_PROJECT" \
        --name="$gcp_dns_name" \
        --type=A \
        --ttl="60" \
        "$gcp_ip"

    gcloud dns record-sets transaction execute --zone="$THRIVE_SH_TEST_DNS_ZONE" --project="$THRIVE_GCP_PROJECT"

    log info "Waiting for DNS record to be propagated"
    until dig +short "$gcp_dns_name" | grep -q "$gcp_ip"; do
        log info "DNS record not propagated, waiting..."
        sleep 5
    done

    log info "DNS record propagated"

    if [[ "$source" == "registry" ]]; then
        local gh_prefix
        if [[ "$version" == "latest" ]]; then
            gh_prefix="https://github.com/get-thriving/thrive/releases/latest/download"
        else
            gh_prefix="https://github.com/get-thriving/thrive/releases/download/v${version}"
        fi

        log info "Preparing Thrive on $gcp_vm_name from registry"
        gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --ssh-flag="-tt" \
            --command "bash -c '
                (${_THRIVE_SH_TEST_REMOTE_COMPOSE_DOWN_ESC}) &&
                rm -f .env &&
                rm -rf compose.yaml &&
                rm -rf nginx.conf &&
                rm -rf webui.conf &&
                rm -rf webui.nodomain.conf &&
                wget $gh_prefix/compose.yaml &&
                wget $gh_prefix/nginx.conf &&
                wget $gh_prefix/webui.conf &&
                wget $gh_prefix/webui.nodomain.conf &&
                touch .env &&
                echo \"PUBLIC_NAME=Horia Thrive\" >> .env &&
                echo \"VERSION=$version\" >> .env &&
                echo \"UNIVERSE=$THRIVE_SH_TEST_UNIVERSE\" >> .env &&
                echo \"ENV=staging\" >> .env &&
                echo \"INSTANCE=$instance\" >> .env &&
                echo \"DOMAIN=$gcp_dns_name\" >> .env &&
                echo \"AUTH_TOKEN_SECRET=\$(openssl rand -base64 32)\" >> .env &&
                echo \"SESSION_COOKIE_SECRET=\$(openssl rand -base64 32)\" >> .env &&
                echo \"WEBAPI_SERVER_URL=${webapi_server_url}\" >> .env &&
                echo \"WEBAPI_PORT=${WEBAPI_TESTING_PORT}\" >> .env &&
                echo \"WEBAPI_STORAGE_ENGINE=${webapi_storage_engine}\" >> .env &&
                echo \"AUTH_PROVIDER=${webapi_auth_provider}\" >> .env &&
                echo \"EMAIL_VERIFICATION_STRATEGY=${EMAIL_VERIFICATION_STRATEGY:-none}\" >> .env &&
                echo \"TELEMETRY=${webapi_telemetry}\" >> .env &&
                echo \"WEBAPI_SEARCH=${webapi_search}\" >> .env &&
                echo \"CRM=${webapi_crm}\" >> .env &&
                echo \"WEBAPI_EMAIL_SENDER=${webapi_email_sender}\" >> .env &&
                echo \"POSTGRES_VERSION=${POSTGRES_VERSION}\" >> .env &&
                echo \"WEBAPI_CRON_EXECUTION_MODE=${WEBAPI_CRON_EXECUTION_MODE_LOCAL}\" >> .env &&
                (sudo certbot certonly --standalone -d $gcp_dns_name --agree-tos --email test@thrive-test.xyz --non-interactive)
            '"
    elif [[ "$source" == "reuse" ]]; then
        log info "Preparing Thrive on $gcp_vm_name (reusing Docker images already on the VM)"

        _thrive_sh_test_scp_self_hosted_files "$gcp_vm_name"

        gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --ssh-flag="-tt" \
            --command "bash -c '
                saved_docker_images=\$(grep -h \"^DOCKER_IMAGE_\" .env 2>/dev/null || true) &&
                (${_THRIVE_SH_TEST_REMOTE_COMPOSE_DOWN_ESC}) &&
                rm -f .env &&
                touch .env &&
                echo \"PUBLIC_NAME=Horia Thrive\" >> .env &&
                echo \"VERSION=$version\" >> .env &&
                echo \"UNIVERSE=$THRIVE_SH_TEST_UNIVERSE\" >> .env &&
                echo \"ENV=staging\" >> .env &&
                echo \"INSTANCE=$instance\" >> .env &&
                echo \"DOMAIN=$gcp_dns_name\" >> .env &&
                echo \"AUTH_TOKEN_SECRET=\$(openssl rand -base64 32)\" >> .env &&
                echo \"WEBAPI_SERVER_URL=${webapi_server_url}\" >> .env &&
                echo \"SESSION_COOKIE_SECRET=\$(openssl rand -base64 32)\" >> .env &&
                echo \"WEBAPI_PORT=${WEBAPI_TESTING_PORT}\" >> .env &&
                echo \"WEBAPI_STORAGE_ENGINE=${webapi_storage_engine}\" >> .env &&
                echo \"WEBAPI_TELEMETRY=${webapi_telemetry}\" >> .env &&
                echo \"WEBAPI_SEARCH=${webapi_search}\" >> .env &&
                echo \"WEBAPI_CRM=${webapi_crm}\" >> .env &&
                echo \"WEBAPI_EMAIL_SENDER=${webapi_email_sender}\" >> .env &&
                echo \"POSTGRES_VERSION=${POSTGRES_VERSION}\" >> .env &&
                echo \"WEBAPI_CRON_EXECUTION_MODE=${WEBAPI_CRON_EXECUTION_MODE_LOCAL}\" >> .env &&
                if [[ -n \"\$saved_docker_images\" ]]; then
                    printf \"%s\\n\" \"\$saved_docker_images\" >> .env
                else
$(_thrive_sh_test_default_docker_image_env_append_ssh "$version" arm64 | sed 's/^/                    /')
                    true
                fi &&
                (sudo certbot certonly --standalone -d $gcp_dns_name --agree-tos --email test@thrive-test.xyz --non-interactive)
            '"
    elif [[ "$source" == "local" ]]; then
        log info "Preparing Thrive on $gcp_vm_name from local"

        local folder cron_tar cron_image
        docker save -o webapi.tar "jupiter/webapi-srv:${version}-arm64"
        docker save -o api.tar "jupiter/api:${version}-arm64"
        docker save -o webui.tar "jupiter/webui:${version}-arm64"
        docker save -o docs.tar "jupiter/docs:${version}-arm64"
        docker save -o mcp.tar "jupiter/mcp:${version}-arm64"
        for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
            cron_tar=$(jupiter_webapi_cron_tar_name "$folder")
            cron_image="jupiter/$(jupiter_webapi_cron_image_name "$folder"):${version}-arm64"
            docker save -o "$cron_tar" "$cron_image"
        done

        gcloud compute scp webapi.tar "$gcp_vm_name":~/webapi.tar \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE"
        gcloud compute scp api.tar "$gcp_vm_name":~/api.tar \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE"
        gcloud compute scp webui.tar "$gcp_vm_name":~/webui.tar \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE"
        gcloud compute scp docs.tar "$gcp_vm_name":~/docs.tar \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE"
        gcloud compute scp mcp.tar "$gcp_vm_name":~/mcp.tar \
            --project "$THRIVE_GCP_PROJECT" \
            --zone "$THRIVE_GCP_ZONE"
        for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
            cron_tar=$(jupiter_webapi_cron_tar_name "$folder")
            gcloud compute scp "$cron_tar" "$gcp_vm_name:~/$cron_tar" \
                --project "$THRIVE_GCP_PROJECT" \
                --zone "$THRIVE_GCP_ZONE"
        done

        _thrive_sh_test_scp_self_hosted_files "$gcp_vm_name"

        gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --ssh-flag="-tt" \
            --command "bash -c '
                (${_THRIVE_SH_TEST_REMOTE_COMPOSE_DOWN_ESC}) &&
                rm -f .env &&
                sudo docker load -i webapi.tar &&
                sudo docker load -i api.tar &&
                sudo docker load -i webui.tar &&
                sudo docker load -i docs.tar &&
                sudo docker load -i mcp.tar &&
                $(for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
                    echo "sudo docker load -i $(jupiter_webapi_cron_tar_name "$folder") &&"
                done)
                touch .env &&
                echo \"PUBLIC_NAME=Horia Thrive\" >> .env &&
                echo \"VERSION=$version\" >> .env &&
                echo \"UNIVERSE=$THRIVE_SH_TEST_UNIVERSE\" >> .env &&
                echo \"ENV=staging\" >> .env &&
                echo \"INSTANCE=$instance\" >> .env &&
                echo \"DOMAIN=$gcp_dns_name\" >> .env &&
                echo \"AUTH_TOKEN_SECRET=\$(openssl rand -base64 32)\" >> .env &&
                echo \"WEBAPI_SERVER_URL=${webapi_server_url}\" >> .env &&
                echo \"SESSION_COOKIE_SECRET=\$(openssl rand -base64 32)\" >> .env &&
                echo \"WEBAPI_PORT=${WEBAPI_TESTING_PORT}\" >> .env &&
                echo \"WEBAPI_STORAGE_ENGINE=${webapi_storage_engine}\" >> .env &&
                echo \"AUTH_PROVIDER=${webapi_auth_provider}\" >> .env &&
                echo \"EMAIL_VERIFICATION_STRATEGY=${EMAIL_VERIFICATION_STRATEGY:-none}\" >> .env &&
                echo \"TELEMETRY=${webapi_telemetry}\" >> .env &&
                echo \"WEBAPI_SEARCH=${webapi_search}\" >> .env &&
                echo \"CRM=${webapi_crm}\" >> .env &&
                echo \"WEBAPI_EMAIL_SENDER=${webapi_email_sender}\" >> .env &&
                echo \"POSTGRES_VERSION=${POSTGRES_VERSION}\" >> .env &&
                echo \"WEBAPI_CRON_EXECUTION_MODE=${WEBAPI_CRON_EXECUTION_MODE_LOCAL}\" >> .env &&
                echo \"DOCKER_IMAGE_WEBAPI=jupiter/webapi:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_API=jupiter/api:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_WEBUI=jupiter/webui:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_DOCS=jupiter/docs:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_MCP=jupiter/mcp:${version}-arm64\" >> .env &&
                $(for folder in "${WEBAPI_CRON_FOLDERS[@]}"; do
                    cron_env_var=$(jupiter_webapi_cron_docker_env_var "$folder")
                    cron_image="jupiter/$(jupiter_webapi_cron_image_name "$folder"):${version}-arm64"
                    echo "echo ${cron_env_var}=${cron_image} >> .env &&"
                done)
                (sudo certbot certonly --standalone -d $gcp_dns_name --agree-tos --email test@thrive-test.xyz --non-interactive)
            '"
    else
        log error "Unknown docker source for ${THRIVE_SH_TEST_UNIVERSE}: $source"
        exit 1
    fi

    if [[ "$webapi_storage_engine" == "postgres" ]]; then
        _thrive_sh_test_append_compose_postgres_env "$gcp_vm_name"
    fi

    _THRIVE_SH_TEST_CLEANUP_VM_NAME=$gcp_vm_name
    trap "_thrive_sh_test_prepare_exit_cleanup" EXIT

    log info "Starting Thrive on $gcp_vm_name"
    _thrive_sh_test_log_remote_env "$gcp_vm_name"
    # shellcheck disable=SC2016
    gcloud compute ssh "$gcp_vm_name" \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT" \
        --command "cd ~ && ${_THRIVE_SH_TEST_REMOTE_COMPOSE_ESC} up -d"

    local thrive_host="${instance}${THRIVE_SH_TEST_DOMAIN}"
    local thrive_webui_url="https://${thrive_host}"
    local thrive_webapi_url="http://${thrive_host}:${WEBAPI_TESTING_PORT}"
    local thrive_api_url="https://${thrive_host}/api"
    local thrive_docs_url="https://${thrive_host}/docs"
    local thrive_mcp_url="https://${thrive_host}/mcp"

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi:srv "$thrive_webapi_url"
        wait_for_service_to_start api "$thrive_api_url"
        wait_for_service_to_start webui "$thrive_webui_url"
        # Skip docs in wait:all — MkDocs is slow; matrix/itest callers do not need it up first.
        wait_for_service_to_start mcp "$thrive_mcp_url"
    fi

    if [[ ${should_wait} == "wait:webapi:srv" ]]; then
        wait_for_service_to_start webapi:srv "$thrive_webapi_url"
    fi

    if [[ ${should_wait} == "wait:api" ]]; then
        wait_for_service_to_start api "$thrive_api_url"
    fi

    if [[ ${should_wait} == "wait:webui" ]]; then
        wait_for_service_to_start webui "$thrive_webui_url"
    fi

    if [[ ${should_wait} == "wait:docs" ]]; then
        wait_for_service_to_start docs "$thrive_docs_url"
    fi

    if [[ ${should_wait} == "wait:mcp" ]]; then
        wait_for_service_to_start mcp "$thrive_mcp_url"
    fi

    if [[ "$should_monit" == "monit" ]]; then
        gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --command "cd ~ && ${_THRIVE_SH_TEST_REMOTE_COMPOSE_ESC} logs -f"
    fi
}

stop_jupiter_webapp() {
    local service=$1

    log info "Stopping Jupiter with service: $service"

    npx pm2 delete "$RUN_ROOT/$service/pm2.config.js"
}

save_jupiter_url() {
    local instance=$1
    local service=$2
    local url=$3

    echo "$url" > "$RUN_ROOT/$instance/$service.url"
}

# Writes ADR 0008 WEBAPI_* blend keys plus Postgres connection parts (no URLs).
# Args: instance, WEBAPI_STORAGE_ENGINE, PG host, port, user, password, database name.
write_jupiter_run_webapi_env() {
    local instance=$1
    local storage_engine=$2
    local pg_host=$3
    local pg_port=$4
    local pg_user=$5
    local pg_password=$6
    local pg_db=$7
    local out="$RUN_ROOT/$instance/webapi.env"

    mkdir -p "$RUN_ROOT/$instance"
    {
        printf '%s\n' "# Jupiter WebAPI run environment (instance: ${instance}). Generated by dev run tooling."
        printf '%s=%q\n' WEBAPI_STORAGE_ENGINE "$storage_engine"
        printf '%s=%q\n' AUTH_PROVIDER "${AUTH_PROVIDER:-local}"
        printf '%s=%q\n' EMAIL_VERIFICATION_STRATEGY "${EMAIL_VERIFICATION_STRATEGY:-none}"
        printf '%s=%q\n' TELEMETRY "${TELEMETRY:-local}"
        printf '%s=%q\n' WEBAPI_SEARCH "${WEBAPI_SEARCH:-sql}"
        printf '%s=%q\n' CRM "${CRM:-noop}"
        printf '%s=%q\n' WEBAPI_EMAIL_SENDER "${WEBAPI_EMAIL_SENDER:-noop}"
        printf '%s=%q\n' POSTGRES_HOST "$pg_host"
        printf '%s=%q\n' POSTGRES_PORT "$pg_port"
        printf '%s=%q\n' POSTGRES_USER "$pg_user"
        printf '%s=%q\n' POSTGRES_PASSWORD "$pg_password"
        printf '%s=%q\n' POSTGRES_DB "$pg_db"
    } > "$out"
    chmod 600 "$out"
    log info "Wrote WebAPI run env: $out"
}

get_dev_service_url() {
    local instance=$1
    local service=$2

    if ! [[ -f "$RUN_ROOT/$instance/$service.url" ]]; then
        log error "Jupiter URL not found for instance: $instance and service: $service"
        exit 1
    fi

    cat "$RUN_ROOT/$instance/$service.url"
}

get_thrive_sh_test_webui_url() {
    local instance=$1
    echo "https://${instance}${THRIVE_SH_TEST_DOMAIN}"
}

get_thrive_production_webui_url() {
    echo $HOSTED_GLOBAL_WEBUI_URL
}

get_thrive_staging_webui_url() {
    local instance=$1
    echo "https://jupiter-webui-${instance}.${GLOBAL_HOSTED_INFRA_ROOT}"
}

get_webui_url_for_universe() {
    local universe=$1
    local environment=$2
    local instance=$3

    if [[ "$universe" == "dev" ]]; then
        if [[ "$environment" != "local" ]]; then
            log error "Environment $environment is not supported for dev universe"
            exit 1
        fi
        get_dev_service_url "$instance" "webui"
        return 0
    elif [[ "$universe" == "thrive-sh-test" ]]; then
        if [[ "$environment" != "staging" ]]; then
            log error "Environment $environment is not supported for thrive-sh-test universe"
            exit 1
        fi
        get_thrive_sh_test_webui_url "$instance"
        return 0
    elif [[ "$universe" == "thrive" ]]; then
        if [[ "$environment" == "production" ]]; then
            get_thrive_production_webui_url 
            return 0
        elif [[ "$environment" == "staging" ]]; then
            get_thrive_staging_webui_url "$instance"
            return 0
        else
            log error "Environment $environment is not supported for thrive universe"
            exit 1
        fi
    elif [[ "$universe" =~ ^https?:// ]]; then
        if [[ "$environment" != "production" ]]; then
            log error "Environment $environment is not supported for custom universe"
            exit 1
        fi
        echo "$universe"
        return 0
    else
        log info "Unknown universe: $universe"
        exit 1
    fi
}

get_thrive_sh_test_webapi_url() {
    local instance=$1
    echo "http://${instance}${THRIVE_SH_TEST_DOMAIN}:${WEBAPI_TESTING_PORT}"
}

get_thrive_production_webapi_url() {
    echo "$HOSTED_GLOBAL_WEBAPI_URL"
}

get_thrive_staging_webapi_url() {
    local instance=$1
    echo "https://jupiter-webapi-srv-${instance}.${GLOBAL_HOSTED_INFRA_ROOT}"
}

get_webapi_url_for_universe() {
    local universe=$1
    local environment=$2
    local instance=$3

    if [[ "$universe" == "dev" ]]; then
        if [[ "$environment" != "local" ]]; then
            log error "Environment $environment is not supported for dev universe"
            exit 1
        fi
        get_dev_service_url "$instance" "webapi:srv"
        return 0
    elif [[ "$universe" == "thrive-sh-test" ]]; then
        if [[ "$environment" != "staging" ]]; then
            log error "Environment $environment is not supported for thrive-sh-test universe"
            exit 1
        fi
        get_thrive_sh_test_webapi_url "$instance"
        return 0
    elif [[ "$universe" == "thrive" ]]; then
        if [[ "$environment" == "production" ]]; then
            get_thrive_production_webapi_url
            return 0
        elif [[ "$environment" == "staging" ]]; then
            get_thrive_staging_webapi_url "$instance"
            return 0
        else
            log error "Environment $environment is not supported for thrive universe"
            exit 1
        fi
    elif [[ "$universe" =~ ^https?:// ]]; then
        if [[ "$environment" != "production" ]]; then
            log error "Environment $environment is not supported for custom universe"
            exit 1
        fi
        echo "$universe"
        return 0
    else
        log info "Unknown universe: $universe"
        exit 1
    fi
}

get_thrive_sh_test_api_url() {
    local instance=$1
    echo "https://${instance}${THRIVE_SH_TEST_DOMAIN}/api"
}

get_thrive_production_api_url() {
    echo "$HOSTED_GLOBAL_API_URL"
}

get_thrive_staging_api_url() {
    local instance=$1
    echo "https://jupiter-api-${instance}.${GLOBAL_HOSTED_INFRA_ROOT}"
}

get_api_url_for_universe() {
    local universe=$1
    local environment=$2
    local instance=$3

    if [[ "$universe" == "dev" ]]; then
        if [[ "$environment" != "local" ]]; then
            log error "Environment $environment is not supported for dev universe"
            exit 1
        fi
        get_dev_service_url "$instance" "api"
        return 0
    elif [[ "$universe" == "thrive-sh-test" ]]; then
        if [[ "$environment" != "staging" ]]; then
            log error "Environment $environment is not supported for thrive-sh-test universe"
            exit 1
        fi
        get_thrive_sh_test_api_url "$instance"
        return 0
    elif [[ "$universe" == "thrive" ]]; then
        if [[ "$environment" == "production" ]]; then
            get_thrive_production_api_url
            return 0
        elif [[ "$environment" == "staging" ]]; then
            get_thrive_staging_api_url "$instance"
            return 0
        else
            log error "Environment $environment is not supported for thrive universe"
            exit 1
        fi
    elif [[ "$universe" =~ ^https?:// ]]; then
        if [[ "$environment" != "production" ]]; then
            log error "Environment $environment is not supported for custom universe"
            exit 1
        fi
        echo "$universe"
        return 0
    else
        log info "Unknown universe: $universe"
        exit 1
    fi
}

get_thrive_sh_test_mcp_url() {
    local instance=$1
    echo "https://${instance}${THRIVE_SH_TEST_DOMAIN}/mcp"
}

get_thrive_production_mcp_url() {
    echo "$HOSTED_GLOBAL_MCP_URL"
}

get_thrive_staging_mcp_url() {
    local instance=$1
    echo "https://jupiter-mcp-${instance}.${GLOBAL_HOSTED_INFRA_ROOT}"
}

get_mcp_url_for_universe() {
    local universe=$1
    local environment=$2
    local instance=$3

    if [[ "$universe" == "dev" ]]; then
        if [[ "$environment" != "local" ]]; then
            log error "Environment $environment is not supported for dev universe"
            exit 1
        fi
        get_dev_service_url "$instance" "mcp"
        return 0
    elif [[ "$universe" == "thrive-sh-test" ]]; then
        if [[ "$environment" != "staging" ]]; then
            log error "Environment $environment is not supported for thrive-sh-test universe"
            exit 1
        fi
        get_thrive_sh_test_mcp_url "$instance"
        return 0
    elif [[ "$universe" == "thrive" ]]; then
        if [[ "$environment" == "production" ]]; then
            get_thrive_production_mcp_url
            return 0
        elif [[ "$environment" == "staging" ]]; then
            get_thrive_staging_mcp_url "$instance"
            return 0
        else
            log error "Environment $environment is not supported for thrive universe"
            exit 1
        fi
    elif [[ "$universe" =~ ^https?:// ]]; then
        if [[ "$environment" != "production" ]]; then
            log error "Environment $environment is not supported for custom universe"
            exit 1
        fi
        echo "$universe"
        return 0
    else
        log info "Unknown universe: $universe"
        exit 1
    fi
}

get_instance() {
    uvx codename -s '-'
}

get_free_port() {
    local port=
    while
        port=$((RANDOM % 16384 + 49152))
        netstat -atun | grep -q "$port"
    do
        continue
    done

    echo "$port"
}

wait_for_service_to_start() {
    local service=$1
    local url=${2/0.0.0.0/localhost}/healthz

    local attempts=0
    local max_attempts=60  # increased: 60s total

    log info "Waiting for ${service} at ${url} (max ${max_attempts}s)..."

    while [ "$attempts" -lt "$max_attempts" ]; do
        set +e
        http --ignore-stdin --follow --timeout 5 --verify=no --check-status get "${url}" > /dev/null 2>&1
        local resp=$?
        set -e

        if [ "$resp" -eq 0 ]; then
            log info "${service} is up after $((attempts + 1))s."
            return 0
        fi

        attempts=$((attempts + 1))
        log debug "Waiting for ${service}. Attempt ${attempts}/${max_attempts}..."
        sleep 1
    done

    log error "Timed out waiting for ${service} at ${url} after ${max_attempts}s."
    return 1
}

check_service_is_running() {
    local mode=$1
    local instance=$2
    local service=$3
    
    if [[ "$mode" == "docker" ]]; then
        log info "Docker mode not supported for service status check"
        exit 1
    elif [[ "$mode" == "pm2" ]]; then
        if npx pm2 ps | grep -q "$instance:$service"; then
            return 0
        else
            return 1
        fi
    else
        log info "Unknown mode: $mode"
        exit 1
    fi
}

get_logs() {
    local mode=$1
    local instance=$2
    local service=$3
    
    if [[ "$mode" == "docker" ]]; then
        log info "Docker mode not supported for log retrieval"
        exit 1
    elif [[ "$mode" == "pm2" ]]; then
        tail -n 100 "$RUN_ROOT/$instance/webapi.log"
    else
        log info "Unknown mode: $mode"
        exit 1
    fi
}

get_jupiter_image() {
    local service=$1
    local source=$2
    local version=$3
    local platform=$4

    if [[ "$source" == "local" || "$source" == "reuse" ]]; then
        echo "jupiter/${service}:${version}-${platform}"
    elif [[ "$source" == "registry" ]]; then
        echo "${DOCKER_REGISTRY_NAME}/jupiter-${service}:${version}-${platform}"
    else
        log error "Unknown source: $source"
        return 1
    fi
}

run_jupiter_cli() {
    local instance=$1
    local argsString=$2
    local sessionInfoPath=../../$RUN_ROOT/$instance/session-info
    local sqliteDbUrl
    local _sqlite_abs
    _sqlite_abs=$(jupiter_sqlite_database_path_abs "$instance")
    sqliteDbUrl="sqlite+aiosqlite:////${_sqlite_abs#/}"

    mkdir -p "$RUN_ROOT/$instance"

    log info "Running Jupiter CLI with instance: ${instance} on ${sqliteDbUrl} with '${argsString}'"

    export SESSION_INFO_PATH=${sessionInfoPath}
    export SQLITE_DB_URL=${sqliteDbUrl} 

    cd src/cli
    # MISE passes all jupiter args as a single string, so we need to eval it to properly parse quotes
    eval "python -m jupiter.cli.jupiter ${argsString}"
}

create_jupiter_database() {
    local instance=$1

    log info "Creating Jupiter database for instance: ${instance}"
    
    mkdir -p "$RUN_ROOT/$instance"
    mkdir -p "$RUN_ROOT/$instance/pgdata"
}

clear_jupiter_database() {
    local instance=$1

    log info "Clearing Jupiter database for instance: ${instance}"
    rm -rf "${RUN_ROOT:?}/$instance"
}