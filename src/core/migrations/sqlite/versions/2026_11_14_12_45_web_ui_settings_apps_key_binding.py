"""Web UI settings apps key binding.

Adds the `apps` keyboard action, which opens the menu of apps and pages, to the
`key_bindings` of every user, on `q`.

Revision ID: aaa00e8ede99
Revises: fc0a32666d94
Create Date: 2026-11-14 12:45:02.114833

"""

from alembic import op

revision = "aaa00e8ede99"
down_revision = "fc0a32666d94"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "UPDATE web_ui_settings SET key_bindings = json_set(key_bindings, '$.apps', 'q')"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE web_ui_settings SET key_bindings = json_remove(key_bindings, '$.apps')"
    )
