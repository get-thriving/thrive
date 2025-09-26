#!/bin/bash

set -ex

# Prepare environment

# Assume brew, JDK, Android Studio, XCode, and Docker are already present.
# Will modify globals nonetheless.

curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
mise use -g usage
mise install

mkdir -p .build-cache
python3 -m venv .build-cache/venv
source .build-cache/venv/bin/activate

brew bundle

docker pull hadolint/hadolint:latest-debian

bundle install

poetry install --no-interaction --no-ansi
(cd src/core && poetry install --no-interaction --no-ansi)
(cd src/cli && poetry install --no-interaction --no-ansi)
(cd src/webapi && poetry install --no-interaction --no-ansi)
(cd src/docs && poetry install --no-interaction --no-ansi)
(cd itests && poetry install --no-interaction --no-ansi)

npm install --no-save
(cd src/desktop && npm install --no-save)
(cd src/mobile && npm install --no-save)

playwright install

(cd gen/ts/webapi-client && npx tsc)
