"""time plan questions

Revision ID: a4b2c8d1e059
Revises: 8f3a1c92b047
Create Date: 2026-08-23 17:55:00.000000

"""

import sqlalchemy as sa
from alembic import op

revision = "a4b2c8d1e059"
down_revision = "8f3a1c92b047"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("time_plan_domain") as batch_op:
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
        CREATE TABLE time_plan_question (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            time_plan_domain_ref_id INTEGER NOT NULL,
            name VARCHAR(256) NOT NULL,
            period VARCHAR(32) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (time_plan_domain_ref_id) REFERENCES time_plan_domain (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE INDEX ix_time_plan_question_time_plan_domain_ref_id
            ON time_plan_question (time_plan_domain_ref_id)
        """
    )


def downgrade() -> None:
    op.execute("DROP INDEX ix_time_plan_question_time_plan_domain_ref_id")
    op.execute("DROP TABLE time_plan_question")
    with op.batch_alter_table("time_plan_domain") as batch_op:
        batch_op.drop_column("order_of_questions")
