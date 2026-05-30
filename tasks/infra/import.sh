#!/usr/bin/env bash

#MISE description="Import an existing remote resource into Terraform state"
#USAGE arg "<resource_address>" help="The address of the resource to import"
#USAGE arg "<remote_id>" help="The ID of the resource to import"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

: "${usage_resource_address:=}"
: "${usage_remote_id:=}"

log info "Importing infrastructure resource: ${usage_resource_address} from ${usage_remote_id}"

trap 'rm -f infra/infra.tfvars infra/secrets.tfvars' EXIT

sed 's/\([^=]*\)=\(.*\)/\1 = "\2"/' infra/Config.infra > infra/infra.tfvars
sed 's/\([^=]*\)=\(.*\)/\1 = "\2"/' secrets/Config.secrets > infra/secrets.tfvars

(cd infra && terraform init -upgrade)
# (cd infra && terraform state rm "$usage_resource_address")
(cd infra && terraform import -var-file=infra.tfvars -var-file=secrets.tfvars "$usage_resource_address" "$usage_remote_id")

