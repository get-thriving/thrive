"""'Add trace and mutation column to invocation record'

Revision ID: 28a8de5d87d5
Revises: ef40aa3c0902
Create Date: 2026-03-31 00:47:27.229577

"""

from alembic import op
import sqlalchemy as sa
import uuid


# revision identifiers, used by Alembic.
revision = "28a8de5d87d5"
down_revision = "ef40aa3c0902"
branch_labels = None
depends_on = None


def random_uuid():
    return str(uuid.uuid4())


def upgrade():
    with op.batch_alter_table("mutation_invocation_record") as batch_op:
        batch_op.add_column(sa.Column("trace_id", sa.String, nullable=True))
        batch_op.add_column(sa.Column("mutation_id", sa.String, nullable=True))

    # Backfill trace_id and mutation_id with uuidv4 where they're empty
    conn = op.get_bind()

    # Backfill trace_id
    result = conn.execute(
        sa.text(
            """
            SELECT rowid FROM mutation_invocation_record
            WHERE trace_id IS NULL OR trace_id = ''
            """
        )
    )

    rowids = [row[0] for row in result.fetchall()]
    for rowid in rowids:
        conn.execute(
            sa.text(
                "UPDATE mutation_invocation_record SET trace_id = :uuid WHERE rowid = :rowid"
            ),
            {"uuid": random_uuid(), "rowid": rowid},
        )

    # Backfill mutation_id
    result = conn.execute(
        sa.text(
            """
            SELECT rowid FROM mutation_invocation_record
            WHERE mutation_id IS NULL OR mutation_id = ''
            """
        )
    )
    rowids = [row[0] for row in result.fetchall()]
    for rowid in rowids:
        conn.execute(
            sa.text(
                "UPDATE mutation_invocation_record SET mutation_id = :uuid WHERE rowid = :rowid"
            ),
            {"uuid": random_uuid(), "rowid": rowid},
        )

    with op.batch_alter_table("mutation_invocation_record") as batch_op:
        batch_op.alter_column("trace_id", existing_type=sa.String, nullable=False)
        batch_op.alter_column("mutation_id", existing_type=sa.String, nullable=False)


def downgrade():
    pass
