#!/bin/bash

export RUN_ROOT=.build-cache/run
export STANDARD_NAMESPACE=dev
export STANDARD_WEBAPI_PORT=8004
export STANDARD_WEBUI_PORT=10020

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

run_jupiter_webapi() {
    local NAMESPACE=$1
    local WEBAPI_PORT=$2
    local WEBUI_PORT=$3
    local should_wait=$4
    local should_monit=$5
    local in_ci=$6
    local mode=$7

    export SCRIPT_ARGS=
    platform=$(uname -s | awk '{print tolower($0)}')
    if [[ "${platform}" == "darwin" ]]
    then
        SCRIPT_ARGS="-qF"
    else
        SCRIPT_ARGS="-c"
    fi

    mkdir -p "$RUN_ROOT/$NAMESPACE"

    log info "Running Jupiter WebApi with namespace: $NAMESPACE, webapi port: $WEBAPI_PORT, webui port: $WEBUI_PORT, mode: $mode"

    if [[ "$mode" == "pm2" ]]; then
        _run_jupiter_webapi_with_pm2 "$NAMESPACE" "$WEBAPI_PORT" "$WEBUI_PORT" "$should_wait" "$should_monit" "$in_ci"
    else
        _run_jupiter_webapi_with_docker "$NAMESPACE" "$WEBAPI_PORT" "$WEBUI_PORT" "$should_wait" "$should_monit" "$in_ci"
    fi
}

_run_jupiter_webapi_with_pm2() {
    local namespace=$1
    local webapiLogFile=../../$RUN_ROOT/$namespace/webapi.log
    local webapiSqliteDbUrl=sqlite+aiosqlite:///../../$RUN_ROOT/$namespace/jupiter.sqlite
    local webapiPort=$2
    local webapiServerUrl=http://0.0.0.0:${webapiPort}
    local webuiLogFile=../../$RUN_ROOT/$namespace/webui.log
    local webuiPort=$3
    local webuiServerUrl=http://0.0.0.0:${webuiPort}
    local should_wait=$4
    local should_monit=$5
    local in_ci=$6

    if [[ "$in_ci" == "dev" ]]; then
        data=$(jo namespace="$namespace" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webapiServerUrl="$webapiServerUrl" webuiServerUrl="$webuiServerUrl")
        npx hbs-cli --stdout -D "$data" tasks/_resources/pm2.config.dev.js.hbs > "$RUN_ROOT/$NAMESPACE/pm2.config.js"
    else
        data=$(jo namespace="$namespace" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webapiServerUrl="$webapiServerUrl" webuiServerUrl="$webuiServerUrl")
        npx hbs-cli --stdout -D "$data" tasks/_resources/pm2.config.ci.js.hbs > "$RUN_ROOT/$NAMESPACE/pm2.config.js"
    fi

    # shellcheck disable=SC2064
    trap "npx pm2 delete '$RUN_ROOT/$namespace/pm2.config.js'" EXIT
    log info "Starting Jupiter with pm2 config: $RUN_ROOT/$namespace/pm2.config.js"
    npx pm2 --no-color start "$RUN_ROOT/$namespace/pm2.config.js"

    echo "$webapiPort" > "$RUN_ROOT/$namespace/webapi.port"
    echo "$webuiPort" > "$RUN_ROOT/$namespace/webui.port"

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi "$webapiServerUrl"
        wait_for_service_to_start webui "$webuiServerUrl"
    fi

    if [[ ${should_wait} == "wait:webapi" ]]; then
        wait_for_service_to_start webapi "$webapiServerUrl"
    fi 

    if [[ ${should_wait} == "wait:webui" ]]; then
        wait_for_service_to_start webui "$webuiServerUrl"
    fi

    if [[ ${should_monit} == "monit" ]]; then
        npx pm2 monit
    fi
}

