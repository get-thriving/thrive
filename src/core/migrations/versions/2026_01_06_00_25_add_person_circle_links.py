"""Add person-circle link table.

Revision ID: 0c6b5c5e2a31
Revises: f84e8751883f
Create Date: 2026-01-06 00:25:00.000000
"""

from alembic import op


# revision identifiers, used by Alembic.
revision = "0c6b5c5e2a31"
down_revision = "f84e8751883f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE person_circle_link (
            prm_ref_id INTEGER NOT NULL,
            person_ref_id INTEGER NOT NULL,
            circle_ref_id INTEGER NOT NULL,
            created_time DATETIME NOT NULL,
            last_modified_time DATETIME NOT NULL,
            PRIMARY KEY (prm_ref_id, person_ref_id, circle_ref_id),
            FOREIGN KEY (prm_ref_id) REFERENCES prm (ref_id),
            FOREIGN KEY (person_ref_id) REFERENCES person (ref_id),
            FOREIGN KEY (circle_ref_id) REFERENCES circle (ref_id)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX ix_person_circle_link_person_ref_id
        ON person_circle_link (person_ref_id)
        """
    )
    op.execute(
        """
        CREATE INDEX ix_person_circle_link_circle_ref_id
        ON person_circle_link (circle_ref_id)
        """
    )


def downgrade() -> None:
    # Intentionally left blank for now (matches many existing migrations in this repo).
    pass
