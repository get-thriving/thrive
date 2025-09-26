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

(cd gen/ts/webapi-client && npx tsc)

mise run --jobs=1 install
