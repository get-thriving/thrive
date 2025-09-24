#!/usr/bin/env bash

#MISE description="Lint the tasks"
#MISE sources=["tasks/**/*.sh"]
#MISE outputs = { auto = true }

set -ex

tree -fi tasks | grep '\.sh$' | xargs shellcheck --external-sources --shell=bash

