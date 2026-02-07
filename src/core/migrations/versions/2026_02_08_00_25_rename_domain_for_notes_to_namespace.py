"""'Rename domain for notes to namespace'

Revision ID: d256a207ae11
Revises: bbc1bab20658
Create Date: 2026-02-08 00:25:45.317404

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd256a207ae11'
down_revision = 'bbc1bab20658'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("note") as batch_op:
        batch_op.alter_column("domain", new_column_name="namespace")


def downgrade() -> None:
    pass