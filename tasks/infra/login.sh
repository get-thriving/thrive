#!/usr/bin/env bash

#MISE description="Login to the infrastructure"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

log info "Logging in to the infrastructure"

gcloud auth application-default login
cp -f "${HOME}/.config/gcloud/application_default_credentials.json" secrets/gcp-login.json
