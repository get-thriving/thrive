"""Backfill person-circle links from person.relationship.

Revision ID: 7b0d3a1c9f42
Revises: 6f4b9c1a2d0e
Create Date: 2026-01-06 00:40:00.000000
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision = "7b0d3a1c9f42"
down_revision = "6f4b9c1a2d0e"
branch_labels = None
depends_on = None


RELATIONSHIP_TO_CIRCLE_NAME: dict[str, str] = {
    "family": "Family",
    "friend": "Friend",
    "work-buddy": "Work Buddy",
    "school-buddy": "School Buddy",
    "colleague": "Colleague",
    "acquaintance": "Acquaintance",
    "other": "Other",
}


def upgrade() -> None:
    bind = op.get_bind()

    circles = bind.execute(
        sa.text("SELECT ref_id, prm_ref_id, name FROM circle")
    ).fetchall()
    circle_ref_id_by_prm_and_name: dict[tuple[int, str], int] = {
        (row[1], row[2]): row[0] for row in circles
    }

    existing_links = set(
        tuple(row)
        for row in bind.execute(
            sa.text(
                "SELECT prm_ref_id, person_ref_id, circle_ref_id FROM person_circle_link"
            )
        ).fetchall()
    )

    persons = bind.execute(
        sa.text("SELECT ref_id, prm_ref_id, relationship FROM person")
    ).fetchall()

    for person_ref_id, prm_ref_id, relationship in persons:
        desired_circle_name = RELATIONSHIP_TO_CIRCLE_NAME.get(relationship)
        if desired_circle_name is None:
            continue

        circle_ref_id = circle_ref_id_by_prm_and_name.get(
            (prm_ref_id, desired_circle_name)
        )
        if circle_ref_id is None:
            continue

        key = (prm_ref_id, person_ref_id, circle_ref_id)
        if key in existing_links:
            continue

        bind.execute(
            sa.text(
                """
                INSERT INTO person_circle_link (
                    prm_ref_id,
                    person_ref_id,
                    circle_ref_id,
                    created_time,
                    last_modified_time
                ) VALUES (
                    :prm_ref_id,
                    :person_ref_id,
                    :circle_ref_id,
                    CURRENT_TIMESTAMP,
                    CURRENT_TIMESTAMP
                )
                """
            ),
            {
                "prm_ref_id": prm_ref_id,
                "person_ref_id": person_ref_id,
                "circle_ref_id": circle_ref_id,
            },
        )
        existing_links.add(key)


def downgrade() -> None:
    pass
