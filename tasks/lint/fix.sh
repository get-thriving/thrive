#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Fix lint issues"
#MISE depends=["package:**:fix"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
