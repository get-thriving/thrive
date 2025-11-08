#!/usr/bin/env bash

#MISE description="Rebuild mise.toml"
#USAGE arg "<packageMisePath>" var=#true help="Paths to the mise.toml files"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_package_mise_path:=}"

set -e -o pipefail

source tasks/_common.sh

warning="THIS IS AN AUTO-GENERATED FILE. MODIFY mise.toml.hbs AND RUN mise tasks rebuild-mise TO UPDATE."
# shellcheck disable=SC2068
data_json="$(jo warning="$warning" packageMisePaths="$(jo -a ${usage_package_mise_path[@]})")"

node tasks/_resources/render-hbs.mjs tasks/_resources/mise.toml.hbs "$data_json" > mise.toml
