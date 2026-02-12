"""'Backfill note names'

Revision ID: 115a862cf5d0
Revises: 6c4b4a4e1b1d
Create Date: 2026-02-12 16:19:53.164523

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "115a862cf5d0"
down_revision = "6c4b4a4e1b1d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE note
        SET name = namespace || ' with id #' || source_entity_ref_id
        """
    )


def downgrade() -> None:
    pass
