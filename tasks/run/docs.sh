#!/usr/bin/env bash

set -ex

#MISE description="Run documentation server"

source src/Config.global

export PUBLIC_NAME
export AUTHOR
export COPYRIGHT

cd src/docs && mkdocs serve
