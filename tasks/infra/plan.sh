#!/usr/bin/env bash

#MISE description="Plan the infrastructure"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

log info "Planning infrastructure"

trap 'rm -f infra/infra.tfvars infra/secrets.tfvars' EXIT

sed 's/\([^=]*\)=\(.*\)/\1 = "\2"/' infra/Config.infra > infra/infra.tfvars
sed 's/\([^=]*\)=\(.*\)/\1 = "\2"/' secrets/Config.secrets > infra/secrets.tfvars

(cd infra && terraform init -upgrade)
(cd infra && terraform plan -var-file=infra.tfvars -var-file=secrets.tfvars -compact-warnings)
