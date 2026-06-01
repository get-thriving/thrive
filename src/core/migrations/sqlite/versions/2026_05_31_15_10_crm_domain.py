"""CRM domain.

Revision ID: cc2bee6de197
Revises: e7a2b9c4d1f0
Create Date: 2026-05-31 15:10:02.891541

"""

from alembic import op
from sqlalchemy import text

revision = "cc2bee6de197"
down_revision = "e7a2b9c4d1f0"
branch_labels = None
depends_on = None

_THE_CRM_DOMAIN_REF_ID = 1
_THE_CRM_DOMAIN_VERSION = 1
_THE_CRM_DOMAIN_CREATED_TIME = "2026-05-31 00:00:00.000000"


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE crm_domain (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            PRIMARY KEY (ref_id)
        )
    """
    )

    conn = op.get_bind()
    conn.execute(
        text(
            """
            INSERT INTO crm_domain (
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
                :created_time,
                :last_modified_time,
                :archived_time
            )
            """
        ),
        {
            "ref_id": _THE_CRM_DOMAIN_REF_ID,
            "version": _THE_CRM_DOMAIN_VERSION,
            "archived": False,
            "archival_reason": None,
            "created_time": _THE_CRM_DOMAIN_CREATED_TIME,
            "last_modified_time": _THE_CRM_DOMAIN_CREATED_TIME,
            "archived_time": None,
        },
    )


def downgrade() -> None:
    op.execute("DROP TABLE crm_domain")
