"""Web UI settings position keys o and p.

Moves the keys that go to the previous and the next item of a collection from
`[` and `]`, which are hard to type on some keyboards, to `o` and `p`, for the
users that still have the first ones: a key the user chose is left as it is.

Revision ID: 1cec8a112c4b
Revises: bbdc8def8a4e
Create Date: 2026-11-14 15:44:28.805475

"""

from alembic import op

revision = "1cec8a112c4b"
down_revision = "bbdc8def8a4e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE web_ui_settings
            SET key_bindings = json_set(key_bindings, '$."position-previous"', 'o')
            WHERE json_extract(key_bindings, '$."position-previous"') = '['
    """
    )
    op.execute(
        """
        UPDATE web_ui_settings
            SET key_bindings = json_set(key_bindings, '$."position-next"', 'p')
            WHERE json_extract(key_bindings, '$."position-next"') = ']'
    """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE web_ui_settings
            SET key_bindings = json_set(key_bindings, '$."position-previous"', '[')
            WHERE json_extract(key_bindings, '$."position-previous"') = 'o'
    """
    )
    op.execute(
        """
        UPDATE web_ui_settings
            SET key_bindings = json_set(key_bindings, '$."position-next"', ']')
            WHERE json_extract(key_bindings, '$."position-next"') = 'p'
    """
    )
