#!/usr/bin/env bash

#MISE description="Generate historical lines-of-code statistics via monthly commits on current branch"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global

branch=$(git branch --show-current)

mkdir -p .build-cache/cloc/$VERSION
output_file="$(pwd)/.build-cache/cloc/$VERSION/stats-over-time.csv"

# Create a temporary directory and ensure cleanup on exit
tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT

log info "Cloning thrive repo into $tmp_dir ..."
git clone --quiet --branch "$branch" https://github.com/horia141/thrive.git "$tmp_dir/thrive"

cd "$tmp_dir/thrive"

# --- Build list of commits: first, one per month, and last on current branch ---

first_commit=$(git rev-list --max-parents=0 "$branch" | tail -1)
last_commit=$(git rev-parse "$branch")

first_date=$(git log -1 --format='%ai' "$first_commit" | cut -d' ' -f1)
last_date=$(git log -1 --format='%ai' "$last_commit" | cut -d' ' -f1)

log info "First commit: $first_commit ($first_date)"
log info "Last commit:  $last_commit ($last_date)"

# Generate month-boundary dates from first to last
month_boundaries=$(python3 -c "
from datetime import date
first = '$first_date'.split('-')
last  = '$last_date'.split('-')
y, m = int(first[0]), int(first[1])
ey, em = int(last[0]), int(last[1])
# Start from the month after the first commit's month
if m == 12:
    y, m = y+1, 1
else:
    m += 1
while (y, m) <= (ey, em):
    print(f'{y:04d}-{m:02d}-01')
    if m == 12:
        y, m = y+1, 1
    else:
        m += 1
")

# Collect commits: first commit, then last commit on develop before each month boundary, then last commit
declare -A seen_commits
commits_ordered=()

add_commit() {
    local sha="$1"
    if [[ -z "${seen_commits[$sha]+_}" ]]; then
        seen_commits[$sha]=1
        commits_ordered+=("$sha")
    fi
}

add_commit "$first_commit"

for boundary in $month_boundaries; do
    sha=$(git log "$branch" --before="$boundary" --format='%H' -1 2>/dev/null || true)
    if [[ -n "$sha" ]]; then
        add_commit "$sha"
    fi
done

add_commit "$last_commit"

echo "commit,date,total_lines_of_code" > "$output_file"

total=${#commits_ordered[@]}
current=0

for sha in "${commits_ordered[@]}"; do
    current=$((current + 1))
    commit_date=$(git log -1 --format='%ai' "$sha" | cut -d' ' -f1)
    short_sha=$(git log -1 --format='%h' "$sha")

    log info "Processing $short_sha / $commit_date ($current/$total) ..."

    git checkout --quiet "$sha"

    # Run cloc on whichever directories exist at this commit
    cloc_dirs=""
    for d in docs/ infra/ itests/ src/ scripts/ jupiter/ tests/ migrations/ tasks/; do
        [[ -d "$d" ]] && cloc_dirs="$cloc_dirs $d"
    done

    if [[ -z "$cloc_dirs" ]]; then
        log info "No source directories found for $short_sha, skipping"
        continue
    fi

    total_loc=$(cloc \
        --exclude-dir="node_modules,.build-cache,build,public,.mypy_cache,ios,android" \
        --not-match-f="(pnpm-lock.json|uv.lock|.hcl)" \
        $cloc_dirs \
        2>/dev/null \
        | grep '^SUM' \
        | awk '{print $NF}') || true

    if [[ -z "$total_loc" ]]; then
        log info "No SUM line found for $short_sha, skipping"
        continue
    fi

    echo "$short_sha,$commit_date,$total_loc" >> "$output_file"
    log info "$short_sha,$commit_date,$total_loc"
done

log info "Done. Results:"
echo ""
cat "$output_file"
