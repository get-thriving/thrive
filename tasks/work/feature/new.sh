#!/usr/bin/env bash

#MISE description="Create a new feature branch"
#USAGE arg "<featureName>" required help="The name of the feature"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

: "${usage_feature_name:=}"

log info "Creating new feature branch: $usage_feature_name"

if [[ -z "$usage_feature_name" ]]; then
    log info "Feature name is required"
    exit 1
fi

git checkout develop
git pull
git checkout -b "feature/${usage_feature_name}"
