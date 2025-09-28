#!/usr/bin/env bash

#MISE description="Run unit tests for packages"
#MISE depends=["package:**:test"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh
