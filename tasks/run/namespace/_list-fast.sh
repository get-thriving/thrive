#!/usr/bin/env bash


source scripts/common.sh

set -e
set +x

# Check if RUN_ROOT is set
if [[ -z "${RUN_ROOT:-}" ]]; then
    echo "RUN_ROOT is not set."
    exit 1
fi

# Check if RUN_ROOT directory exists
if [[ ! -d "$RUN_ROOT" ]]; then
    echo "No namespaces found. Run directory does not exist: $RUN_ROOT"
    exit 0
fi

# Use tree to list namespaces
tree -L 1 -d -fi "$RUN_ROOT" | sed "s|$RUN_ROOT||" | sed 's|/||' | grep -v '^$' | grep -v '^[0-9]'
