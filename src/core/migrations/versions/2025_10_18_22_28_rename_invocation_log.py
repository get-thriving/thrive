"""'Rename invocation log'

Revision ID: 7eec079687d5
Revises: d5a80aa0ed03
Create Date: 2025-10-18 22:28:40.175150

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "7eec079687d5"
down_revision = "d5a80aa0ed03"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.rename_table(
        "use_case_mutation_use_case_invocation_record", "mutation_invocation_record"
    )


def downgrade() -> None:
    pass
