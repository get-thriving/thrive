#!/usr/bin/env bash

#MISE description="Run checks for packages"
#MISE depends=["lint:tasks", "lint:lint", "test:unit"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