_run_jupiter_webapi_with_docker() {
    export NAMESPACE=$1
    export WEBAPI_PORT=$2
    export WEBUI_PORT=$3
    export WEBAPI_SERVER_URL=http://0.0.0.0:${WEBAPI_PORT}
    export WEBUI_SERVER_URL=https://0.0.0.0:${WEBUI_PORT}
    local should_wait=$4
    local should_monit=$5
    local in_ci=$6
    export NAME="My Hosting"
    AUTH_TOKEN_SECRET=$(openssl rand -hex 32)
    export AUTH_TOKEN_SECRET
    SESSION_COOKIE_SECRET=$(openssl rand -hex 32)
    export SESSION_COOKIE_SECRET

    FULLCHAIN_PEM=$(pwd)/$RUN_ROOT/$NAMESPACE/fullchain.pem
    export FULLCHAIN_PEM
    PRIVKEY_PEM=$(pwd)/$RUN_ROOT/$NAMESPACE/privkey.pem
    export PRIVKEY_PEM

    log info "Running Jupiter with docker config: $RUN_ROOT/$NAMESPACE/docker.config.yaml"

    openssl req -x509 \
        -nodes \
        -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout "$PRIVKEY_PEM" \
        -out "$FULLCHAIN_PEM"

    trap "docker compose -f infra/self-hosted/compose.yaml down" EXIT

    echo "$WEBAPI_PORT" > "$RUN_ROOT/$NAMESPACE/webapi.port"
    echo "$WEBUI_PORT" > "$RUN_ROOT/$NAMESPACE/webui.port"

    log info "Starting Jupiter with docker compose: infra/self-hosted/compose.yaml"

    docker compose -f infra/self-hosted/compose.yaml up -d

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi "$WEBAPI_SERVER_URL"
        wait_for_service_to_start webui "$WEBUI_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:webapi" ]]; then
        wait_for_service_to_start webapi "$WEBAPI_SERVER_URL"
    fi 

    if [[ ${should_wait} == "wait:webui" ]]; then
        wait_for_service_to_start webui "$WEBUI_SERVER_URL"
    fi

    if [[ ${should_monit} == "monit" ]]; then
        docker compose -f infra/self-hosted/compose.yaml logs -f
    fi
}

stop_jupiter_webapi() {
    local service=$1

    log info "Stopping Jupiter with service: $service"

    npx pm2 delete "$RUN_ROOT/$service/pm2.config.js"
}

get_jupiter_port() {
    local namespace=$1
    local service=$2

    if ! [[ -f "$RUN_ROOT/$namespace/$service.port" ]]; then
        log info "Port file not found for $service in $namespace namespace."
        exit 1
    fi

    cat "$RUN_ROOT/$namespace/$service.port"
}

get_namespace() {
    poetry run codename -s '-'
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
        http --verify=no --timeout 10 --check-status --quiet --quiet get "${url}"
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
    local namespace=$2
    local service=$3
    
    if [[ "$mode" == "docker" ]]; then
        log info "Docker mode not supported for service status check"
        exit 1
    elif [[ "$mode" == "pm2" ]]; then
        if npx pm2 ps | grep -q "$namespace:$service"; then
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
    local namespace=$2
    local service=$3
    
    if [[ "$mode" == "docker" ]]; then
        log info "Docker mode not supported for log retrieval"
        exit 1
    elif [[ "$mode" == "pm2" ]]; then
        tail -n 100 "$RUN_ROOT/$namespace/webapi.log"
    else
        log info "Unknown mode: $mode"
        exit 1
    fi
}

run_jupiter_cli() {
    local namespace=$1
    local sqliteDbUrl=sqlite+aiosqlite:///../../$RUN_ROOT/$namespace/jupiter.sqlite

    mkdir -p "$RUN_ROOT/$namespace"

    log info "Running Jupiter CLI with namespace: ${namespace} on ${sqliteDbUrl}"

    LOCAL_OR_SELF_HOSTED_WEBAPI_SERVER_URL=${sqliteDbUrl} cd src/cli && python -m jupiter.cli.jupiter
}