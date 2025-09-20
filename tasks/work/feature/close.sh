#!/usr/bin/env bash

set -ex

#MISE description="Close a feature branch by merging it into develop"

feature_branch_name=$(git rev-parse --abbrev-ref HEAD)

if [[ "${feature_branch_name}" != feature/* ]]
then
    echo "Must be on a feature branch"
    exit 1
fi

if ! git diff --cached --exit-code --quiet
then
    echo "There are uncomitted changed"
    exit 1
fi

git checkout develop
git merge --squash "${feature_branch_name}"
git commit -a -m "Merged branch ${feature_branch_name} into develop"
git branch -D "${feature_branch_name}"
git push origin develop
