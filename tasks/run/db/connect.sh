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

    db_path="$RUN_ROOT/$instance/jupiter.sqlite"

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
elif [[ "$usage_universe" == "thrive" ]]; then
    if [[ "$usage_environment" != "production" ]]; then
        log error "Environment $usage_environment is not supported for thrive universe"
        exit 1
    fi

    log info "Connecting to Jupiter SQLite database on Render (thrive/production)"

    render ssh jupiter-webapi -- sqlite3 /data/jupiter.sqlite
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
