#!/usr/bin/env bash

#MISE description="Build iOS mobile app"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail

source tasks/_common.sh

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

log info "Generating iOS mobile app"

npx @capacitor/assets generate --iconBackgroundColor '#eeeeee' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#eeeeee' --splashBackgroundColorDark '#111111'  --ios --android
npx trapeze run config.yaml --diff
ENV=production BUILD_TARGET=ios npx vite build --mode production --config vite.config.ts
ENV=production BUILD_TARGET=ios npx cap copy

log info "Building iOS mobile app"

(cd ios/App && pod install)

xcodebuild clean \
    -workspace "$workspace" \
    -scheme "$scheme" \
    -configuration "$configuration"

log info "Archiving iOS mobile app"

xcodebuild archive \
    -workspace "$workspace" \
    -scheme "$scheme" \
    -configuration "$configuration" \
    -archivePath "$archive_path" \
    -allowProvisioningUpdates

log info "Exporting iOS mobile app"

xcodebuild -exportArchive \
    -archivePath "$archive_path" \
    -exportOptionsPlist "$export_options_plist" \
    -exportPath "$ipa_path" \
    -allowProvisioningUpdates

cp "$ipa_path/App.ipa" "$ipa_path/App-${VERSION}.ipa"

log info "iOS mobile app exported in .build-cache/mobile/ios/v${VERSION}/build/App-${VERSION}.ipa"
