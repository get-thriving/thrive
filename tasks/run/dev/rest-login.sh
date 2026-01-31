#!/usr/bin/env bash

#MISE description="Login to the webapi for raw API calls"
#USAGE arg "[userEmailAddress]" help="The user email address"
#USAGE arg "[password]" help="The user password"
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"
: "${usage_user_email_address:=}"
: "${usage_password:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

log info "Logging in to $instance webapi"

webapi_url=$(get_dev_service_url "$instance" webapi)

access_token=$(http --form POST "$webapi_url/simple-login" username="$usage_user_email_address" password="$usage_password" | jq .access_token)

echo "$access_token" > "${RUN_ROOT}/$instance/rest_access_token"

restish api configure jupiter "$webapi_url"
