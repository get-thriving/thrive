"""Web UI settings use expanded rail.

Adds the `use_expanded_rail` preference, which makes the Strata icon rail wide
enough to show labels. Existing users keep the narrow rail.

Revision ID: 22901a2c66bf
Revises: e32c549b055a
Create Date: 2026-11-07 17:49:20.204407

"""

from alembic import op

revision = "22901a2c66bf"
down_revision = "e32c549b055a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE web_ui_settings
            ADD COLUMN use_expanded_rail BOOLEAN NOT NULL DEFAULT 0
    """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE web_ui_settings DROP COLUMN use_expanded_rail")
