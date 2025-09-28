#!/bin/bash

set -e -o pipefail

#MISE description="Setup for development"
#MISE hide=true

# Prepare environment

# Assume brew, JDK, Android Studio, XCode, and Docker are already present.
# Will modify globals nonetheless.

curl https://mise.run | sh
# shellcheck disable=SC2016
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
mise use -g usage
mise install

mise run --jobs=1 install
mise run prepare
