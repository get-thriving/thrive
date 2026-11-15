"""Web UI settings drop use night mode.

Drops the `use_night_mode` preference. The web app is dark-only now, so nothing
reads it.

Revision ID: 9f198936443f
Revises: 22901a2c66bf
Create Date: 2026-11-10 00:20:53.803711

"""

from alembic import op

revision = "9f198936443f"
down_revision = "22901a2c66bf"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE web_ui_settings DROP COLUMN use_night_mode")


def downgrade() -> None:
    op.execute(
        """
        ALTER TABLE web_ui_settings
            ADD COLUMN use_night_mode BOOLEAN NOT NULL DEFAULT false
    """
    )
