#!/usr/bin/env bash

set -ex

#MISE description="List all available releases"

git pull --ff-only --tags origin develop
git tag --list
