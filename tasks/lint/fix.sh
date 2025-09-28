#!/usr/bin/env bash

#MISE description="Fix lint issues"
#MISE depends=["package:**:fix"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh
