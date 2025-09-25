#!/usr/bin/env bash

set -ex

#MISE description="Upload iOS app to Apple App Store"
#USAGE arg "<version>" required help="Release version (X.Y.Z format)"
#USAGE complete "version" run="./tasks/release/list.sh"

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

source secrets/Config.secrets

xcrun altool --validate-app -f .build-cache/mobile/ios/v"${usage_version}"/build/App.ipa --username $APPLE_ID --password $APPLE_NOTARIZATION_PASSWORD --type ios
xcrun altool --upload-app -f .build-cache/mobile/ios/v"${usage_version}"/build/App.ipa --type ios --username $APPLE_ID --password $APPLE_NOTARIZATION_PASSWORD
