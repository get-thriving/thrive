#!/usr/bin/env bash

set -ex

#MISE description="Abandon current release and return to develop"

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
