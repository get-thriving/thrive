#!/usr/bin/env bash

#MISE description="Build Android mobile app"
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

aab_output_path="app/build/outputs/bundle/release"

export VERSION
export BUNDLE_ID
export PUBLIC_NAME

mkdir -p .build-cache/mobile

cd src/mobile

log info "Generating Android mobile app"

npx @capacitor/assets generate --iconBackgroundColor '#eeeeee' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#eeeeee' --splashBackgroundColorDark '#111111'  --ios --android
npx trapeze run config.yaml --diff
ENV=production HOSTING=hosted-global BUILD_TARGET=android npx vite build --mode production --config vite.config.ts
ENV=production HOSTING=hosted-global BUILD_TARGET=android npx cap copy

cd android

log info "Building Android mobile app"

./gradlew clean
./gradlew assembleRelease
./gradlew bundleRelease

log info "Signing Android mobile app"

jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore "../../../$ANDROID_UPLOAD_KEYSTORE_PATH" \
  -storepass "$ANDROID_UPLOAD_KEYSTORE_PASSWORD" \
  -keypass "$ANDROID_UPLOAD_KEYSTORE_PASSWORD" \
  "$aab_output_path/app-release.aab" \
  "$ANDROID_UPLOAD_KEYSTORE_ALIAS"

mkdir -p "../../../.build-cache/mobile/android/v$VERSION"
cp "$aab_output_path/app-release.aab" "../../../.build-cache/mobile/android/v$VERSION/app-${VERSION}.aab"

log info "Android mobile app signed in .build-cache/mobile/android/v$VERSION/app-${VERSION}.aab"