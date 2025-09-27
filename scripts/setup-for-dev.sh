#!/bin/bash

set -ex

# Prepare environment

# Assume brew, JDK, Android Studio, XCode, and Docker are already present.
# Will modify globals nonetheless.

curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
mise use -g usage
mise install

mise run --jobs=1 install
mise run prepare
