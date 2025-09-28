#!/usr/bin/env bash

#MISE description="Remove a Jupiter namespace"
#USAGE arg "<namespace>" required help="The namespace to remove"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--force" optional help="Force removal without confirmation"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_namespace:=}"

set -e -o pipefail

source tasks/_common.sh

namespace="${usage_namespace}"

if [[ "$namespace" == "$STANDARD_NAMESPACE" ]]; then
    log info "Error: Cannot remove the standard namespace '$STANDARD_NAMESPACE'."
    exit 1
fi

namespace_path="$RUN_ROOT/$namespace"

if [[ ! -d "$namespace_path" ]]; then
    log info "Error: Namespace '$namespace' does not exist"
    log info "Available namespaces:"
    find "$RUN_ROOT" -maxdepth 1 -type d -not -path "$RUN_ROOT" | sed "s|$RUN_ROOT/||" | sort | sed 's/^/  /'
    exit 1
fi

log info "Removing namespace: $namespace"

# Check if services are running for this namespace
if check_service_is_running pm2 "$namespace" webapi; then
    log info "Warning: This namespace appears to have running services."
    log info "Consider stopping the services first to avoid issues."
fi

if check_service_is_running pm2 "$namespace" webui; then
    log info "Warning: This namespace appears to have running services."
    log info "Consider stopping the services first to avoid issues."
fi


# Show what will be removed
log info "Contents to be removed:"
ls -la "$namespace_path"

if [[ -z "${usage_force:-}" ]]; then
    log info "Are you sure you want to remove namespace '$namespace'? (y/N)"
    read -r confirmation

    if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
        log info "Operation cancelled."
        exit 0
    fi
fi

# Remove the namespace directory
if rm -rf "$namespace_path"; then
    log info "Successfully removed namespace: $namespace"
else
    log info "Failed to remove namespace: $namespace"
    exit 1
fi
