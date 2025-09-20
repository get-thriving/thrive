#!/usr/bin/env bash

set -ex

#MISE description="Run integration tests for CI"
#USAGE flag "--run-mode <runMode>" default="pm2" help="The run mode" {
#USAGE   choices "pm2" "docker"
#USAGE }
#USAGE arg "[pytestArgs]" double_dash="required" var=#true help="The pytest args"

: "${usage_run_mode:=}"
: "${usage_pytest_args:=}"


source scripts/common.sh
source tasks/test/_common.sh

mkdir -p .build-cache/itest

namespace=$(get_namespace)
webapi_port=$(get_free_port)
webapi_url=http://0.0.0.0:${webapi_port}
webui_port=$(get_free_port)
if [[ "$usage_run_mode" == "docker" ]]; then
    webui_url=https://0.0.0.0:${webui_port}
else
    webui_url=http://0.0.0.0:${webui_port}
fi

# Are we truly in a CI environment, or on a local machine but running the CI script?
# If we are, GitHub (and other CI providers) will set the CI environment variable.
in_ci=
if [[ -z "$CI" ]]; then
    in_ci="dev"
else
    in_ci="ci"
fi

run_jupiter "$namespace" "$webapi_port" "$webui_port" wait:all no-monit $in_ci "$usage_run_mode"

echo "Using Web API $webapi_url and Web UI $webui_url and pytest args ${usage_pytest_args[*]}"

run_tests "$webapi_url" "$webui_url" "${usage_pytest_args[*]}"
