#!/usr/bin/env bash

#MISE description="List all available releases"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

git tag --list | sort -r
