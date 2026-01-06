"""Seed default circles for PRM.

Revision ID: 6f4b9c1a2d0e
Revises: 0c6b5c5e2a31
Create Date: 2026-01-06 00:35:00.000000

"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "6f4b9c1a2d0e"
down_revision = "0c6b5c5e2a31"
branch_labels = None
depends_on = None


DEFAULT_CIRCLE_NAMES = [
    "Family",
    "Friend",
    "Work Buddy",
    "School Buddy",
    "Colleague",
    "Acquaintance",
    "Other",
]


def upgrade() -> None:
    bind = op.get_bind()

    prm_ids = [
        row[0] for row in bind.execute(sa.text("SELECT ref_id FROM prm")).fetchall()
    ]

    existing = set(
        (row[0], row[1])
        for row in bind.execute(
            sa.text("SELECT prm_ref_id, name FROM circle")
        ).fetchall()
    )

    max_circle_id = bind.execute(
        sa.text("SELECT COALESCE(MAX(ref_id), 0) FROM circle")
    ).scalar_one()

    for prm_ref_id in prm_ids:
        for circle_name in DEFAULT_CIRCLE_NAMES:
            if (prm_ref_id, circle_name) in existing:
                continue

            max_circle_id += 1
            bind.execute(
                sa.text(
                    """
                    INSERT INTO circle (
                        ref_id,
                        version,
                        archived,
                        archival_reason,
                        created_time,
                        last_modified_time,
                        archived_time,
                        prm_ref_id,
                        name
                    ) VALUES (
                        :ref_id,
                        1,
                        0,
                        NULL,
                        CURRENT_TIMESTAMP,
                        CURRENT_TIMESTAMP,
                        NULL,
                        :prm_ref_id,
                        :name
                    )
                    """
                ),
                {
                    "ref_id": max_circle_id,
                    "prm_ref_id": prm_ref_id,
                    "name": circle_name,
                },
            )


def downgrade() -> None:
    pass
