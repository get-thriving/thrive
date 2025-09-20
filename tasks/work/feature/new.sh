#!/usr/bin/env bash

set -ex

#MISE description="Create a new feature branch"
#USAGE arg "<featureName>" required help="The name of the feature"

: "${usage_feature_name:=}"

git checkout develop
git pull
git checkout -b "feature/${usage_feature_name}"
