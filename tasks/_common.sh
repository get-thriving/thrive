#!/bin/bash

source src/Config.global

export RUN_ROOT=.build-cache/run
export STANDARD_INSTANCE=dev
export STANDARD_UNIVERSE=local-dev
export STANDARD_WEBAPI_PORT=8004
export STANDARD_WEBUI_PORT=10020
export STANDARD_DOCS_PORT=8000

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
        echo "[$level] $*"
    fi
}

run_jupiter_webapp() {
    local UNIVERSE=$1
    local INSTANCE=$2
    local WEBAPI_PORT=$3
    local WEBUI_PORT=$4
    local DOCS_PORT=$5
    local should_wait=$6
    local should_monit=$7
    local in_ci=$9
    local source=$9
    shift 9
    local version=$1
    local mode=$2

    mkdir -p "$RUN_ROOT/$INSTANCE"

    log info "Running Jupiter WebApi in universe: $UNIVERSE, instance: $INSTANCE, webapi port: $WEBAPI_PORT, webui port: $WEBUI_PORT, docs port: $DOCS_PORT, source: $source, version: $version, mode: $mode"

    if [[ "$UNIVERSE" == "dev" ]]; then
        if [[ "$mode" == "pm2" ]]; then
            _run_dev_jupiter_webapp_with_pm2 "$INSTANCE" "$WEBAPI_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version"
        else
            _run_dev_jupiter_webapp_with_docker "$INSTANCE" "$WEBAPI_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version"
        fi
    elif [[ "$UNIVERSE" == "thrive-sh-test" ]]; then
        _run_thrive_sh_test_webapp "$INSTANCE" "$WEBAPI_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$should_wait" "$should_monit" "$in_ci" "$version"
        exit 1
    else
        log error "Unknown universe: $UNIVERSE"
        exit 1
    fi
}

_run_dev_jupiter_webapp_with_pm2() {
    local instance=$1
    local webapiLogFile=../../$RUN_ROOT/$instance/webapi.log
    local webapiSqliteDbUrl=sqlite+aiosqlite:///../../$RUN_ROOT/$instance/jupiter.sqlite
    local webapiPort=$2
    local webapiServerUrl=http://0.0.0.0:${webapiPort}
    local webuiLogFile=../../$RUN_ROOT/$instance/webui.log
    local webuiPort=$3
    local webuiServerUrl=http://0.0.0.0:${webuiPort}
    local docsLogFile=../../$RUN_ROOT/$instance/docs.log
    local docsPort=$4
    local docsServerUrl=http://0.0.0.0:${docsPort}
    local docsPublicName=$PUBLIC_NAME
    local docsAuthor=$AUTHOR
    local docsCopyright=$COPYRIGHT
    local should_wait=$5
    local should_monit=$6
    local in_ci=$7
    local source=$8
    local version=$9

    # If source is not local, or version is not local, then we exit
    if [[ "$source" != "local" ]] || [[ "$version" != "latest" ]]; then
        log error "Source or version is not local, exiting"
        exit 1
    fi
    
    # here!
    if [[ "$in_ci" == "dev" ]]; then
        data=$(jo instance="$instance" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webapiServerUrl="$webapiServerUrl" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webuiServerUrl="$webuiServerUrl" docsLogFile="$docsLogFile" docsPort="$docsPort" docsServerUrl="$docsServerUrl" docsPublicName="$docsPublicName" docsAuthor="$docsAuthor" docsCopyright="$docsCopyright")
        node tasks/_resources/render-hbs.mjs tasks/_resources/pm2.config.dev.js.hbs "$data" > "$RUN_ROOT/$INSTANCE/pm2.config.js"
    else
        data=$(jo instance="$instance" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webapiServerUrl="$webapiServerUrl" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webuiServerUrl="$webuiServerUrl" docsLogFile="$docsLogFile" docsPort="$docsPort" docsServerUrl="$docsServerUrl" docsPublicName="$docsPublicName" docsAuthor="$docsAuthor" docsCopyright="$docsCopyright")
        node tasks/_resources/render-hbs.mjs tasks/_resources/pm2.config.ci.js.hbs "$data" > "$RUN_ROOT/$INSTANCE/pm2.config.js"
    fi

    # shellcheck disable=SC2064
    trap "npx pm2 delete '$RUN_ROOT/$instance/pm2.config.js'" EXIT
    log info "Starting Jupiter with pm2 config: $RUN_ROOT/$instance/pm2.config.js"
    npx pm2 --no-color start "$RUN_ROOT/$instance/pm2.config.js"

    save_jupiter_url "$instance" "webapi" "$webapiServerUrl"
    save_jupiter_url "$instance" "webui" "$webuiServerUrl"
    save_jupiter_url "$instance" "docs" "$docsServerUrl"

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi "$webapiServerUrl"
        wait_for_service_to_start webui "$webuiServerUrl"
        wait_for_service_to_start docs "$docsServerUrl"
    fi

    if [[ ${should_wait} == "wait:webapi" ]]; then
        wait_for_service_to_start webapi "$webapiServerUrl"
    fi 

    if [[ ${should_wait} == "wait:webui" ]]; then
        wait_for_service_to_start webui "$webuiServerUrl"
    fi

    if [[ ${should_wait} == "wait:docs" ]]; then
        wait_for_service_to_start docs "$docsServerUrl"
    fi

    if [[ ${should_monit} == "monit" ]]; then
        npx pm2 monit
    fi
}

