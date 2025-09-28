#!/usr/bin/env bash

#MISE description="Build Docker images for webapi, webui, and cli"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global

log info "Building Docker images for webapi"

docker build -t jupiter/webapi:latest -t jupiter/webapi:${VERSION} -f src/webapi/Dockerfile .

log info "Building Docker images for webui"

docker build -t jupiter/webui:latest -t jupiter/webui:${VERSION} -f src/webui/Dockerfile .

log info "Building Docker images for cli"

docker build -t jupiter/cli:latest -t jupiter/cli:${VERSION} -f src/cli/Dockerfile .
