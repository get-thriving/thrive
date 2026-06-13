"""access status

Revision ID: 538c815a20b5
Revises: 3e81f2f3ae27
Create Date: 2026-06-13 18:47:37.068669

"""

from alembic import op

revision = "538c815a20b5"
down_revision = "3e81f2f3ae27"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE access_status (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            access_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(255) NOT NULL,
            entity VARCHAR NOT NULL,
            access_level VARCHAR NOT NULL,
            user_ref_id INTEGER NOT NULL,
            reason VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (access_domain_ref_id) REFERENCES access_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_access_status_access_domain_ref_id
            ON access_status (access_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_access_status_user_entity
            ON access_status (user_ref_id, entity)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX uq_access_status_domain_entity_user
            ON access_status (access_domain_ref_id, entity, user_ref_id)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX uq_access_status_domain_entity_user")
    op.execute("DROP INDEX ix_access_status_user_entity")
    op.execute("DROP INDEX ix_access_status_access_domain_ref_id")
    op.execute("DROP TABLE access_status")
