#!/usr/bin/env bash

set -e

#MISE description="Remove a Jupiter namespace"
#USAGE arg "<namespace>" required help="The namespace to remove"
#USAGE complete "namespace" run="./tasks/run/namespace/_list-fast.sh"
#USAGE flag "--force" optional help="Force removal without confirmation"

: "${usage_namespace:=}"

source scripts/common.sh

set +x

namespace="${usage_namespace}"

if [[ -z "$namespace" ]]; then
    echo "Error: Namespace is required"
    echo "Usage: $0 <namespace>"
    exit 1
fi

if [[ "$namespace" == "$STANDARD_NAMESPACE" ]]; then
    echo "Error: Cannot remove the standard namespace '$STANDARD_NAMESPACE'."
    exit 1
fi

namespace_path="$RUN_ROOT/$namespace"

if [[ ! -d "$namespace_path" ]]; then
    echo "Error: Namespace '$namespace' does not exist"
    echo "Available namespaces:"
    find "$RUN_ROOT" -maxdepth 1 -type d -not -path "$RUN_ROOT" | sed "s|$RUN_ROOT/||" | sort | sed 's/^/  /'
    exit 1
fi

echo "Removing namespace: $namespace"
echo "Path: $namespace_path"

# Check if services are running for this namespace
if check_service_is_running pm2 "$namespace" webapi; then
    echo "Warning: This namespace appears to have running services."
    echo "Consider stopping the services first to avoid issues."
    echo ""
fi

if check_service_is_running pm2 "$namespace" webui; then
    echo "Warning: This namespace appears to have running services."
    echo "Consider stopping the services first to avoid issues."
    echo ""
fi


# Show what will be removed
echo "Contents to be removed:"
ls -la "$namespace_path"

echo ""
if [[ -z "${usage_force:-}" ]]; then
    echo "Are you sure you want to remove namespace '$namespace'? (y/N)"
    read -r confirmation

    if [[ "$confirmation" != "y" && "$confirmation" != "Y" ]]; then
        echo "Operation cancelled."
        exit 0
    fi
fi

# Remove the namespace directory
if rm -rf "$namespace_path"; then
    echo "Successfully removed namespace: $namespace"
else
    echo "Failed to remove namespace: $namespace"
    exit 1
fi
