#!/usr/bin/env bash

#MISE description="Prepare for build"
#MISE depends=["root:prepare", "docs:prepare", "package:**:prepare"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

