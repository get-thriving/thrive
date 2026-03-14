#!/bin/bash

source src/Config.global
source infra/Config.infra
source secrets/Config.secrets

export THRIVE_SH_TEST_UNIVERSE=thrive-sh-test
export THRIVE_SH_TEST_DNS_ZONE=thrive-sh-test
export THRIVE_SH_TEST_DOMAIN=.thrive-test.xyz
export THRIVE_GCP_PROJECT=thrive-449010
export THRIVE_GCP_ZONE=europe-west1-c
export RUN_ROOT=.build-cache/run
export STANDARD_INSTANCE=dev
export STANDARD_UNIVERSE=dev
export STANDARD_WEBAPI_PORT=8004
export STANDARD_API_PORT=8020
export STANDARD_MCP_PORT=8030
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
        echo "[$level] $*" >&2
    fi
}

run_jupiter_webapp() {
    local UNIVERSE=$1
    local INSTANCE=$2
    local WEBAPI_PORT=$3
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
    local mode=$4
    local clear_first=$5

    mkdir -p "$RUN_ROOT/$INSTANCE"

    log info "Running Jupiter WebApi in universe: $UNIVERSE, instance: $INSTANCE, webapi port: $WEBAPI_PORT, api port: $API_PORT, webui port: $WEBUI_PORT, docs port: $DOCS_PORT, mcp port: $MCP_PORT, source: $source, version: $version, mode: $mode"

    if [[ "$UNIVERSE" == "dev" ]]; then
        if [[ "$mode" == "pm2" ]]; then
            _run_dev_jupiter_webapp_with_pm2 "$INSTANCE" "$WEBAPI_PORT" "$API_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$MCP_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version" "$clear_first"
        else
            _run_dev_jupiter_webapp_with_docker "$INSTANCE" "$WEBAPI_PORT" "$API_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$MCP_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version" "$clear_first"
        fi
    elif [[ "$UNIVERSE" == "thrive-sh-test" ]]; then
        _run_thrive_sh_test_webapp "$INSTANCE" "$WEBAPI_PORT" "$API_PORT" "$WEBUI_PORT" "$DOCS_PORT" "$MCP_PORT" "$should_wait" "$should_monit" "$in_ci" "$source" "$version" "$clear_first"
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
    local webapiServerUrl=http://localhost:${webapiPort}
    local webuiLogFile=../../$RUN_ROOT/$instance/webui.log
    local apiPort=$3
    local apiServerUrl=http://localhost:${apiPort}
    local apiLogFile=../../$RUN_ROOT/$instance/api.log
    local webuiPort=$4
    local webuiServerUrl=http://localhost:${webuiPort}
    local docsLogFile=../../$RUN_ROOT/$instance/docs.log
    local docsPort=$5
    local docsServerUrl=http://localhost:${docsPort}
    local docsPublicName=$PUBLIC_NAME
    local docsAuthor=$AUTHOR
    local docsCopyright=$COPYRIGHT
    local mcpPort=$6
    local mcpServerUrl=http://localhost:${mcpPort}
    local mcpLogFile=../../$RUN_ROOT/$instance/mcp.log
    local should_wait=$7
    local should_monit=$8
    local in_ci=$9
    shift 9
    local source=$1
    local version=$2
    local clear_first=$3

    # If source is not local, or version is not local, then we exit
    if [[ "$source" != "local" ]] || [[ "$version" != "latest" ]]; then
        log error "Source or version is not local, exiting"
        exit 1
    fi

    if [[ "$clear_first" == "true" ]]; then
        clear_jupiter_database "$instance"
    fi

    create_jupiter_database "$instance"
    
    # here!
    if [[ "$in_ci" == "dev" ]]; then
        data=$(jo instance="$instance" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webapiServerUrl="$webapiServerUrl" apiLogFile="$apiLogFile" apiPort="$apiPort" apiServerUrl="$apiServerUrl" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webuiServerUrl="$webuiServerUrl" docsLogFile="$docsLogFile" docsPort="$docsPort" docsServerUrl="$docsServerUrl" docsPublicName="$docsPublicName" docsAuthor="$docsAuthor" docsCopyright="$docsCopyright" mcpLogFile="$mcpLogFile" mcpPort="$mcpPort" mcpServerUrl="$mcpServerUrl")
        node tasks/_resources/render-hbs.mjs tasks/_resources/pm2.config.dev.js.hbs "$data" > "$RUN_ROOT/$INSTANCE/pm2.config.js"
    else
        data=$(jo instance="$instance" webapiLogFile="$webapiLogFile" webapiSqliteDbUrl="$webapiSqliteDbUrl" webapiPort="$webapiPort" webapiServerUrl="$webapiServerUrl" apiLogFile="$apiLogFile" apiPort="$apiPort" apiServerUrl="$apiServerUrl" webuiLogFile="$webuiLogFile" webuiPort="$webuiPort" webuiServerUrl="$webuiServerUrl" docsLogFile="$docsLogFile" docsPort="$docsPort" docsServerUrl="$docsServerUrl" docsPublicName="$docsPublicName" docsAuthor="$docsAuthor" docsCopyright="$docsCopyright" mcpLogFile="$mcpLogFile" mcpPort="$mcpPort" mcpServerUrl="$mcpServerUrl")
        node tasks/_resources/render-hbs.mjs tasks/_resources/pm2.config.ci.js.hbs "$data" > "$RUN_ROOT/$INSTANCE/pm2.config.js"
    fi

    # shellcheck disable=SC2064
    trap "npx pm2 delete '$RUN_ROOT/$instance/pm2.config.js'" EXIT
    log info "Starting Jupiter with pm2 config: $RUN_ROOT/$instance/pm2.config.js"
    npx pm2 --no-color start "$RUN_ROOT/$instance/pm2.config.js"

    save_jupiter_url "$instance" "webapi" "$webapiServerUrl"
    save_jupiter_url "$instance" "api" "$apiServerUrl"
    save_jupiter_url "$instance" "webui" "$webuiServerUrl"
    save_jupiter_url "$instance" "docs" "$docsServerUrl"
    save_jupiter_url "$instance" "mcp" "$mcpServerUrl"

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi "$webapiServerUrl"
        wait_for_service_to_start api "$apiServerUrl"
        wait_for_service_to_start webui "$webuiServerUrl"
        wait_for_service_to_start docs "$docsServerUrl"
        wait_for_service_to_start mcp "$mcpServerUrl"
    fi

    if [[ ${should_wait} == "wait:webapi" ]]; then
        wait_for_service_to_start webapi "$webapiServerUrl"
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

_run_dev_jupiter_webapp_with_docker() {
    local instance=$1
    export UNIVERSE=$UNIVERSE
    export ENV=$ENV
    export INSTANCE=$instance
    export DOMAIN=localhost
    export WEBAPI_PORT=$2
    export WEBAPI_SERVER_URL=http://localhost:${WEBAPI_PORT}
    export API_PORT=$3
    export API_SERVER_URL=http://localhost:${API_PORT}
    export WEBUI_PORT=$4
    export WEBUI_SERVER_URL=https://localhost:${WEBUI_PORT}
    export DOCS_PORT=$5
    export DOCS_SERVER_URL=http://localhost:${DOCS_PORT}
    export PUBLIC_NAME
    export DOCS_AUTHOR=$AUTHOR
    export DOCS_COPYRIGHT=$COPYRIGHT
    export MCP_PORT=$6
    export MCP_SERVER_URL=http://localhost:${MCP_PORT}
    local should_wait=$7
    local should_monit=$8
    local in_ci=$9
    shift 9
    local source=$1
    local version=$2
    local clear_first=$3

    AUTH_TOKEN_SECRET=$(openssl rand -hex 32)
    export AUTH_TOKEN_SECRET
    SESSION_COOKIE_SECRET=$(openssl rand -hex 32)
    export SESSION_COOKIE_SECRET

    export DOCKER_IMAGE_WEBAPI
    DOCKER_IMAGE_WEBAPI=$(get_jupiter_image "webapi" "$source" "$version" arm64)
    export DOCKER_IMAGE_API
    DOCKER_IMAGE_API=$(get_jupiter_image "api" "$source" "$version" arm64)
    export DOCKER_IMAGE_WEBUI
    DOCKER_IMAGE_WEBUI=$(get_jupiter_image "webui" "$source" "$version" arm64)
    export DOCKER_IMAGE_DOCS
    DOCKER_IMAGE_DOCS=$(get_jupiter_image "docs" "$source" "$version" arm64)
    export DOCKER_IMAGE_MCP
    DOCKER_IMAGE_MCP=$(get_jupiter_image "mcp" "$source" "$version" arm64)

    FULLCHAIN_PEM=$(pwd)/$RUN_ROOT/$instance/fullchain.pem
    export FULLCHAIN_PEM
    PRIVKEY_PEM=$(pwd)/$RUN_ROOT/$instance/privkey.pem
    export PRIVKEY_PEM

    if [[ "$clear_first" == "true" ]]; then
        clear_jupiter_database "$instance"
    fi

    create_jupiter_database "$instance"

    log info "Running docker images: $DOCKER_IMAGE_WEBAPI, $DOCKER_IMAGE_API, $DOCKER_IMAGE_WEBUI, $DOCKER_IMAGE_DOCS"

    openssl req -x509 \
        -nodes \
        -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout "$PRIVKEY_PEM" \
        -out "$FULLCHAIN_PEM"

    trap "docker compose -f infra/self-hosted/compose.yaml down" EXIT

    save_jupiter_url "$instance" "webapi" "$WEBAPI_SERVER_URL"
    save_jupiter_url "$instance" "api" "$API_SERVER_URL"
    save_jupiter_url "$instance" "webui" "$WEBUI_SERVER_URL"
    save_jupiter_url "$instance" "docs" "$DOCS_SERVER_URL"
    save_jupiter_url "$instance" "mcp" "$MCP_SERVER_URL"

    log info "Starting Jupiter with docker compose: infra/self-hosted/compose.yaml"

    docker compose -f infra/self-hosted/compose.yaml up -d

    if [[ "$should_wait" == "wait:all" ]]; then
        wait_for_service_to_start webapi "$WEBAPI_SERVER_URL"
        wait_for_service_to_start api "$API_SERVER_URL"
        wait_for_service_to_start webui "$WEBUI_SERVER_URL"
        wait_for_service_to_start docs "$DOCS_SERVER_URL"
        wait_for_service_to_start mcp "$MCP_SERVER_URL"
    fi

    if [[ ${should_wait} == "wait:webapi" ]]; then
        wait_for_service_to_start webapi "$WEBAPI_SERVER_URL"
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

_run_thrive_sh_test_webapp() {
    local instance=$1
    local should_wait=$7
    local should_monit=$8
    local in_ci=$9
    shift 9
    local source=$1
    local version=$2
    local clear_first=$3

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
            gh_prefix="https://github.com/horia141/thrive/releases/latest/download"
        else
            gh_prefix="https://github.com/horia141/thrive/releases/download/v${version}"
        fi

        log info "Preparing Thrive on $gcp_vm_name from registry"
        gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --ssh-flag="-tt" \
            --command "bash -c '
                (sudo docker compose down || true) &&
                rm -rf compose.yaml &&
                rm -rf nginx.conf &&
                rm -rf webui.conf &&
                rm -rf webui.nodomain.conf &&
                rm -rf .env &&
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
                (sudo certbot certonly --standalone -d $gcp_dns_name --agree-tos --email test@thrive-test.xyz --non-interactive)
            '"
    else
        log info "Preparing Thrive on $gcp_vm_name from local"

        trap "rm -f webapi.tar api.tar webui.tar docs.tar mcp.tar" EXIT

        docker save -o webapi.tar "jupiter/webapi:${version}-arm64"
        docker save -o api.tar "jupiter/api:${version}-arm64"
        docker save -o webui.tar "jupiter/webui:${version}-arm64"
        docker save -o docs.tar "jupiter/docs:${version}-arm64"
        docker save -o mcp.tar "jupiter/mcp:${version}-arm64"

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

        gcloud compute ssh "$gcp_vm_name" \
            --zone "$THRIVE_GCP_ZONE" \
            --project "$THRIVE_GCP_PROJECT" \
            --ssh-flag="-tt" \
            --command "bash -c '
                (sudo docker compose down || true) &&
                rm -rf .env &&
                sudo docker load -i webapi.tar &&
                sudo docker load -i api.tar &&
                sudo docker load -i webui.tar &&
                sudo docker load -i docs.tar &&
                sudo docker load -i mcp.tar &&
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
                echo \"DOCKER_IMAGE_WEBAPI=jupiter/webapi:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_API=jupiter/api:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_WEBUI=jupiter/webui:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_DOCS=jupiter/docs:${version}-arm64\" >> .env &&
                echo \"DOCKER_IMAGE_MCP=jupiter/mcp:${version}-arm64\" >> .env &&
                (sudo certbot certonly --standalone -d $gcp_dns_name --agree-tos --email test@thrive-test.xyz --non-interactive)
            '"
    fi

    log info "Starting Thrive on $gcp_vm_name"
    gcloud compute ssh "$gcp_vm_name" \
        --zone "$THRIVE_GCP_ZONE" \
        --project "$THRIVE_GCP_PROJECT" \
        --command "sudo docker compose up"
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
    echo "https://jupiter-webapi-${instance}.${GLOBAL_HOSTED_INFRA_ROOT}"
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
        get_dev_service_url "$instance" "webapi"
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

create_jupiter_database() {
    local instance=$1

    log info "Creating Jupiter database for instance: ${instance}"
    
    mkdir -p "$RUN_ROOT/$instance"
}

clear_jupiter_database() {
    local instance=$1

    log info "Clearing Jupiter database for instance: ${instance}"
    rm -rf "${RUN_ROOT:?}/$instance"
}