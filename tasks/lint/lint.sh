#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Run all lint tasks"
#MISE depends=["root:lint", "docs:lint", "package:**:lint"]
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }
