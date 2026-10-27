"""'Rename user auth method to auth sign up method'

Revision ID: b4aa712bf614
Revises: 609e423824c3
Create Date: 2026-10-27 22:19:18.695230

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "b4aa712bf614"
down_revision = "609e423824c3"
branch_labels = None
depends_on = None


def upgrade():
    op.execute('ALTER TABLE "user" RENAME COLUMN auth_method TO auth_sign_up_method')


def downgrade():
    op.execute('ALTER TABLE "user" RENAME COLUMN auth_sign_up_method TO auth_method')
