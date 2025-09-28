#!/usr/bin/env bash

#MISE description="Run all libyear checks"
#MISE depends=["root:libyear", "package:**:libyear"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh
