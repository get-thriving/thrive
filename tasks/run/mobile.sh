#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Run mobile app on iOS or Android with optional namespace"
#USAGE arg "<platform>" required help="Mobile platform (ios or android)" {
#USAGE   choices "ios" "android"
#USAGE }
#USAGE flag "--namespace <namespace>" help="Jupiter namespace"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_platform:=}"
: "${usage_namespace:=}"

source tasks/_common.sh

platform="${usage_platform}"
namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

webui_port=$(get_jupiter_port "$namespace" "webui")
export HOSTED_GLOBAL_WEBUI_URL="http://localhost:$webui_port"
export BUILD_TARGET=$platform

cd src/mobile
npx vite build
npx cap run "$platform"
