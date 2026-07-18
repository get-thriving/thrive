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
            access_domain_ref_id INTEGER NOT NULL,
            entity VARCHAR NOT NULL,
            user_ref_id INTEGER NOT NULL,
            access_level VARCHAR NOT NULL,
            reason VARCHAR NOT NULL,
            access_grant_ref_id INTEGER NOT NULL,
            created_time TIMESTAMP WITH TIME ZONE NOT NULL,
            last_modified_time TIMESTAMP WITH TIME ZONE NOT NULL,
            PRIMARY KEY (access_domain_ref_id, entity, user_ref_id),
            FOREIGN KEY (access_domain_ref_id) REFERENCES access_domain (ref_id),
            FOREIGN KEY (access_grant_ref_id) REFERENCES access_grant (ref_id)
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
        CREATE INDEX ix_access_status_access_grant_ref_id
            ON access_status (access_grant_ref_id)
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_access_status_access_grant_ref_id")
    op.execute("DROP INDEX ix_access_status_user_entity")
    op.execute("DROP INDEX ix_access_status_access_domain_ref_id")
    op.execute("DROP TABLE access_status")
