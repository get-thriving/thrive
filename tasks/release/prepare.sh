#!/usr/bin/env bash

#MISE description="Prepare a new release"
#USAGE arg "<version>" required help="Release version (X.Y.Z format)"
#USAGE complete "version" run="./tasks/release/list.sh"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

: "${usage_version:=}"

echo "Usage version: ${usage_version}"

if ! [[ "${usage_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
    echo "Not a valid X.Y.Z version string"
    exit 1
fi

release_tag="v${usage_version}"
release_branch="release/"v${usage_version}""

# shellcheck disable=SC2143
if [[ $(git tag | grep "${release_tag}") ]]
then
    echo "Release ${usage_version} seems to already exist"
    exit 1
fi

if [[ $(git rev-parse --abbrev-ref HEAD) != develop ]]
then
    echo "Must be on the develop branch"
    exit 1
fi

release_notes_path="src/docs/material/releases/version-${usage_version}.md"
release_date=$(date +"%Y/%m/%d")

git pull
git checkout -b "${release_branch}"
sed -E "s/VERSION=.+/VERSION=${usage_version}/g" < src/Config.global > src/Config.global.bak
mv src/Config.global.bak src/Config.global
cp scripts/release/template.md "${release_notes_path}"
sed -i "" -E "s/{{release_version}}/${usage_version}/g" "${release_notes_path}"
sed -i "" -E "s|{{release_date}}|${release_date}|g" "${release_notes_path}"
git add "${release_notes_path}"