_run_dev_jupiter_webapp_with_docker() {
    local instance=$1
    export UNIVERSE=$UNIVERSE
    export ENV=$ENV
    export INSTANCE=$instance
    export DOMAIN=localhost
    export WEBAPI_PORT=$2
    export WEBUI_PORT=$3
    export WEBAPI_SERVER_URL=http://0.0.0.0:${WEBAPI_PORT}
    export WEBUI_SERVER_URL=https://0.0.0.0:${WEBUI_PORT}
    export DOCS_PORT=$4
    export DOCS_SERVER_URL=http://0.0.0.0:${DOCS_PORT}
    export PUBLIC_NAME
    export DOCS_AUTHOR=$AUTHOR
    export DOCS_COPYRIGHT=$COPYRIGHT
    local should_wait=$5
    local should_monit=$6
    local in_ci=$7
    local source=$8
    local version=$9

    AUTH_TOKEN_SECRET=$(openssl rand -hex 32)
    export AUTH_TOKEN_SECRET
    SESSION_COOKIE_SECRET=$(openssl rand -hex 32)
    export SESSION_COOKIE_SECRET

    export DOCKER_IMAGE_WEBAPI
    DOCKER_IMAGE_WEBAPI=$(get_jupiter_image "webapi" "$source" "$version" arm64)
    export DOCKER_IMAGE_WEBUI
    DOCKER_IMAGE_WEBUI=$(get_jupiter_image "webui" "$source" "$version" arm64)
    export DOCKER_IMAGE_DOCS
    DOCKER_IMAGE_DOCS=$(get_jupiter_image "docs" "$source" "$version" arm64)

    FULLCHAIN_PEM=$(pwd)/$RUN_ROOT/$instance/fullchain.pem
    export FULLCHAIN_PEM
    PRIVKEY_PEM=$(pwd)/$RUN_ROOT/$instance/privkey.pem
    export PRIVKEY_PEM

    log info "Running docker images: $DOCKER_IMAGE_WEBAPI, $DOCKER_IMAGE_WEBUI, $DOCKER_IMAGE_DOCS"

    openssl req -x509 \
        -nodes \
        -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout "$PRIVKEY_PEM" \
        -out "$FULLCHAIN_PEM"

    trap "docker compose -f infra/self-hosted/compose.yaml down" EXIT

    save_jupiter_url "$instance" "webapi" "$WEBAPI_SERVER_URL"
    save_jupiter_url "$instance" "webui" "$WEBUI_SERVER_URL"
    save_jupiter_url "$instance" "docs" "$DOCS_SERVER_URL"

    log info "Starting Jupiter with docker compose: infra/self-hosted/compose.yaml"

    docker compose -f infra/self-hosted/compose.yaml up -d

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi "$WEBAPI_SERVER_URL"
        wait_for_service_to_start webui "$WEBUI_SERVER_URL"
        wait_for_service_to_start docs "$DOCS_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:webapi" ]]; then
        wait_for_service_to_start webapi "$WEBAPI_SERVER_URL"
    fi 

    if [[ ${should_wait} == "wait:webui" ]]; then
        wait_for_service_to_start webui "$WEBUI_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:docs" ]]; then
        wait_for_service_to_start docs "$DOCS_SERVER_URL"
    fi

    if [[ ${should_monit} == "monit" ]]; then
        docker compose -f infra/self-hosted/compose.yaml logs -f
    fi
}

_run_thrive_sh_test_webapp() {
    local instance=$1
    local webapi_port=$2
    local webui_port=$3
    local docs_port=$4
    local should_wait=$5
    local should_monit=$6
    local in_ci=$7
    local version=$8
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

get_jupiter_url() {
    local instance=$1
    local service=$2

    if ! [[ -f "$RUN_ROOT/$instance/$service.url" ]]; then
        echo "N/A"
        return 0
    fi

    cat "$RUN_ROOT/$instance/$service.url"
}

get_instance() {
    uvx codename -s '-'
}

get_free_port() {
    local port=
    while
        port=$(jot -r 1 49152 65535)
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
    local max_attempts=21

    log info "Waiting for ${service}. Attempt $attempts of $max_attempts."

    while [ "$attempts" -lt "$max_attempts" ]; do
        set +e
        http --follow --timeout 10 --verify=no --check-status get "${url}" > /dev/null 2>&1
        resp=$?
        set -e
        
        if [ "$resp" -eq 0 ]; then
            log info "${service} is up and responding."
            break
        else
            log info "Waiting for ${service}. Attempt $((attempts+1)) of $max_attempts."
        fi
        
        attempts=$((attempts + 1))
        sleep 1  # Adjust the sleep time as needed
    done

    if [ "$attempts" -eq "$max_attempts" ]; then
        log info "Reached maximum attempts for ${service}."
        return 1
    fi
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

    if [[ "$source" == "local" ]]; then
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
    local sqliteDbUrl=sqlite+aiosqlite:///../../$RUN_ROOT/$instance/jupiter.sqlite

    mkdir -p "$RUN_ROOT/$instance"

    log info "Running Jupiter CLI with instance: ${instance} on ${sqliteDbUrl} with '${argsString}'"

    export SESSION_INFO_PATH=${sessionInfoPath}
    export SQLITE_DB_URL=${sqliteDbUrl} 

    cd src/cli
    # MISE passes all jupiter args as a single string, so we need to eval it to properly parse quotes
    eval "python -m jupiter.cli.jupiter ${argsString}"
}