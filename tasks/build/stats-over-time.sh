#!/usr/bin/env bash

#MISE description="Generate historical lines-of-code statistics across all semver tags"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

source src/Config.global

mkdir -p .build-cache/cloc/$VERSION
output_file="$(pwd)/.build-cache/cloc/$VERSION/stats-over-time.csv"

# Run for the latest (current) version on the default branch
log info "Processing latest version ..."

latest_total_loc=$(cloc \
    --exclude-dir="node_modules,.build-cache,build,public,.mypy_cache,ios,android" \
    --not-match-f="(pnpm-lock.json|uv.lock|.hcl)" \
    docs/ \
    infra/ \
    itests/ \
    src/ \
    scripts/ \
    jupiter/ \
    tests/ \
    migrations/ \
    tasks/ \
    2>/dev/null \
    | grep '^SUM' \
    | awk '{print $NF}') || true


# Create a temporary directory and ensure cleanup on exit
tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT

log info "Cloning thrive repo into $tmp_dir ..."
git clone --quiet https://github.com/horia141/thrive.git "$tmp_dir/thrive"

cd "$tmp_dir/thrive"

# Enumerate semver tags (vX.Y.Z) and sort them
tags=$(git tag --list 'v[0-9]*.[0-9]*.[0-9]*' --sort=version:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$')

echo "tag,date,total_lines_of_code" > "$output_file"

tag_count=$(echo "$tags" | wc -l)
current=0

for tag in $tags; do
    current=$((current + 1))
    log info "Processing tag $tag ($current/$tag_count) ..."

    git checkout --quiet "$tag"

    # Get the date of the tag (tagger date for annotated tags, commit date for lightweight)
    tag_date=$(git log -1 --format='%ai' "$tag" | cut -d' ' -f1)

    # Run cloc and extract total lines of code from the SUM line (last column)
    total_loc=$(cloc \
        --exclude-dir="node_modules,.build-cache,build,public,.mypy_cache,ios,android" \
        --not-match-f="(pnpm-lock.json|uv.lock|.hcl)" \
        docs/ \
        infra/ \
        itests/ \
        src/ \
        scripts/ \
        jupiter/ \
        tests/ \
        migrations/ \
        tasks/ \
        2>/dev/null \
        | grep '^SUM' \
        | awk '{print $NF}') || true

    if [[ -z "$total_loc" ]]; then
        log info "No SUM line found for $tag, skipping"
        continue
    fi

    echo "$tag,$tag_date,$total_loc" >> "$output_file"
    log info "$tag,$tag_date,$total_loc"
done

if [[ -n "$latest_total_loc" ]]; then
    echo "latest,$tag_date,$latest_total_loc" >> "$output_file"
    log info "latest,$tag_date,$latest_total_loc"
else
    log info "No SUM line found for latest version, skipping"
fi

log info "Done. Results:"
echo ""
cat "$output_file"
