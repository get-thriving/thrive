"""'Add source field to mutation_invocation_record'

Revision ID: 338cd79a9bb0
Revises: 6d29645b5809
Create Date: 2026-04-05 21:59:52.394330

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '338cd79a9bb0'
down_revision = '6d29645b5809'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("mutation_invocation_record") as batch_op:
        batch_op.add_column(sa.Column("source", sa.String, nullable=True))

    op.execute(
        "UPDATE mutation_invocation_record SET source = 'unknown' WHERE source IS NULL"
    )

    with op.batch_alter_table("mutation_invocation_record") as batch_op:
        batch_op.alter_column("source", nullable=False)


def downgrade():
    with op.batch_alter_table("mutation_invocation_record") as batch_op:
        batch_op.drop_column("source")
