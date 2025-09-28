#!/usr/bin/env bash

#MISE description="Close a feature branch by merging it into develop"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

feature_branch_name=$(git rev-parse --abbrev-ref HEAD)

if [[ "${feature_branch_name}" != feature/* ]]
then
    log info "Must be on a feature branch"
    exit 1
fi

if ! git diff --cached --exit-code --quiet
then
    log info "There are uncomitted changed"
    exit 1
fi

log info "Closing feature branch: $feature_branch_name"

git checkout develop
git merge --squash "${feature_branch_name}"
git commit -a -m "Merged branch ${feature_branch_name} into develop"
git branch -D "${feature_branch_name}"
git push origin develop
