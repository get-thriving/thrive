"""access grant

Revision ID: 3e81f2f3ae27
Revises: 3b055b83465c
Create Date: 2026-06-13 18:32:27.980031

"""

from alembic import op

revision = "3e81f2f3ae27"
down_revision = "3b055b83465c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE access_grant (
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
            principal VARCHAR NOT NULL,
            user_ref_id INTEGER NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (access_domain_ref_id) REFERENCES access_domain (ref_id)
        )
    """
    )

    op.execute(
        """
        CREATE INDEX ix_access_grant_access_domain_ref_id
            ON access_grant (access_domain_ref_id)
    """
    )

    op.execute(
        """
        CREATE INDEX ix_access_grant_entity
            ON access_grant (entity)
    """
    )

    op.execute(
        """
        CREATE UNIQUE INDEX uq_access_grant_domain_entity_principal_user
            ON access_grant (access_domain_ref_id, entity, principal, user_ref_id)
    """
    )


def downgrade() -> None:
    op.execute("DROP INDEX uq_access_grant_domain_entity_principal_user")
    op.execute("DROP INDEX ix_access_grant_entity")
    op.execute("DROP INDEX ix_access_grant_access_domain_ref_id")
    op.execute("DROP TABLE access_grant")
