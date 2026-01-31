#!/usr/bin/env bash

#MISE description="Plan the infrastructure"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global
source secrets/Config.secrets

log info "Planning infrastructure"

cd infra
terraform init -upgrade
terraform plan -var="sentry_token=$SENTRY_AUTH_TOKEN"
