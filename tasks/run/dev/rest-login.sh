#!/usr/bin/env bash

#MISE description="Login to the webapi for raw API calls"
#USAGE arg "[userEmailAddress]" help="The user email address"
#USAGE arg "[password]" help="The user password"
#USAGE flag "--environ <environ>" help="Jupiter environ"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"
: "${usage_user_email_address:=}"
: "${usage_password:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

log info "Logging in to $environ webapi"

webapi_port=$(get_jupiter_port "$environ" webapi)
webapi_url="http://0.0.0.0:${webapi_port}"

access_token=$(http --form POST "$webapi_url/simple-login" username="$usage_user_email_address" password="$usage_password" | jq .access_token)

echo "$access_token" > "${RUN_ROOT}/$environ/rest_access_token"

restish api configure jupiter "$webapi_url"
