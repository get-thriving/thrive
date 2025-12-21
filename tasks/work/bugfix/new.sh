#!/usr/bin/env bash

#MISE description="Create a new bugfix branch"
#USAGE arg "<bugfixName>" required help="The name of the bugfix"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

: "${usage_bugfix_name:=}"

log info "Creating new bugfix branch: $usage_bugfix_name"

if [[ -z "$usage_bugfix_name" ]]; then
    log info "Bugfix name is required"
    exit 1
fi

git checkout develop
git pull
git checkout -b "bugfix/${usage_bugfix_name}"
