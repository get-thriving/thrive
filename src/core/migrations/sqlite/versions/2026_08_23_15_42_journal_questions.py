"""journal questions

Revision ID: 8f3a1c92b047
Revises: 30e7ca51cd5e
Create Date: 2026-08-23 15:42:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "8f3a1c92b047"
down_revision = "30e7ca51cd5e"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("journal_collection") as batch_op:
        batch_op.add_column(
            sa.Column(
                "order_of_questions",
                sa.JSON(),
                nullable=False,
                server_default="{}",
            )
        )

    op.execute(
        """
        CREATE TABLE journal_question (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            journal_collection_ref_id INTEGER NOT NULL,
            name VARCHAR(256) NOT NULL,
            period VARCHAR(32) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (journal_collection_ref_id) REFERENCES journal_collection (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE INDEX ix_journal_question_journal_collection_ref_id
            ON journal_question (journal_collection_ref_id)
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_journal_question_journal_collection_ref_id")
    op.execute("DROP TABLE journal_question")
    with op.batch_alter_table("journal_collection") as batch_op:
        batch_op.drop_column("order_of_questions")
