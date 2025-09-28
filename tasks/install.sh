#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Install dependencies"
#MISE depends=["root:install", "package:**:install"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
