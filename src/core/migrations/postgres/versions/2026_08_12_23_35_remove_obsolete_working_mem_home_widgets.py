"""Remove obsolete working-mem home widgets.

Revision ID: 30e7ca51cd5e
Revises: 187710f87f90
Create Date: 2026-08-12 23:35:39.800563

``WidgetType.WORKING_MEM`` was removed, but existing ``home_widget`` rows can
still store ``the_type = 'working-mem'``. Loading those rows raises
``RealmDecodingError``, which breaks workspace clear/remove paths that walk
access grants.
"""

from __future__ import annotations

import json

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "30e7ca51cd5e"
down_revision = "187710f87f90"
branch_labels = None
depends_on = None


def _placement_without_widgets(placement_raw: object, widget_ids: set[int]) -> object:
    if not isinstance(placement_raw, dict):
        return placement_raw

    placement = dict(placement_raw)
    sections = [
        section
        for section in placement.get("sections", [])
        if int(section.get("ref_id", -1)) not in widget_ids
    ]
    placement["sections"] = sections

    matrix = placement.get("matrix")
    if isinstance(matrix, list):
        placement["matrix"] = [
            [
                None if (cell is not None and int(cell) in widget_ids) else cell
                for cell in (row if isinstance(row, list) else [])
            ]
            for row in matrix
        ]

    return placement


def upgrade() -> None:
    conn = op.get_bind()
    widget_rows = conn.execute(
        sa.text("SELECT ref_id FROM home_widget WHERE the_type = 'working-mem'")
    ).fetchall()
    widget_ids = {int(row[0]) for row in widget_rows}
    if not widget_ids:
        return

    entity_keys = [f"HomeWidget:std:{widget_id}" for widget_id in sorted(widget_ids)]

    for entity_key in entity_keys:
        grant_rows = conn.execute(
            sa.text("SELECT ref_id FROM access_grant WHERE entity = :entity"),
            {"entity": entity_key},
        ).fetchall()
        grant_ids = [int(row[0]) for row in grant_rows]

        conn.execute(
            sa.text("DELETE FROM access_status WHERE entity = :entity"),
            {"entity": entity_key},
        )
        conn.execute(
            sa.text("DELETE FROM access_request WHERE entity = :entity"),
            {"entity": entity_key},
        )
        for grant_id in grant_ids:
            conn.execute(
                sa.text(
                    "DELETE FROM access_invite WHERE access_grant_ref_id = :grant_id"
                ),
                {"grant_id": grant_id},
            )
        conn.execute(
            sa.text("DELETE FROM access_grant WHERE entity = :entity"),
            {"entity": entity_key},
        )

    tab_rows = conn.execute(
        sa.text(
            """
            SELECT DISTINCT home_tab_ref_id
            FROM home_widget
            WHERE the_type = 'working-mem'
            """
        )
    ).fetchall()
    tab_ids = [int(row[0]) for row in tab_rows]

    for tab_id in tab_ids:
        placement_row = conn.execute(
            sa.text("SELECT widget_placement FROM home_tab WHERE ref_id = :ref_id"),
            {"ref_id": tab_id},
        ).fetchone()
        if placement_row is None:
            continue

        placement_raw = placement_row[0]
        if isinstance(placement_raw, str):
            placement_raw = json.loads(placement_raw)

        cleaned = _placement_without_widgets(placement_raw, widget_ids)
        conn.execute(
            sa.text(
                """
                UPDATE home_tab
                SET widget_placement = CAST(:placement AS jsonb),
                    version = version + 1
                WHERE ref_id = :ref_id
                """
            ),
            {"placement": json.dumps(cleaned), "ref_id": tab_id},
        )

    conn.execute(sa.text("DELETE FROM home_widget WHERE the_type = 'working-mem'"))


def downgrade() -> None:
    # Obsolete widget type cannot be restored meaningfully.
    pass
