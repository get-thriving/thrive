#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Create a new feature branch"
#USAGE arg "<featureName>" required help="The name of the feature"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_feature_name:=}"

git checkout develop
git pull
git checkout -b "feature/${usage_feature_name}"
