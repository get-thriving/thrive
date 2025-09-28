#!/usr/bin/env bash

#MISE description="List all Jupiter namespaces"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

log debug Listing Jupiter namespaces

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

echo "Jupiter Namespaces:"
echo "==================="

if [[ -z "${RUN_ROOT:-}" ]]; then
    echo "RUN_ROOT is not set."
    exit 1
fi

if [[ ! -d "$RUN_ROOT" ]]; then
    echo "No namespaces found. Run directory does not exist: $RUN_ROOT"
    exit 0
fi

# Collect namespaces (directories directly under RUN_ROOT)
# Use a portable approach that works on GNU/BSD find.
namespaces=$(
  find "$RUN_ROOT" -maxdepth 1 -type d -not -path "$RUN_ROOT" \
    | sed "s|$RUN_ROOT/||" \
    | LC_ALL=C sort
)

if [[ -z "$namespaces" ]]; then
    echo "No namespaces found in $RUN_ROOT"
    exit 0
fi

count="$(echo "$namespaces" | wc -l | tr -d ' ')"
echo "Found $count namespace(s):"
echo "Run directory: $RUN_ROOT"
echo ""

# Iterate each namespace
# (names shouldn't contain whitespace; if they could, switch to a read-while loop)
for namespace in $namespaces; do
    namespace_path="$RUN_ROOT/$namespace"

    # Build status info
    webapi_port_file="$namespace_path/webapi.port"
    webui_port_file="$namespace_path/webui.port"
    db_file="$namespace_path/jupiter.sqlite"

    status_info=""

    if [[ -f "$webapi_port_file" && -f "$webui_port_file" ]]; then
        webapi_port="$(cat "$webapi_port_file" 2>/dev/null || true)"
        webui_port="$(cat "$webui_port_file" 2>/dev/null || true)"
        if [[ -n "$webapi_port" && -n "$webui_port" ]]; then
        status_info+=" - WebAPI: http://localhost:$webapi_port, WebUI: http://localhost:$webui_port"
        fi
    fi

    if [[ -f "$db_file" ]]; then
        # Portable-ish size: parse ls -lh output (fifth field)
        db_size="$(find "$db_file" -prune -exec ls -lh {} \; | awk '{print $5}')"
        if [[ -n "$status_info" ]]; then
        status_info+=", Database: $db_size"
        else
        status_info+=" - Database: $db_size"
        fi
    fi

    # Build plain (no ANSI) label for width calc
    plain="  * $namespace"
    if [[ "${namespace}" == "${STANDARD_NAMESPACE:-}" ]]; then
        plain+=" (standard)"
    fi

    # Build colored label for output
    if [[ "${namespace}" == "${STANDARD_NAMESPACE:-}" ]]; then
        colored="  * ${blue}${namespace}${reset} ${green}(standard)${reset}"
    else
        colored="  * ${blue}${namespace}${reset}"
    fi

    # Compute padding based on *visible* length of plain label
    pad=$(( COL_W - ${#plain} ))
    (( pad < 1 )) && pad=1

    # Print aligned line: colored label + spaces + status
    printf "%s%*s %s\n" "$colored" "$pad" "" "$status_info"
done