#!/usr/bin/env bash

#MISE description="Login to the webapi for raw API calls"
#USAGE arg "[userEmailAddress]" help="The user email address"
#USAGE arg "[password]" help="The user password"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_namespace:=}"
: "${usage_user_email_address:=}"
: "${usage_password:=}"

set -e -o pipefail

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

log info "Logging in to $namespace webapi"

webapi_port=$(get_jupiter_port "$namespace" webapi)
webapi_url="http://0.0.0.0:${webapi_port}"

access_token=$(http --form POST "$webapi_url/simple-login" username="$usage_user_email_address" password="$usage_password" | jq .access_token)

echo "$access_token" > "${RUN_ROOT}/$namespace/rest_access_token"

restish api configure jupiter "$webapi_url"
