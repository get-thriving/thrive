"""Home widget properties.

Each home widget gets a ``properties`` column, whose shape depends on the type of
the widget. Most widgets have nothing to configure, so they get ``{"kind":
"empty"}``. A key habits streaks widget used to show whichever habits were marked
as key; it now keeps an explicit, ordered list of habits. To leave existing home
pages looking the same, each such widget is filled in with the key habits of its
workspace as they stand right now.

Habits that other users shared into the workspace are not carried over, as the
list is built from the workspace's own habits. They can be added back from the
widget's settings.

Revision ID: 218b44bff955
Revises: e41149e5c670
Create Date: 2026-11-01 14:49:22.732130

"""

import json

import sqlalchemy as sa
from alembic import op

revision = "218b44bff955"
down_revision = "e41149e5c670"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE home_widget
        ADD COLUMN properties JSON NOT NULL DEFAULT '{"kind": "empty"}'
        """
    )

    conn = op.get_bind()
    widget_rows = conn.execute(
        sa.text(
            """
            SELECT home_widget.ref_id, home_config.workspace_ref_id
            FROM home_widget
            JOIN home_tab ON home_tab.ref_id = home_widget.home_tab_ref_id
            JOIN home_config ON home_config.ref_id = home_tab.home_config_ref_id
            WHERE home_widget.the_type = 'key-habits-streaks'
            """
        )
    ).fetchall()

    key_habit_ref_ids_by_workspace: dict[int, list[int]] = {}
    for widget_ref_id, workspace_ref_id in widget_rows:
        workspace_ref_id = int(workspace_ref_id)
        if workspace_ref_id not in key_habit_ref_ids_by_workspace:
            habit_rows = conn.execute(
                sa.text(
                    """
                    SELECT habit.ref_id
                    FROM habit
                    JOIN habit_collection
                        ON habit_collection.ref_id = habit.habit_collection_ref_id
                    WHERE habit_collection.workspace_ref_id = :workspace_ref_id
                        AND habit.is_key = 1
                        AND habit.archived = 0
                    ORDER BY habit.ref_id
                    """
                ),
                {"workspace_ref_id": workspace_ref_id},
            ).fetchall()
            key_habit_ref_ids_by_workspace[workspace_ref_id] = [
                int(row[0]) for row in habit_rows
            ]

        # Ids are stored as integers in the database, as everywhere else.
        properties = {
            "kind": "key-habits-streaks",
            "habit_ref_ids": key_habit_ref_ids_by_workspace[workspace_ref_id],
        }
        conn.execute(
            sa.text(
                """
                UPDATE home_widget
                SET properties = :properties, version = version + 1
                WHERE ref_id = :ref_id
                """
            ),
            {"properties": json.dumps(properties), "ref_id": int(widget_ref_id)},
        )


def downgrade() -> None:
    op.execute("ALTER TABLE home_widget DROP COLUMN properties")
