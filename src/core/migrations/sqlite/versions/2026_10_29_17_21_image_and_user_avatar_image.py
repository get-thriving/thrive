"""Image and user avatar image.

The avatar of a user stops being a stored data URL: they point at an image they
chose, and the one generated from their name is drawn when needed.

Revision ID: e41149e5c670
Revises: b4aa712bf614
Create Date: 2026-10-29 17:21:38.303879

"""

from alembic import op

revision = "e41149e5c670"
down_revision = "b4aa712bf614"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE image (
            ref_id INTEGER NOT NULL,
            version INTEGER NOT NULL,
            archived BOOLEAN NOT NULL,
            archival_reason VARCHAR(255),
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            archived_time DATETIME,
            user_ref_id INTEGER NOT NULL,
            name VARCHAR NOT NULL DEFAULT 'Image',
            purpose VARCHAR NOT NULL,
            store_path VARCHAR NOT NULL,
            content_type VARCHAR NOT NULL,
            content_hash VARCHAR NOT NULL,
            size_in_bytes INTEGER NOT NULL,
            width INTEGER NOT NULL,
            height INTEGER NOT NULL,
            source VARCHAR NOT NULL,
            PRIMARY KEY (ref_id),
            FOREIGN KEY (user_ref_id) REFERENCES "user" (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE INDEX ix_image_user_ref_id
        ON image (user_ref_id)
        """
    )

    # Every avatar so far was generated from the name of its user, which is
    # still how users without a chosen picture get one, so nothing is lost.
    # No foreign key on the new column: the image sits under the user, and a
    # user has to be able to go with its images in any order.
    op.execute('ALTER TABLE "user" DROP COLUMN avatar')
    op.execute('ALTER TABLE "user" ADD COLUMN avatar_image_ref_id INTEGER')


def downgrade() -> None:
    op.execute('ALTER TABLE "user" DROP COLUMN avatar_image_ref_id')
    op.execute('ALTER TABLE "user" ADD COLUMN avatar VARCHAR')
    # The old code wants a data URL. A blank SVG will do until a rename draws a new one.
    op.execute("UPDATE \"user\" SET avatar = 'data:image/svg+xml;base64,PHN2Zy8+'")
    op.execute("DROP TABLE image")
