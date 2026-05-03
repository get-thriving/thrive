"""docs_dirs_and_parent_dir_ref_id

Revision ID: 6e5f8bc8fcd2
Revises: e5b1c2930a2d
Create Date: 2026-05-01 16:57:13.493546

"""

from alembic import op
import sqlalchemy as sa


revision = "6e5f8bc8fcd2"
down_revision = "e5b1c2930a2d"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE dir (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            doc_collection_ref_id INTEGER NOT NULL,
            parent_dir_ref_id INTEGER,
            name VARCHAR(100) NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (doc_collection_ref_id) REFERENCES doc_collection (ref_id),
            FOREIGN KEY (parent_dir_ref_id) REFERENCES dir (ref_id)

        );
        """
    )
    op.execute(
        """
        CREATE INDEX ix_dir_doc_collection_ref_id ON dir (doc_collection_ref_id);
        """
    )
    op.execute(
        """
        CREATE INDEX ix_dir_parent_dir_ref_id ON dir (parent_dir_ref_id);
        """
    )

    with op.batch_alter_table("doc") as batch_op:
        batch_op.add_column(sa.Column("parent_dir_ref_id", sa.Integer(), nullable=True))

    op.execute(
        """
        INSERT INTO dir (
            version,
            archived,
            archival_reason,
            created_time,
            last_modified_time,
            archived_time,
            doc_collection_ref_id,
            parent_dir_ref_id,
            name
        )
        SELECT
            1,
            0,
            NULL,
            datetime('now'),
            datetime('now'),
            NULL,
            ref_id,
            NULL,
            'Root'
        FROM doc_collection;
        """
    )

    op.execute(
        """
        UPDATE doc SET parent_dir_ref_id = (
            SELECT d.ref_id FROM dir d
            WHERE d.doc_collection_ref_id = doc.doc_collection_ref_id
            AND d.parent_dir_ref_id IS NULL
        );
        """
    )

    op.execute("DROP INDEX IF EXISTS ix_doc_parent_doc_ref_id")

    with op.batch_alter_table("doc") as batch_op:
        batch_op.drop_column("parent_doc_ref_id")

    with op.batch_alter_table("doc") as batch_op:
        batch_op.alter_column(
            "parent_dir_ref_id",
            existing_type=sa.Integer(),
            nullable=False,
        )

    op.execute(
        """
        CREATE INDEX ix_doc_parent_dir_ref_id ON doc (parent_dir_ref_id);
        """
    )


def downgrade() -> None:
    pass
