#!/usr/bin/env bash

#MISE description="Remove a Jupiter environ"
#USAGE arg "<environ>" required help="The environ to remove"
#USAGE complete "environ" run="./tasks/run/environ/_list-fast.sh"
#USAGE flag "--force" optional help="Force removal without confirmation"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_environ:=}"

set -e -o pipefail

source tasks/_common.sh

environ="${usage_environ}"

if [[ "$environ" == "$STANDARD_ENVIRON" ]]; then
    log info "Error: Cannot remove the standard environ '$STANDARD_ENVIRON'."
    exit 1
fi

environ_path="$RUN_ROOT/$environ"

if [[ ! -d "$environ_path" ]]; then
    log info "Error: Environ '$environ' does not exist"
    log info "Available environs:"
    find "$RUN_ROOT" -maxdepth 1 -type d -not -path "$RUN_ROOT" | sed "s|$RUN_ROOT/||" | sort | sed 's/^/  /'
    exit 1
fi

log info "Removing environ: $environ"

# Check if services are running for this environ
if check_service_is_running pm2 "$environ" webapi; then
    log info "Warning: This environ appears to have running services."
    log info "Consider stopping the services first to avoid issues."
fi

if check_service_is_running pm2 "$environ" webui; then
    log info "Warning: This environ appears to have running services."
    log info "Consider stopping the services first to avoid issues."
fi


# Show what will be removed
log info "Contents to be removed:"
ls -la "$environ_path"

if [[ -z "${usage_force:-}" ]]; then
    log info "Are you sure you want to remove environ '$environ'? (y/N)"
    read -r confirmation

    if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
        log info "Operation cancelled."
        exit 0
    fi
fi

# Remove the environ directory
if rm -rf "$environ_path"; then
    log info "Successfully removed environ: $environ"
else
    log info "Failed to remove environ: $environ"
    exit 1
fi
