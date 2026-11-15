"""Web UI settings key bindings.

Adds the `key_bindings` preference: for each keyboard action of the Strata
layout, the key or combination of keys the user chose for it. Existing users
get the defaults, which are the keys that were hard-coded before.

Revision ID: fc0a32666d94
Revises: 9f198936443f
Create Date: 2026-11-14 11:58:58.887229

"""

from alembic import op

revision = "fc0a32666d94"
down_revision = "9f198936443f"
branch_labels = None
depends_on = None

_DEFAULT_KEY_BINDINGS = '{"column-previous": "h", "column-next": "l", "next": "j", "previous": "k", "open": "Enter", "edit": "e", "collapse": "z", "split": "c", "fold-back": "Shift+c", "hints": "s", "map": "a", "find": "f", "position-previous": "[", "position-next": "]", "scroll-top": "Shift+k", "scroll-bottom": "Shift+j", "menu": ".", "close": "Escape"}'


def upgrade() -> None:
    op.execute(
        f"""
        ALTER TABLE web_ui_settings
            ADD COLUMN key_bindings JSON NOT NULL DEFAULT '{_DEFAULT_KEY_BINDINGS}'
    """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE web_ui_settings DROP COLUMN key_bindings")
