#!/usr/bin/env bash

set -ex

#MISE description="Upload Android app to Google Play Store"
#USAGE arg "<version>" required help="Release version (X.Y.Z format)"

: "${usage_version:=}"

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

source src/Config.global
source secrets/Config.secrets

export GOOGLE_APPLICATION_CREDENTIALS=./secrets/play-store-bundle-uploader-key.json

access_token=$(gcloud auth application-default print-access-token --scopes=https://www.googleapis.com/auth/androidpublisher)

# Start the edit

edit_id=$(curl -X POST \
    -H "Authorization: Bearer $access_token" \
    -H "Content-Type: application/json" \
    https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${BUNDLE_ID}/edits | jq -r '.id')

# Upload the bundle

curl -X POST \
    -T .build-cache/mobile/android/v"${usage_version}"/app-"${usage_version}".aab \
    -H "Authorization: Bearer $access_token" \
    -H "Content-Type: application/octet-stream" \
    "https://androidpublisher.googleapis.com/upload/androidpublisher/v3/applications/${BUNDLE_ID}/edits/${edit_id}/bundles"

# Close the edit

curl -X POST \
    -H "Authorization: Bearer $access_token" \
    https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${BUNDLE_ID}/edits/"${edit_id}":commit
