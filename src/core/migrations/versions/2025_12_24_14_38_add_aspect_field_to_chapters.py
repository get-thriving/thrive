"""'Add aspect field to chapters'

Revision ID: d742acda64d2
Revises: b24745baaaa4
Create Date: 2025-12-24 14:38:55.966952

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d742acda64d2"
down_revision = "b24745baaaa4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("chapter") as batch_op:
        batch_op.add_column(sa.Column("aspect_ref_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_chapter_aspect_ref_id_aspect",
            "aspect",
            ["aspect_ref_id"],
            ["ref_id"],
        )

    op.execute(
        """
        UPDATE chapter
        SET aspect_ref_id = (
            SELECT aspect.ref_id
            FROM aspect
            WHERE aspect.life_plan_ref_id = chapter.life_plan_ref_id
              AND aspect.parent_aspect_ref_id IS NULL
            LIMIT 1
        )
        WHERE aspect_ref_id IS NULL
    """
    )

    op.execute(
        """
        CREATE INDEX ix_chapter_aspect_ref_id ON chapter (aspect_ref_id)
        """
    )

    with op.batch_alter_table("chapter") as batch_op:
        batch_op.alter_column("aspect_ref_id", nullable=False)


def downgrade() -> None:
    pass
