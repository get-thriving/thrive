"""'drop schedule external sync log name column'

Revision ID: 827af4282334
Revises: e8903716b712
Create Date: 2026-07-19 23:30:55.682721

ScheduleExternalSyncLog was promoted from BranchEntity to TrunkEntity (see
feature/some-wrap-ups-of-common). Trunk entities do not carry a name, but the
legacy `name` column remained NOT NULL on `schedule_external_sync_log`. Init
and create-workspace then fail inserting the entity; the repository maps every
IntegrityError to EntityAlreadyExistsError, so the symptom looks like a
duplicate row rather than a NOT NULL violation on `name`.

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "827af4282334"
down_revision = "e8903716b712"
branch_labels = None
depends_on = None


def _column_names(table: str) -> set[str]:
    inspector = sa.inspect(op.get_bind())
    return {column["name"] for column in inspector.get_columns(table)}


def upgrade() -> None:
    if "name" not in _column_names("schedule_external_sync_log"):
        return

    op.drop_column("schedule_external_sync_log", "name")


def downgrade() -> None:
    if "name" in _column_names("schedule_external_sync_log"):
        return

    op.execute(
        "ALTER TABLE schedule_external_sync_log "
        "ADD COLUMN name VARCHAR(64) NOT NULL DEFAULT 'NOT-USED'"
    )
