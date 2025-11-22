#!/usr/bin/env bash

#MISE description="Build CLI standalone binary"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

set -e -o pipefail


source tasks/_common.sh

release_branch=$(git rev-parse --abbrev-ref HEAD)

if ! [[ "${release_branch}" =~ "release/" ]]
then
    release_version="current"
else
    release_version=${release_branch/release\/}
fi

platform=$(uname -s | awk '{print tolower($0)}')
arch=$(arch)

log info "Building CLI standalone binary for platform: $platform and architecture: $arch and release version: $release_version"

pyinstaller \
  --noconfirm \
  --name Thrive-Cli \
  --add-data src/cli/README.md:. \
  --add-data LICENSE:. \
  --add-data src/Config.global:. \
  --add-data src/cli/Config.project:. \
  --add-data src/core/migrations:core/migrations \
  --distpath .build-cache/standalone-binary/dist \
  --workpath .build-cache/standalone-binary/build \
  --windowed \
  --icon assets/jupiter.icns \
  src/cli/jupiter/cli/jupiter.py


log info "CLI generated at path: .build-cache/standalone-binary/dist/Thrive-Cli.app"

if [[ "${platform}" == "darwin" ]]
then
  dmg_image_name="jupiter-cli-${release_version}-${platform}-${arch}.dmg"

  log info "Creating DMG image for platform: $platform and architecture: $arch and release version: $release_version"

  rm -f rw.*.dmg
  rm -f "${dmg_image_name}"
  create-dmg \
    --volname "Thrive-Cli" \
    --volicon "assets/jupiter.icns" \
    --window-size 600 600 \
    --icon "Thrive-Cli.app" 40 40 \
    --hide-extension "Thrive-Cli.app" \
    --app-drop-link 200 160 \
    --eula LICENSE \
    --skip-jenkins \
    "${dmg_image_name}" \
    .build-cache/standalone-binary/dist/Thrive-Cli.app

  mv Thrive-Cli.spec ".build-cache/standalone-binary/Thrive-Cli.spec"
  mv "${dmg_image_name}" ".build-cache/standalone-binary/${dmg_image_name}"

  log info "DMG image created for at path: .build-cache/standalone-binary/${dmg_image_name}"
fi
