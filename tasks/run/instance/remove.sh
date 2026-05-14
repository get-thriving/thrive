#!/usr/bin/env bash

#MISE description="Remove a Jupiter instance"
#USAGE arg "<instance>" required help="The instance to remove"
#USAGE complete "instance" run="./tasks/run/instance/_list-fast.sh"
#USAGE flag "--force" optional help="Force removal without confirmation"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_instance:=}"

set -e -o pipefail

source tasks/_common.sh

instance="${usage_instance}"

if [[ "$instance" == "$STANDARD_INSTANCE" ]]; then
    log info "Error: Cannot remove the standard instance '$STANDARD_INSTANCE'."
    exit 1
fi

instance_path="$RUN_ROOT/$instance"

if [[ ! -d "$instance_path" ]]; then
    log info "Error: Environ '$instance' does not exist"
    log info "Available instances:"
    find "$RUN_ROOT" -maxdepth 1 -type d -not -path "$RUN_ROOT" | sed "s|$RUN_ROOT/||" | sort | sed 's/^/  /'
    exit 1
fi

log info "Removing instance: $instance"

# Check if services are running for this instance
if check_service_is_running pm2 "$instance" webapi:srv; then
    log info "Warning: This instance appears to have running services."
    log info "Consider stopping the services first to avoid issues."
fi

if check_service_is_running pm2 "$instance" webui; then
    log info "Warning: This instance appears to have running services."
    log info "Consider stopping the services first to avoid issues."
fi


# Show what will be removed
log info "Contents to be removed:"
ls -la "$instance_path"

if [[ -z "${usage_force:-}" ]]; then
    log info "Are you sure you want to remove instance '$instance'? (y/N)"
    read -r confirmation

    if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
        log info "Operation cancelled."
        exit 0
    fi
fi

# Remove the instance directory
if rm -rf "$instance_path"; then
    log info "Successfully removed instance: $instance"
else
    log info "Failed to remove instance: $instance"
    exit 1
fi
