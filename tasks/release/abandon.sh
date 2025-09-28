#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Abandon current release and return to develop"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

release_branch=$(git rev-parse --abbrev-ref HEAD)

if ! [[ "${release_branch}" =~ "release/" ]]
then
    echo "Must be in a release"
    exit 1
fi

git checkout -- .
git reset --hard HEAD
git checkout develop
git branch -D "${release_branch}"
