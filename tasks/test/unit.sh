#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Run unit tests for packages"
#MISE depends=["package:**:test"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
