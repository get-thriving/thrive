#!/usr/bin/env bash

set -ex

#MISE description="Adjust distribution status for release platforms"
#USAGE arg "<version>" required help="Release version (X.Y.Z format)"
#USAGE flag "--mac-store <status>" help="Mac Store status (ready|in-review|not-available)"
#USAGE flag "--app-store <status>" help="App Store status (ready|in-review|not-available)"
#USAGE flag "--mac-web <status>" help="Mac Web status (ready|in-review|not-available)"
#USAGE flag "--google-play-store <status>" help="Google Play Store status (ready|in-review|not-available)"

: "${usage_version:=}"
: "${usage_mac_store:=do-nothing}"
: "${usage_app_store:=do-nothing}"
: "${usage_mac_web:=do-nothing}"
: "${usage_google_play_store:=do-nothing}"

mac_web_status="${usage_mac_web}"
mac_store_status="${usage_mac_store}"
app_store_status="${usage_app_store}"
google_play_store_status="${usage_google_play_store}"

if ! [[ "${usage_version}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
    echo "Not a valid X.Y.Z version string"
    exit 1
fi

release_tag="v${usage_version}"

if ! [[ $(git tag | grep "${release_tag}") ]]
then
    echo "Release tag ${usage_version} seems to not exist"
    exit 1
fi

# if MAC_WEB status is not one of do-nothing ready in-review not-available, bail
if ! [[ "${mac_web_status}" =~ ^(do-nothing|ready|in-review|not-available)$ ]]
then
    echo "Invalid MAC_WEB_STATUS. Should be one of do-nothing, ready, in-review, not-available"
    exit 1
fi

# if MAC_STORE status is not one of do-nothing ready in-review not-available, bail
if ! [[ "${mac_store_status}" =~ ^(do-nothing|ready|in-review|not-available)$ ]]
then
    echo "Invalid MAC_STORE_STATUS. Should be one of do-nothing, ready, in-review, not-available"
    exit 1
fi

# if APP_STORE status is not one of do-nothing ready in-review not-available, bail
if ! [[ "${app_store_status}" =~ ^(do-nothing|ready|in-review|not-available)$ ]]
then
    echo "Invalid APP_STORE_STATUS. Should be one of do-nothing, ready, in-review, not-available"
    exit 1
fi

# if GOOGLE_PLAY_STORE status is not one of do-nothing ready in-review not-available, bail
if ! [[ "${google_play_store_status}" =~ ^(do-nothing|ready|in-review|not-available)$ ]]
then
    echo "Invalid GOOGLE_PLAY_STORE_STATUS. Should be one of do-nothing, ready, in-review, not-available"
    exit 1
fi

mkdir -p .build-cache/release/${usage_version}

current_manifest_url=$(gh release view ${release_tag} --json assets | jq -r '.assets[] | select(.name == "release-manifest.json") | .url')

if [ -z "$current_manifest_url" ]
then
    cp scripts/release/release-manifest.template.json .build-cache/release/${usage_version}/current-release-manifest.json
else
    curl -L $current_manifest_url > .build-cache/release/${usage_version}/current-release-manifest.json
fi

jq --arg mac_web_status "$mac_web_status" \
    --arg mac_store_status "$mac_store_status" \
    --arg app_store_status "$app_store_status" \
    --arg google_play_store_status "$google_play_store_status" \
    'if $mac_web_status != "do-nothing" then .["mac-web"] = $mac_web_status else . end |
     if $mac_store_status != "do-nothing" then .["mac-store"] = $mac_store_status else . end |
     if $app_store_status != "do-nothing" then .["app-store"] = $app_store_status else . end |
     if $google_play_store_status != "do-nothing" then .["google-play-store"] = $google_play_store_status else . end' \
    .build-cache/release/${usage_version}/current-release-manifest.json > .build-cache/release/${usage_version}/release-manifest.json

gh release upload ${release_tag} --clobber .build-cache/release/${usage_version}/release-manifest.json
