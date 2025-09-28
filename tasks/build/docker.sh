#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Build Docker images for webapi, webui, and cli"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

source src/Config.global

docker build -t jupiter/webapi:latest -t jupiter/webapi:${VERSION} -f src/webapi/Dockerfile .
docker build -t jupiter/webui:latest -t jupiter/webui:${VERSION} -f src/webui/Dockerfile .
docker build -t jupiter/cli:latest -t jupiter/cli:${VERSION} -f src/cli/Dockerfile .
