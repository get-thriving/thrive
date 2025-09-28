#!/usr/bin/env bash

set -e
set +x

#MISE description="List all available releases"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

git tag --list | sort -r
