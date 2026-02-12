"""'Drop smart list item tags_ref_id'

Revision ID: 6c4b4a4e1b1d
Revises: f20d6a3b7b9c
Create Date: 2026-02-12 00:10:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "6c4b4a4e1b1d"
down_revision = "f20d6a3b7b9c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Smart list tags are superseded by generic tags (Tag/TagLink).
    # Remove the legacy column using Alembic's batch mode (SQLite-safe).
    with op.batch_alter_table("smart_list_item") as batch_op:
        batch_op.drop_column("tags_ref_id")


def downgrade() -> None:
    pass
