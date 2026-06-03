"""user verified field

Revision ID: dbcc639f25d1
Revises: 7639d48204a7
Create Date: 2026-06-02 23:00:25.999151

"""

from alembic import op

revision = "dbcc639f25d1"
down_revision = "7639d48204a7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('ALTER TABLE "user" ADD COLUMN verified BOOLEAN NOT NULL DEFAULT false')
    op.execute('UPDATE "user" SET verified = true')


def downgrade() -> None:
    op.execute('ALTER TABLE "user" DROP COLUMN verified')
