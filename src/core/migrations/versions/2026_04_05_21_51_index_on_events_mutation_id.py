"""'Index on events mutation_id'

Revision ID: 6d29645b5809
Revises: 010b99ed22ec
Create Date: 2026-04-05 21:51:05.799340

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "6d29645b5809"
down_revision = "010b99ed22ec"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index(
        "ix_mutation_entity_event_mutation_id",
        "mutation_entity_event",
        ["mutation_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_mutation_entity_event_mutation_id",
        table_name="mutation_entity_event",
    )
