"""location link multiple locations

Revision ID: c3d4e5f6a7b8
Revises: a1b2c3d4e5f6
Create Date: 2026-09-02 07:42:00.000000

"""

from alembic import op

revision = "c3d4e5f6a7b8"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE location_link
            ADD COLUMN locations_ref_ids JSONB NOT NULL DEFAULT '[]'::jsonb
        """
    )
    op.execute(
        """
        UPDATE location_link
        SET locations_ref_ids = jsonb_build_array(location_ref_id)
        WHERE location_ref_id IS NOT NULL
        """
    )
    op.execute("ALTER TABLE location_link DROP COLUMN location_ref_id")


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE location_link
            ADD COLUMN location_ref_id INTEGER
        """
    )
    op.execute(
        """
        UPDATE location_link
        SET location_ref_id = (locations_ref_ids->>0)::integer
        WHERE jsonb_array_length(locations_ref_ids) > 0
        """
    )
    op.execute("ALTER TABLE location_link DROP COLUMN locations_ref_ids")
