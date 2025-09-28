#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Audit the src modules"
#MISE depends=["root:audit", "package:**:audit"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

