"""project dependencies

Revision ID: b7c4e5f2a318
Revises: a4b2c8d1e059
Create Date: 2026-08-28 10:00:00.000000

This revision predates the ``BigPlan`` -> ``Project`` rename (``f3a91c62d70e``),
so the table it has to touch depends on where the database is coming from:

* a database created fresh from the initial reset migration already has
  ``project``, because that migration was rewritten to use the new names;
* a database that has been around since before the rename still has
  ``big_plan`` at this point in the chain, and only gets renamed one
  revision later.

So the table is resolved at run time rather than hardcoded. Hardcoding either
name breaks one of the two populations.
"""

import sqlalchemy as sa
from alembic import op

revision = "b7c4e5f2a318"
down_revision = "a4b2c8d1e059"
branch_labels = None
depends_on = None


def _resolve_table(conn: sa.engine.Connection) -> str | None:
    """The project table under whichever name it has at this revision."""
    tables = set(sa.inspect(conn).get_table_names())
    for candidate in ("project", "big_plan"):
        if candidate in tables:
            return candidate
    return None


def _columns(conn: sa.engine.Connection, table: str) -> set[str]:
    return {c["name"] for c in sa.inspect(conn).get_columns(table)}


def upgrade() -> None:
    conn = op.get_bind()
    table = _resolve_table(conn)
    if table is None or "dependency_ref_ids" in _columns(conn, table):
        return

    with op.batch_alter_table(table) as batch_op:
        batch_op.add_column(
            sa.Column(
                "dependency_ref_ids",
                sa.JSON(),
                nullable=False,
                server_default="[]",
            )
        )


def downgrade() -> None:
    conn = op.get_bind()
    table = _resolve_table(conn)
    if table is None or "dependency_ref_ids" not in _columns(conn, table):
        return

    with op.batch_alter_table(table) as batch_op:
        batch_op.drop_column("dependency_ref_ids")
