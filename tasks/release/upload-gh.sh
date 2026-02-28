#!/usr/bin/env bash

#MISE description="Upload release to GitHub with optional platform flags"
#USAGE arg "<version>" required help="Release version (X.Y.Z format)"
#USAGE complete "version" run="./tasks/release/list.sh"
#USAGE flag "--desktop-macos" help="Include desktop macOS builds"
#USAGE flag "--mobile-ios" help="Include mobile iOS builds"
#USAGE flag "--mobile-android" help="Include mobile Android builds"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

: "${usage_version:=}"
: "${usage_desktop_macos:=}"
: "${usage_mobile_ios:=}"
: "${usage_mobile_android:=}"

desktop_macos=false
mobile_ios=false
mobile_android=false

if [[ "${usage_desktop_macos}" == "true" ]]; then
    desktop_macos=true
fi

if [[ "${usage_mobile_ios}" == "true" ]]; then
    mobile_ios=true
fi

if [[ "${usage_mobile_android}" == "true" ]]; then
    mobile_android=true
fi

if ! [[ "${usage_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
    log info "Not a valid X.Y.Z version string"
    exit 1
fi

release_tag="v${usage_version}"

if ! git tag | grep -q "^${release_tag}$"
then
    log info "Release tag ${usage_version} seems to not exist"
    exit 1
fi

release_notes_path="src/docs/material/releases/version-${usage_version}.md"

# if the release notes file does not exist, bail
if [ ! -f "${release_notes_path}" ]; then
    log info "Release notes file does not exist"
    exit 1
fi

log info "Uploading release ${usage_version} to GitHub with desktop-macos=${desktop_macos}, mobile-ios=${mobile_ios}, mobile-android=${mobile_android}"

rm -rf .build-cache/release/"${usage_version}"
mkdir -p .build-cache/release/"${usage_version}"

jq --arg desktop_macos "$desktop_macos" \
    --arg mobile_ios "$mobile_ios" \
    --arg mobile_android "$mobile_android" \
    'if $desktop_macos == "true" then 
          .["mac-web"] = "ready" | .["mac-store"] = "in-review" 
     else 
          .["mac-web"] = "not-available" | .["mac-store"] = "not-available" 
     end |
     if $mobile_ios == "true" then 
          .["app-store"] = "in-review" 
     else 
          .["app-store"] = "not-available" 
     end |
     if $mobile_android == "true" then 
          .["google-play-store"] = "in-review" 
     else 
          .["google-play-store"] = "not-available" 
     end' tasks/release/release-manifest.template.json > .build-cache/release/"${usage_version}"/release-manifest.json

log info "Creating release ${usage_version} on GitHub"

gh release create "${release_tag}" --draft --verify-tag --title "v${usage_version}" --notes-file "${release_notes_path}"

log info "Uploading release manifest ${usage_version} on GitHub"

gh release upload "${release_tag}" --clobber .build-cache/release/"${usage_version}"/release-manifest.json

if [ ! -f .build-cache/cloc/"${usage_version}"/cloc.txt ]; then
    log info "Cloc file does not exist"
    exit 1
fi

gh release upload "${release_tag}" --clobber .build-cache/cloc/"${usage_version}"/cloc.txt

if [ ! -f .build-cache/cloc/"${usage_version}"/stats-over-time.csv ]; then
    log info "Stats over time file does not exist"
    exit 1
fi

gh release upload "${release_tag}" --clobber .build-cache/cloc/"${usage_version}"/stats-over-time.csv

if [ "${desktop_macos}" = true ]; then
    log info "Uploading desktop macOS releases ${usage_version} on GitHub"

    # if the releases don't exist
    if [ ! -f ".build-cache/desktop/mac-store/v${usage_version}/make/Thrive-${usage_version}-universal.pkg" ] || [ ! -f ".build-cache/desktop/mac-web/v${usage_version}/make/Thrive-${usage_version}-universal.dmg" ]; then
        log info "Desktop macOS releases do not exist"
        exit 1
    fi

    gh release upload "${release_tag}" --clobber ".build-cache/desktop/mac-store/v${usage_version}/make/Thrive-${usage_version}-universal.pkg"
    gh release upload "${release_tag}" --clobber ".build-cache/desktop/mac-web/v${usage_version}/make/Thrive-${usage_version}-universal.dmg"
fi

if [ "${mobile_ios}" = true ]; then
    log info "Uploading iOS releases ${usage_version} on GitHub"

    if [ ! -f .build-cache/mobile/ios/v"${usage_version}"/build/App-"${usage_version}".ipa ]; then
        log info "iOS release does not exist"
        exit 1
    fi

    gh release upload "${release_tag}" --clobber .build-cache/mobile/ios/v"${usage_version}"/build/App-"${usage_version}".ipa
fi

if [ "${mobile_android}" = true ]; then
    log info "Uploading Android releases ${usage_version} on GitHub"

    if [ ! -f .build-cache/mobile/android/v"${usage_version}"/app-"${usage_version}".aab ]; then
        log info "Android release does not exist"
        exit 1
    fi

    gh release upload "${release_tag}" --clobber .build-cache/mobile/android/v"${usage_version}"/app-"${usage_version}".aab
fi

log info "Uploading self-hosted files ${usage_version} on GitHub"

gh release upload "${release_tag}" --clobber infra/self-hosted/compose.yaml
gh release upload "${release_tag}" --clobber infra/self-hosted/nginx.conf
gh release upload "${release_tag}" --clobber infra/self-hosted/webui.conf
gh release upload "${release_tag}" --clobber infra/self-hosted/webui.nodomain.conf

log info "Uploading docker images ${usage_version} on GitHub"

for service in webapi api webui docs cli; do
    for platform in arm64 amd64; do
        image_name="jupiter/${service}:${usage_version}-${platform}"
        tar_name="${service}-${platform}.tar"
        tar_path=".build-cache/release/${usage_version}/${tar_name}"

        log info "Saving docker image ${image_name} to ${tar_path}"
        docker save -o "${tar_path}" "${image_name}"

        log info "Uploading docker image ${tar_name} on GitHub"
        gh release upload "${release_tag}" --clobber "${tar_path}"
    done
done

log info "Closing release"

gh release edit "${release_tag}" --draft=false
