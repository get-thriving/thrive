#!/usr/bin/env bash

#MISE description="Generate historical lines-of-code statistics via monthly commits on current branch"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global

repo_root=$(pwd)
git_dir=$(git rev-parse --absolute-git-dir)

# Caller/IDE env can pin git to this checkout. Drop it so later commands cannot
# accidentally mutate the live worktree (node_modules, .venv, etc.).
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_OBJECT_DIRECTORY GIT_COMMON_DIR

git_in_repo() {
    git --git-dir="$git_dir" --work-tree="$repo_root" "$@"
}

branch=$(git_in_repo branch --show-current)
if [[ -z "$branch" ]]; then
    log error "Not on a branch (detached HEAD). Check out a branch first."
    exit 1
fi

mkdir -p .build-cache/cloc/"$VERSION"
output_file="${repo_root}/.build-cache/cloc/${VERSION}/stats-over-time.csv"

tmp_dir=$(mktemp -d)
if [[ -z "$tmp_dir" || ! -d "$tmp_dir" || "$tmp_dir" == "/" || "$tmp_dir" == "$repo_root" ]]; then
    log error "Refusing to use unsafe temp directory: '${tmp_dir:-}'"
    exit 1
fi

cleanup_tmp_dir() {
    if [[ -n "${tmp_dir:-}" && -d "$tmp_dir" && "$tmp_dir" != "/" && "$tmp_dir" != "$repo_root" ]]; then
        rm -rf -- "$tmp_dir"
    fi
}
trap cleanup_tmp_dir EXIT

extract_dir="$tmp_dir/tree"

# --- Build list of commits: first, one per month, and last on current branch ---

first_commit=$(git_in_repo rev-list --max-parents=0 "$branch" | tail -1)
last_commit=$(git_in_repo rev-parse "$branch")

first_date=$(git_in_repo log -1 --format='%ai' "$first_commit" | cut -d' ' -f1)
last_date=$(git_in_repo log -1 --format='%ai' "$last_commit" | cut -d' ' -f1)

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
# (Linear dedup — macOS /bin/bash is 3.2 and has no associative arrays.)
commits_ordered=()

add_commit() {
    local sha="$1"
    local existing
    for existing in "${commits_ordered[@]}"; do
        if [[ "$existing" == "$sha" ]]; then
            return
        fi
    done
    commits_ordered+=("$sha")
}

add_commit "$first_commit"

for boundary in $month_boundaries; do
    sha=$(git_in_repo log "$branch" --before="$boundary" --format='%H' -1 2>/dev/null || true)
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
    commit_date=$(git_in_repo log -1 --format='%ai' "$sha" | cut -d' ' -f1)
    short_sha=$(git_in_repo log -1 --format='%h' "$sha")

    log info "Processing $short_sha / $commit_date ($current/$total) ..."

    # Read-only snapshot: never git-checkout (that could rewrite this worktree
    # if GIT_DIR leaked, and prune node_modules/.venv via lockfile watchers).
    rm -rf -- "$extract_dir"
    mkdir -p "$extract_dir"
    git_in_repo archive --format=tar "$sha" | tar -xf - -C "$extract_dir"

    # Run cloc on whichever directories exist at this commit
    cloc_dirs=()
    for d in docs/ infra/ itests/ src/ scripts/ jupiter/ tests/ migrations/ tasks/; do
        [[ -d "$extract_dir/$d" ]] && cloc_dirs+=("$extract_dir/$d")
    done

    if [[ ${#cloc_dirs[@]} -eq 0 ]]; then
        log info "No source directories found for $short_sha, skipping"
        continue
    fi

    total_loc=$(cloc \
        --exclude-dir="node_modules,.build-cache,build,public,.mypy_cache,ios,android" \
        --not-match-f="(pnpm-lock.json|uv.lock|.hcl)" \
        "${cloc_dirs[@]}" \
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

log info "Plotting lines of code over time ..."
uv run python3 tasks/build/stats-over-time-graph.py "$output_file"
