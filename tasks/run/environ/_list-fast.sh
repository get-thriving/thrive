#!/usr/bin/env bash

set -e -o pipefail

source tasks/_common.sh

# Use tree to list environs
tree -L 1 -d -fi "$RUN_ROOT" | sed "s|$RUN_ROOT||" | sed 's|/||' | grep -v '^$' | grep -v '^[0-9]'
