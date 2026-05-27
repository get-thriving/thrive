#!/usr/bin/env bash

#MISE description="List all Jupiter instances"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

log debug Listing Jupiter instances

# --- Config ---
COL_W=42

# Colors (disable if NO_COLOR is set or not a TTY)
if [[ -t 1 && -z "${NO_COLOR:-}" ]]; then
    blue=$'\033[1;34m'
    green=$'\033[32m'
    reset=$'\033[0m'
else
    blue=""
    green=""
    reset=""
fi

echo "Jupiter Environs:"
echo "================="

if [[ -z "${RUN_ROOT:-}" ]]; then
    echo "RUN_ROOT is not set."
    exit 1
fi

if [[ ! -d "$RUN_ROOT" ]]; then
    echo "No instances found. Run directory does not exist: $RUN_ROOT"
    exit 0
fi

# Collect instances (directories directly under RUN_ROOT)
# Use a portable approach that works on GNU/BSD find.
instances=$(
  find "$RUN_ROOT" -maxdepth 1 -type d -not -path "$RUN_ROOT" \
    | sed "s|$RUN_ROOT/||" \
    | LC_ALL=C sort
)

if [[ -z "$instances" ]]; then
    echo "No instances found in $RUN_ROOT"
    exit 0
fi

count="$(echo "$instances" | wc -l | tr -d ' ')"
echo "Found $count instance(s):"
echo "Run directory: $RUN_ROOT"
echo ""

# Iterate each instance
# (names shouldn't contain whitespace; if they could, switch to a read-while loop)
for instance in $instances; do
    instance_path="$RUN_ROOT/$instance"

    # Build status info
    webapi_url=$(get_dev_service_url "$instance" "webapi:srv")
    api_url=$(get_dev_service_url "$instance" "api")
    webui_url=$(get_dev_service_url "$instance" "webui")
    docs_url=$(get_dev_service_url "$instance" "docs")
    db_file="$instance_path/jupiter.sqlite"

    status_info="WebAPI: $webapi_url, API: $api_url, WebUI: $webui_url, Docs: $docs_url"

    if [[ -f "$db_file" ]]; then
        # Portable-ish size: parse ls -lh output (fifth field)
        db_size="$(find "$db_file" -prune -exec ls -lh {} \; | awk '{print $5}')"
        if [[ -n "$status_info" ]]; then
            status_info+=", Database: $db_size"
        else
            status_info="Database: $db_size"
        fi
    fi

    # Build plain (no ANSI) label for width calc
    plain="  * $instance"
    if [[ "${instance}" == "${STANDARD_INSTANCE:-}" ]]; then
        plain+=" (standard)"
    fi

    # Build colored label for output
    if [[ "${instance}" == "${STANDARD_INSTANCE:-}" ]]; then
        colored="  * ${blue}${instance}${reset} ${green}(standard)${reset}"
    else
        colored="  * ${blue}${instance}${reset}"
    fi

    # Compute padding based on *visible* length of plain label
    pad=$(( COL_W - ${#plain} ))
    (( pad < 1 )) && pad=1

    # Print aligned line: colored label + spaces + status
    printf "%s%*s %s\n" "$colored" "$pad" "" "$status_info"
done