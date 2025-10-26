"""'Rethink invocation log'

Revision ID: d5a80aa0ed03
Revises: 2bc999bd0f90
Create Date: 2025-10-18 21:48:47.154266

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d5a80aa0ed03"
down_revision = "2bc999bd0f90"
branch_labels = None
depends_on = None


def upgrade() -> None:
    naming_convention = {
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }

    # Add the context_str column
    with op.batch_alter_table(
        "use_case_mutation_use_case_invocation_record",
        naming_convention=naming_convention,
    ) as batch_op:
        batch_op.add_column(sa.Column("context_str", sa.String, nullable=True))

    # Build the contex_str column
    op.execute(
        """
        UPDATE use_case_mutation_use_case_invocation_record SET context_str = 'guest' WHERE user_ref_id IS NULL OR workspace_ref_id IS NULL;
        """
    )
    op.execute(
        """
        UPDATE use_case_mutation_use_case_invocation_record SET context_str = 'user:' || user_ref_id || '+workspace:' || workspace_ref_id WHERE user_ref_id IS NOT NULL AND workspace_ref_id IS NOT NULL;
        """
    )

    # Drop the user_ref_id and workspace_ref_id columns
    with op.batch_alter_table(
        "use_case_mutation_use_case_invocation_record",
        naming_convention=naming_convention,
    ) as batch_op:
        batch_op.drop_column("user_ref_id")
        batch_op.drop_column("workspace_ref_id")
        batch_op.alter_column("context_str", nullable=False)

    # Create an index on the context_str column
    op.execute(
        """
        CREATE INDEX ix_use_case_mutation_use_case_invocation_record_context_str_timestamp_name ON use_case_mutation_use_case_invocation_record (context_str, timestamp, name);
        """
    )


def downgrade() -> None:
    pass
