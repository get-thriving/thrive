#!/usr/bin/env bash

#MISE description="Close a bugfix branch by merging it into develop"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

bugfix_branch_name=$(git rev-parse --abbrev-ref HEAD)

if [[ "${bugfix_branch_name}" != bugfix/* ]]
then
    log info "Must be on a bugfix branch"
    exit 1
fi

if ! git diff --cached --exit-code --quiet
then
    log info "There are uncomitted changed"
    exit 1
fi

log info "Closing bugfix branch: $bugfix_branch_name"

git checkout develop
git merge --squash "${bugfix_branch_name}"
git commit -a -m "Merged branch ${bugfix_branch_name} into develop"
git branch -D "${bugfix_branch_name}"
git push origin develop
