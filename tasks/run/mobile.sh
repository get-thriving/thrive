#!/usr/bin/env bash

#MISE description="Run mobile app on iOS or Android with optional instance"
#USAGE arg "<platform>" required help="Mobile platform (ios or android)" {
#USAGE   choices "ios" "android"
#USAGE }
#USAGE flag "--instance <instance>" help="Jupiter instance"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--universe <universe>" default="local-dev" help="Jupiter universe"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_platform:=}"
: "${usage_instance:=}"
: "${usage_universe:=local-dev}"

set -e -o pipefail

source tasks/_common.sh

platform="${usage_platform}"
instance="${usage_instance}"

if [[ -z "$instance" ]]; then
    instance=$STANDARD_INSTANCE
fi

webui_url=$(get_jupiter_url "$instance" "webui")
export HOSTED_GLOBAL_WEBUI_URL="$webui_url"
export BUILD_TARGET=$platform

log info "Running mobile app on $platform with instance $instance"

cd src/mobile
npx vite build
npx cap run "$platform"
