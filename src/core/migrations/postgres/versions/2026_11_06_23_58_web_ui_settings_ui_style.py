"""Web UI settings ui style.

Adds the `ui_style` preference, which picks between the classic look and
Strata. Existing users keep the classic look.

Revision ID: 66ec3fc57fcf
Revises: e32c549b055a
Create Date: 2026-11-06 23:58:40.214615

"""

from alembic import op

revision = "66ec3fc57fcf"
down_revision = "e32c549b055a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE web_ui_settings
            ADD COLUMN ui_style VARCHAR NOT NULL DEFAULT 'classic'
    """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE web_ui_settings DROP COLUMN ui_style")
