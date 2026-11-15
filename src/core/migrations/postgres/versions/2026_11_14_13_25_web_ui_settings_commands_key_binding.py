"""Web UI settings commands key binding.

Adds the `commands` keyboard action, which opens the menu of the actions of a
column, to the `key_bindings` of every user, on `x`.

Revision ID: bbdc8def8a4e
Revises: aaa00e8ede99
Create Date: 2026-11-14 13:25:49.901778

"""

from alembic import op

revision = "bbdc8def8a4e"
down_revision = "aaa00e8ede99"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE web_ui_settings
            SET key_bindings = key_bindings || '{"commands": "x"}'::jsonb
    """
    )


def downgrade() -> None:
    op.execute("UPDATE web_ui_settings SET key_bindings = key_bindings - 'commands'")
