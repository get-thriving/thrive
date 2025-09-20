#!/usr/bin/env bash

set -ex

#MISE description="Create a new bugfix branch"
#USAGE arg "<bugfixName>" required help="The name of the bugfix"

: "${usage_bugfix_name:=}"

git checkout develop
git pull
git checkout -b "bugfix/${usage_bugfix_name}"
