"""Image and user avatar image.

The avatar of a user stops being a stored data URL: they point at an image they
chose, and the one generated from their name is drawn when needed. Images
sit under the singleton images domain, and are owned by a user or a workspace.

Revision ID: e41149e5c670
Revises: b4aa712bf614
Create Date: 2026-10-29 17:21:38.303879

"""

from alembic import op
from sqlalchemy import text

revision = "e41149e5c670"
down_revision = "b4aa712bf614"
branch_labels = None
depends_on = None

_THE_IMAGE_DOMAIN_REF_ID = 1
_THE_IMAGE_DOMAIN_VERSION = 1
_THE_IMAGE_DOMAIN_CREATED_TIME = "2026-10-29 00:00:00.000000"


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE image_domain (
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
            INSERT INTO image_domain (
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
            "ref_id": _THE_IMAGE_DOMAIN_REF_ID,
            "version": _THE_IMAGE_DOMAIN_VERSION,
            "archived": False,
            "archival_reason": None,
            "created_time": _THE_IMAGE_DOMAIN_CREATED_TIME,
            "last_modified_time": _THE_IMAGE_DOMAIN_CREATED_TIME,
            "archived_time": None,
        },
    )

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
            image_domain_ref_id INTEGER NOT NULL,
            owner VARCHAR NOT NULL,
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
            FOREIGN KEY (image_domain_ref_id) REFERENCES image_domain (ref_id)
        )
        """
    )

    op.execute(
        """
        CREATE INDEX ix_image_image_domain_ref_id
        ON image (image_domain_ref_id)
        """
    )

    # Images are looked up by who owns them, to be removed along with the owner.
    op.execute(
        """
        CREATE INDEX ix_image_owner
        ON image (owner)
        """
    )

    # Every avatar so far was generated from the name of its user, which is
    # still how users without a chosen picture get one, so nothing is lost.
    # No foreign key on the new column: the image sits under the images domain,
    # and a user has to be able to go without waiting for its images.
    op.execute('ALTER TABLE "user" DROP COLUMN avatar')
    op.execute('ALTER TABLE "user" ADD COLUMN avatar_image_ref_id INTEGER')


def downgrade() -> None:
    op.execute('ALTER TABLE "user" DROP COLUMN avatar_image_ref_id')
    op.execute('ALTER TABLE "user" ADD COLUMN avatar VARCHAR')
    # The old code wants a data URL. A blank SVG will do until a rename draws a new one.
    op.execute("UPDATE \"user\" SET avatar = 'data:image/svg+xml;base64,PHN2Zy8+'")
    op.execute("DROP TABLE image")
    op.execute("DROP TABLE image_domain")
