"""Web UI settings new key binding.

Adds the `new` keyboard action, which opens the menu for creating an item of any
kind, to the `key_bindings` of every user, on `n`.

Revision ID: c7575c9cff95
Revises: 1cec8a112c4b
Create Date: 2026-11-14 16:20:33.614120

"""

from alembic import op

revision = "c7575c9cff95"
down_revision = "1cec8a112c4b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE web_ui_settings
            SET key_bindings = json_set(key_bindings, '$.new', 'n')
    """
    )


def downgrade() -> None:
    op.execute(
        "UPDATE web_ui_settings SET key_bindings = json_remove(key_bindings, '$.new')"
    )
