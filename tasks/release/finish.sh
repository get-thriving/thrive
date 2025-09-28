#!/usr/bin/env bash

#MISE description="Finish release by merging to master and develop"
#USAGE about "Finishes a release by merging to master and develop"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

release_branch=$(git rev-parse --abbrev-ref HEAD)

if ! [[ "${release_branch}" =~ "release/" ]]
then
    echo "Must be in a release"
    exit 1
fi

release_version=${release_branch/release\/}

git commit -a -m "Prepared release version ${release_version}"

# Merge into master
git checkout master
git merge --squash "${release_branch}" --strategy recursive --strategy-option theirs
git commit -a -m "Release version ${release_version}"
git tag -a "${release_version}" -m "Version ${release_version}"
git push --follow-tags origin master

# Merge into develop
git checkout develop
git merge master -m "Merge master with release ${release_version} back into develop" --strategy recursive --strategy-option theirs
git push origin develop

# Remove old branch
git branch -D "${release_branch}"
