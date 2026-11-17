"""Web UI settings color scheme.

Adds the `color_scheme` preference, which picks between the light and dark
themes, or the one the device uses. Existing users get the device's, which for
them is as good as the dark theme they had.

Revision ID: 9f0754d464ec
Revises: c7575c9cff95
Create Date: 2026-11-15 16:39:51.743211

"""

from alembic import op

revision = "9f0754d464ec"
down_revision = "c7575c9cff95"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE web_ui_settings
            ADD COLUMN color_scheme VARCHAR NOT NULL DEFAULT 'system'
    """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE web_ui_settings DROP COLUMN color_scheme")
