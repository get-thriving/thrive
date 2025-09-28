#!/usr/bin/env bash

set -e -o pipefail

#MISE description="Generate a new database migration with Alembic"
#USAGE arg "[migration_name]" var=#true help="The name of the migration (will be slugified)"
#USAGE flag "--log <log>" default="info" help="Log output" {
#USAGE   choices "info" "debug" "trace"
#USAGE }

: "${usage_migration_name:=}"

# Run Alembic revision command
poetry run alembic -c src/core/migrations/alembic.ini revision -m "$usage_migration_name"
