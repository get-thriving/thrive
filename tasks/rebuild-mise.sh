#!/usr/bin/env bash

set -ex

#MISE description="Rebuild mise.toml"
#USAGE arg "<packageMisePath>" var=#true help="Paths to the mise.toml files"

: "${usage_package_mise_path:=}"

source scripts/common.sh

warning="THIS IS AN AUTO-GENERATED FILE. MODIFY mise.toml.hbs AND RUN mise tasks rebuild-mise TO UPDATE."
# shellcheck disable=SC2068
data_json="$(jo warning="$warning" packageMisePaths="$(jo -a ${usage_package_mise_path[@]})")"

npx hbs-cli --stdout -D "$data_json" mise.toml.hbs > mise.toml
