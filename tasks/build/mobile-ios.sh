#!/usr/bin/env bash

set -ex

#MISE description="Build iOS mobile app"

# If the secrets/Config.secrets file does not exist, bail
if [ ! -f secrets/Config.secrets ]; then
    echo "secrets/Config.secrets file does not exist"
    exit 1
fi

source src/Config.global
# shellcheck disable=SC1091
source secrets/Config.secrets

export VERSION
export BUNDLE_ID
export PUBLIC_NAME

workspace="ios/App/App.xcworkspace"
scheme="App"
configuration="Release"
archive_path="../../.build-cache/mobile/ios/v${VERSION}/build.xcarchive"
export_options_plist="ios/App/archive.plist"
ipa_path="../../.build-cache/mobile/ios/v${VERSION}/build"

mkdir -p .build-cache/mobile

cd src/mobile

npx @capacitor/assets generate --iconBackgroundColor '#eeeeee' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#eeeeee' --splashBackgroundColorDark '#111111'  --ios --android
npx trapeze run config.yaml --diff
ENV=production HOSTING=hosted-global BUILD_TARGET=ios npx vite build --mode production --config vite.config.ts
ENV=production HOSTING=hosted-global BUILD_TARGET=ios npx cap copy

xcodebuild clean \
    -workspace "$workspace" \
    -scheme "$scheme" \
    -configuration "$configuration"

xcodebuild archive \
    -workspace "$workspace" \
    -scheme "$scheme" \
    -configuration "$configuration" \
    -archivePath "$archive_path" \
    -allowProvisioningUpdates


xcodebuild -exportArchive \
    -archivePath "$archive_path" \
    -exportOptionsPlist "$export_options_plist" \
    -exportPath "$ipa_path"

cp "$ipa_path/App.ipa" "$ipa_path/App-${VERSION}.ipa"
