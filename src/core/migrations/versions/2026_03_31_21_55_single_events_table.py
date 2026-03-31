"""'Single events table'

Revision ID: 4041fd2425d2
Revises: 28a8de5d87d5
Create Date: 2026-03-31 21:55:40.351598

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "4041fd2425d2"
down_revision = "28a8de5d87d5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS mutation_entity_event (
            entity_type VARCHAR(48) NOT NULL,
            entity_ref_id INTEGER NOT NULL,
            entity_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            name VARCHAR(32) NOT NULL,
            trace_id VARCHAR(64) NOT NULL,
            mutation_id VARCHAR(64) NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            source VARCHAR(16) NOT NULL,
            context_str VARCHAR(32) NOT NULL,
            data JSON NOT NULL,
            PRIMARY KEY (
                entity_type,
                entity_ref_id,
                entity_version,
                kind,
                name,
                trace_id,
                mutation_id,
                timestamp,
                session_index
            )
        )
        """
    )

    op.create_index(
        "ix_mutation_entity_event_entity_type_entity_ref_id_timestamp",
        "mutation_entity_event",
        ["entity_type", "entity_ref_id", "timestamp"],
    )


def downgrade():
    pass
