"""'Backfill tag domain'

Revision ID: a09dc992dff3
Revises: a30c99ae2b0e
Create Date: 2026-02-08 14:50:03.040922

"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "a09dc992dff3"
down_revision = "a30c99ae2b0e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        INSERT INTO tag_domain
               SELECT
                   ref_id as ref_id,
                   1 as version,
                   archived as archived,
                   archival_reason as archival_reason,
                   created_time as created_time,
                   last_modified_time as last_modified_time,
                   archived_time as archived_time,
                   ref_id as workspace_ref_id
               FROM workspace;
        """
    )
    op.execute(
        """
        INSERT INTO tag_domain_event
               SELECT
                   ref_id as owner_ref_id,
                   created_time as timestamp,
                   0 as session_index,
                   'Created' as name,
                   'Cli' as source,
                   1 as owner_version,
                   'Created' as kind,
                   '{}' as data
               FROM tag_domain;
        """
    )


def downgrade() -> None:
    pass
