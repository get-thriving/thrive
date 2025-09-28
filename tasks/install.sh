#!/usr/bin/env bash

#MISE description="Install dependencies"
#MISE depends=["root:install", "package:**:install"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh
