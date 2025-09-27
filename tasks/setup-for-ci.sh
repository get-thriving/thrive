#!/bin/bash

set -ex

#MISE description="Setup for CI"
#MISE hide=true

# Prepare environment

curl https://mise.run | sh
mise use -g usage
mise install

mise run --jobs=1 install
mise run prepare