#!/usr/bin/env bash

set -e
set +x

#MISE description="List all available releases"

git tag --list | sort -r
