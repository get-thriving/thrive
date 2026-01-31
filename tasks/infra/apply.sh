#!/usr/bin/env bash

#MISE description="Apply the infrastructure"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global
source secrets/Config.secrets

log info "Applying infrastructure"

cd infra
terraform init -upgrade
terraform apply -var="sentry_token=$SENTRY_AUTH_TOKEN"
