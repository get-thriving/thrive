"""'Fixes for smart lists'

Revision ID: e3a68a179304
Revises: a09dc992dff3
Create Date: 2026-02-11 21:39:10.645385

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "e3a68a179304"
down_revision = "a09dc992dff3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE smart_list
        SET ref_id = ref_id + 10000
        """
    )
    op.execute(
        """
        UPDATE smart_list_tag
        SET smart_list_ref_id = smart_list_ref_id + 10000
        """
    )
    op.execute(
        """
        UPDATE smart_list_item
        SET smart_list_ref_id = smart_list_ref_id + 10000
        """
    )


def downgrade():
    pass
