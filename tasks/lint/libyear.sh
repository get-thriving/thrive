#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Run all libyear checks"
#MISE depends=["root:libyear", "package:**:libyear"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
