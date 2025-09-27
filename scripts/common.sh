#!/bin/bash

export RUN_ROOT=.build-cache/run
export STANDARD_NAMESPACE=dev
export STANDARD_WEBAPI_PORT=8004
export STANDARD_WEBUI_PORT=10020

original_x_status=$(set +o | grep xtrace)
set +x
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
eval "$original_x_status"

run_jupiter() {
    local NAMESPACE=$1
    local WEBAPI_PORT=$2
    local WEBUI_PORT=$3
    local should_wait=$4
    local should_monit=$5
    local in_ci=$6
    local mode=$7

    export local SCRIPT_ARGS=
    local platform=$(uname -s | awk '{print tolower($0)}')
    if [[ "${platform}" == "darwin" ]]
    then
        SCRIPT_ARGS="-qF"
    else
        SCRIPT_ARGS="-c"
    fi

    mkdir -p "$RUN_ROOT/$NAMESPACE"

    if [[ "$mode" == "pm2" ]]; then
        _run_jupiter_with_pm2 "$NAMESPACE" "$WEBAPI_PORT" "$WEBUI_PORT" "$should_wait" "$should_monit" "$in_ci"
    else
        _run_jupiter_with_docker "$NAMESPACE" "$WEBAPI_PORT" "$WEBUI_PORT" "$should_wait" "$should_monit" "$in_ci"
    fi
}

_run_jupiter_with_pm2() {
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
        npx hbs-cli --stdout -D "$data" scripts/pm2.config.dev.js.hbs > "$RUN_ROOT/$NAMESPACE/pm2.config.js"
    else
        data=$(jo namespace="$namespace" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webapiServerUrl="$webapiServerUrl" webuiServerUrl="$webuiServerUrl")
        npx hbs-cli --stdout -D "$data" scripts/pm2.config.ci.js.hbs > "$RUN_ROOT/$NAMESPACE/pm2.config.js"
    fi

    trap "npx pm2 delete $RUN_ROOT/$namespace/pm2.config.js" EXIT
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

_run_jupiter_with_docker() {
    export local NAMESPACE=$1
    export local WEBAPI_PORT=$2
    export local WEBUI_PORT=$3
    export local WEBAPI_SERVER_URL=http://0.0.0.0:${WEBAPI_PORT}
    export local WEBUI_SERVER_URL=https://0.0.0.0:${WEBUI_PORT}
    local should_wait=$4
    local should_monit=$5
    local in_ci=$6
    export local NAME="My Hosting"
    export local AUTH_TOKEN_SECRET=$(openssl rand -hex 32)
    export local SESSION_COOKIE_SECRET=$(openssl rand -hex 32)

    export local FULLCHAIN_PEM=$(pwd)/$RUN_ROOT/$NAMESPACE/fullchain.pem
    export local PRIVKEY_PEM=$(pwd)/$RUN_ROOT/$NAMESPACE/privkey.pem

    openssl req -x509 \
        -nodes \
        -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout $PRIVKEY_PEM \
        -out $FULLCHAIN_PEM

    trap "docker compose -f infra/self-hosted/compose.yaml down" EXIT

    echo "$WEBAPI_PORT" > "$RUN_ROOT/$NAMESPACE/webapi.port"
    echo "$WEBUI_PORT" > "$RUN_ROOT/$NAMESPACE/webui.port"

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

stop_jupiter() {
    local service=$1

    npx pm2 delete "$RUN_ROOT/$service/pm2.config.js"
}

get_jupiter_port() {
    local namespace=$1
    local service=$2

    if ! [[ -f "$RUN_ROOT/$namespace/$service.port" ]]; then
        echo "Port file not found for $service in $namespace namespace."
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

    while [ "$attempts" -lt "$max_attempts" ]; do
        set +e
        response=$(http --verify=no --timeout 10 --check-status get "${url}" 2>/dev/null)
        resp=$?
        set -e
        
        if [ "$resp" -eq 0 ]; then
            echo "${service} is up and responding."
            break
        else
            echo "Waiting for ${service}. Attempt $((attempts+1)) of $max_attempts."
        fi
        
        attempts=$(expr $attempts + 1)
        sleep 1  # Adjust the sleep time as needed
    done

    if [ "$attempts" -eq "$max_attempts" ]; then
        echo "Reached maximum attempts for ${service}."
        return 1
    fi
}

check_service_is_running() {
    local mode=$1
    local namespace=$2
    local service=$3
    
    if [[ "$mode" == "docker" ]]; then
        echo "Docker mode not supported for service status check"
        exit 1
    elif [[ "$mode" == "pm2" ]]; then
        if npx pm2 ps | grep -q "$namespace:$service"; then
            return 0
        else
            return 1
        fi
    else
        echo "Unknown mode: $mode"
        exit 1
    fi
}

get_logs() {
    local mode=$1
    local namespace=$2
    local service=$3
    
    if [[ "$mode" == "docker" ]]; then
        echo "Docker mode not supported for log retrieval"
        exit 1
    elif [[ "$mode" == "pm2" ]]; then
        webapi_log_file=$RUN_ROOT/$namespace/webapi.log
        cat "$webapi_log_file" | tail -n 100
    else
        echo "Unknown mode: $mode"
        exit 1
    fi
}
