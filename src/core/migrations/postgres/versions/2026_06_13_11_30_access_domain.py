"""access domain

Revision ID: 3b055b83465c
Revises: bd0eef3634c2
Create Date: 2026-06-13 11:30:56.990717

"""

from alembic import op
from sqlalchemy import text

revision = "3b055b83465c"
down_revision = "bd0eef3634c2"
branch_labels = None
depends_on = None

_THE_ACCESS_DOMAIN_REF_ID = 1
_THE_ACCESS_DOMAIN_VERSION = 1


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE access_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time TIMESTAMP NOT NULL,
            last_modified_time TIMESTAMP NOT NULL,
            archived_time TIMESTAMP,
            PRIMARY KEY (ref_id)
        )
    """
    )

    conn = op.get_bind()
    conn.execute(
        text(
            """
            INSERT INTO access_domain (
                ref_id,
                version,
                archived,
                archival_reason,
                created_time,
                last_modified_time,
                archived_time
            )
            VALUES (
                :ref_id,
                :version,
                :archived,
                :archival_reason,
                TIMESTAMP '2026-06-13 00:00:00.000000',
                TIMESTAMP '2026-06-13 00:00:00.000000',
                NULL
            )
            """
        ),
        {
            "ref_id": _THE_ACCESS_DOMAIN_REF_ID,
            "version": _THE_ACCESS_DOMAIN_VERSION,
            "archived": False,
            "archival_reason": None,
        },
    )


def downgrade() -> None:
    op.execute("DROP TABLE access_domain")
