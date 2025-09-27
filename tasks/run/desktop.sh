#!/usr/bin/env bash

set -ex

#MISE description="Run desktop app with optional namespace"
#USAGE flag "--namespace <namespace>" help="Jupiter namespace"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"

: "${usage_namespace:=}"

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    namespace=$STANDARD_NAMESPACE
fi

webui_port=$(get_jupiter_port "$namespace" "webui")
export HOSTED_GLOBAL_WEBUI_URL="http://localhost:$webui_port"

cd src/desktop
npx vite build
npx electron-forge start
