#!/usr/bin/env bash

set -ex

#MISE description="Upload release to GitHub with optional platform flags"
#USAGE arg "<version>" required help="Release version (X.Y.Z format)"
#USAGE complete "version" run="./tasks/release/list.sh"
#USAGE flag "--desktop-macos" help="Include desktop macOS builds"
#USAGE flag "--mobile-ios" help="Include mobile iOS builds"
#USAGE flag "--mobile-android" help="Include mobile Android builds"

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

echo "Uploading release ${usage_version} to GitHub with desktop-macos=${desktop_macos}, mobile-ios=${mobile_ios}, mobile-android=${mobile_android}"

if ! [[ "${usage_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
    echo "Not a valid X.Y.Z version string"
    exit 1
fi

release_tag="v${usage_version}"

if git tag | grep -q "${release_tag}"
then
    echo "Release tag ${usage_version} seems to not exist"
    exit 1
fi

release_notes_path="src/docs/material/releases/version-${usage_version}.md"

# if the release notes file does not exist, bail
if [ ! -f "${release_notes_path}" ]; then
    echo "Release notes file does not exist"
    exit 1
fi

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
     end' scripts/release/release-manifest.template.json > .build-cache/release/"${usage_version}"/release-manifest.json

gh release create "${release_tag}" --draft --verify-tag --title "v${usage_version}" --notes-file "${release_notes_path}"

gh release upload "${release_tag}" --clobber .build-cache/release/"${usage_version}"/release-manifest.json

if [ ! -f .build-cache/cloc/"${usage_version}"/cloc.txt ]; then
    echo "Cloc file does not exist"
    exit 1
fi

gh release upload "${release_tag}" --clobber .build-cache/cloc/"${usage_version}"/cloc.txt

if [ "${desktop_macos}" = true ]; then
    # if the releases don't exist
    if [ ! -f .build-cache/desktop/make/Thrive-"${usage_version}"-universal.pkg ] || [ ! -f .build-cache/desktop/make/Thrive-"${usage_version}"-universal.dmg ]; then
        echo "Desktop macOS releases do not exist"
        exit 1
    fi

    gh release upload "${release_tag}" --clobber .build-cache/desktop/make/Thrive-"${usage_version}"-universal.pkg
    gh release upload "${release_tag}" --clobber .build-cache/desktop/make/Thrive-"${usage_version}"-universal.dmg
fi

if [ "${mobile_ios}" = true ]; then
    if [ ! -f .build-cache/mobile/ios/v"${usage_version}"/build/App-"${usage_version}".ipa ]; then
        echo "iOS release does not exist"
        exit 1
    fi

    gh release upload "${release_tag}" --clobber .build-cache/mobile/ios/v"${usage_version}"/build/App-"${usage_version}".ipa
fi

if [ "${mobile_android}" = true ]; then
    if [ ! -f .build-cache/mobile/android/v"${usage_version}"/build/Thrive-"${usage_version}".apk ]; then
        echo "Android release does not exist"
        exit 1
    fi

    gh release upload "${release_tag}" --clobber .build-cache/mobile/android/v"${usage_version}"/build/app-"${usage_version}".aab
fi

gh release upload "${release_tag}" --clobber infra/self-hosted/compose.yaml
gh release upload "${release_tag}" --clobber infra/self-hosted/nginx.conf
gh release upload "${release_tag}" --clobber infra/self-hosted/webui.conf
gh release upload "${release_tag}" --clobber infra/self-hosted/webui.nodomain.conf

gh release edit "${release_tag}" --draft=false
