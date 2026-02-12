"""'Drop smart list tag tables'

Revision ID: f20d6a3b7b9c
Revises: e0140eec1788
Create Date: 2026-02-12 00:01:00.000000

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "f20d6a3b7b9c"
down_revision = "e0140eec1788"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Smart list tags (SmartListTag) are superseded by generic tags (Tag/TagLink).
    # Remove the old tables.
    op.execute("""DROP TABLE IF EXISTS smart_list_tag_event""")
    op.execute("""DROP TABLE IF EXISTS smart_list_tag""")
    op.execute("""DROP INDEX IF EXISTS ix_smart_list_tag_smart_list_ref_id""")


def downgrade() -> None:
    pass
