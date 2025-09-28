#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Close a bugfix branch by merging it into develop"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

bugfix_branch_name=$(git rev-parse --abbrev-ref HEAD)

if [[ "${bugfix_branch_name}" != bugfix/* ]]
then
    echo "Must be on a bugfix branch"
    exit 1
fi

if ! git diff --cached --exit-code --quiet
then
    echo "There are uncomitted changed"
    exit 1
fi

git checkout develop
git merge --squash "${bugfix_branch_name}"
git commit -a -m "Merged branch ${bugfix_branch_name} into develop"
git branch -D "${bugfix_branch_name}"
git push origin develop
