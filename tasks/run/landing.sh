#!/usr/bin/env bash

#MISE description="Run the landing page dev server (it needs no Jupiter instance)"
#USAGE flag "--port <port>" help="Port to listen on (defaults to the standard landing port)"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_port:=}"

set -e -o pipefail

source tasks/_common.sh

port="${usage_port:-$STANDARD_LANDING_PORT}"

# Where the page's links point: the local WebUI and docs, unless the caller says otherwise.
set -a
# shellcheck disable=SC1091
source src/landing/Config.project
set +a

log info "Running the landing page on http://localhost:${port}"

cd src/landing
PORT="$port" exec pnpm exec react-router dev
