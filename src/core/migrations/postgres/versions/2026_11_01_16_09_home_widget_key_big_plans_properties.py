"""Home widget properties for key big plans progress widgets.

A key big plans progress widget used to show whichever big plans were marked as
key; it now keeps an explicit list of the big plans to show, in the properties
every home widget has. To leave existing home pages looking the same, each such
widget is filled in with the key big plans of its workspace as they stand right
now.

Big plans that other users shared into the workspace are not carried over, as
the list is built from the workspace's own big plans. They can be added back
from the widget's settings.

Revision ID: e32c549b055a
Revises: 218b44bff955
Create Date: 2026-11-01 16:09:02.714357

"""

import json

import sqlalchemy as sa
from alembic import op

revision = "e32c549b055a"
down_revision = "218b44bff955"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    widget_rows = conn.execute(
        sa.text(
            """
            SELECT home_widget.ref_id, home_config.workspace_ref_id
            FROM home_widget
            JOIN home_tab ON home_tab.ref_id = home_widget.home_tab_ref_id
            JOIN home_config ON home_config.ref_id = home_tab.home_config_ref_id
            WHERE home_widget.the_type = 'key-big-plans-progress'
            """
        )
    ).fetchall()

    key_big_plan_ref_ids_by_workspace: dict[int, list[int]] = {}
    for widget_ref_id, workspace_ref_id in widget_rows:
        workspace_ref_id = int(workspace_ref_id)
        if workspace_ref_id not in key_big_plan_ref_ids_by_workspace:
            big_plan_rows = conn.execute(
                sa.text(
                    """
                    SELECT big_plan.ref_id
                    FROM big_plan
                    JOIN big_plan_collection
                        ON big_plan_collection.ref_id = big_plan.big_plan_collection_ref_id
                    WHERE big_plan_collection.workspace_ref_id = :workspace_ref_id
                        AND big_plan.is_key
                        AND NOT big_plan.archived
                    ORDER BY big_plan.ref_id
                    """
                ),
                {"workspace_ref_id": workspace_ref_id},
            ).fetchall()
            key_big_plan_ref_ids_by_workspace[workspace_ref_id] = [
                int(row[0]) for row in big_plan_rows
            ]

        # Ids are stored as integers in the database, as everywhere else.
        properties = {
            "kind": "key-big-plans-progress",
            "big_plan_ref_ids": key_big_plan_ref_ids_by_workspace[workspace_ref_id],
        }
        conn.execute(
            sa.text(
                """
                UPDATE home_widget
                SET properties = CAST(:properties AS JSONB), version = version + 1
                WHERE ref_id = :ref_id
                """
            ),
            {"properties": json.dumps(properties), "ref_id": int(widget_ref_id)},
        )


def downgrade() -> None:
    # The properties column stays, as the migration before this one owns it. But
    # the code from before this migration cannot read the big plans kind, so
    # these widgets go back to having no properties.
    op.execute(
        """
        UPDATE home_widget
        SET properties = '{"kind": "empty"}'::jsonb, version = version + 1
        WHERE the_type = 'key-big-plans-progress'
        """
    )
