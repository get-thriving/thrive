#!/usr/bin/env bash

set -ex

#MISE description="Generate a new database migration with Alembic"
#USAGE arg "[migration_name]" var=#true help="The name of the migration (will be slugified)"

: "${usage_migration_name:=}"

# Run Alembic revision command
poetry run alembic -c src/core/migrations/alembic.ini revision -m "$usage_migration_name"
