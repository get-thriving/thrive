"""'Add support for chapters'

Revision ID: b24745baaaa4
Revises: cd1631847530
Create Date: 2025-12-23 17:32:35.207136

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b24745baaaa4'
down_revision = 'cd1631847530'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE chapter (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            life_plan_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL,
            start_date VARCHAR NOT NULL,
            end_date VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (life_plan_ref_id) REFERENCES life_plan (ref_id)
        )
    """)
    op.execute("""
        CREATE INDEX ix_chapter_life_plan_ref_id ON chapter (life_plan_ref_id)
    """)

    op.execute("""
        CREATE TABLE chapter_event (
            owner_ref_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            session_index INTEGER NOT NULL,
            name VARCHAR(32) NOT NULL,
            source VARCHAR(16) NOT NULL,
            owner_version INTEGER NOT NULL,
            kind VARCHAR(16) NOT NULL,
            data JSON,
            PRIMARY KEY (owner_ref_id, timestamp, session_index, name),
            FOREIGN KEY (owner_ref_id) REFERENCES chapter (ref_id)
        )
    """)

def downgrade():
    pass
