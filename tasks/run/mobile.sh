#!/usr/bin/env bash

#MISE description="Run mobile app on iOS or Android with optional environ"
#USAGE arg "<platform>" required help="Mobile platform (ios or android)" {
#USAGE   choices "ios" "android"
#USAGE }
#USAGE flag "--environ <environ>" help="Jupiter environ"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--universe <universe>" default="local-dev" help="Jupiter universe"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_platform:=}"
: "${usage_environ:=}"
: "${usage_universe:=local-dev}"

set -e -o pipefail

source tasks/_common.sh

platform="${usage_platform}"
environ="${usage_environ}"

if [[ -z "$environ" ]]; then
    environ=$STANDARD_ENVIRON
fi

webui_port=$(get_jupiter_port "$environ" "webui")
export HOSTED_GLOBAL_WEBUI_URL="http://localhost:$webui_port"
export BUILD_TARGET=$platform

log info "Running mobile app on $platform with environ $environ"

cd src/mobile
npx vite build
npx cap run "$platform"
