"""'backfill journal collection generation in advance days'

Revision ID: e8903716b712
Revises: eed3559f70f5
Create Date: 2026-07-19 20:15:36.655861

Repairs legacy `journal_collection` rows where `generation_in_advance_days`
does not agree with `periods`. `generation_approach` / `generation_in_advance_days`
were added to the model after `periods` already existed (both columns are
nullable in the schema), so older collections can have a period listed in
`periods` with no matching entry in `generation_in_advance_days` (or a NULL
map). That violates the invariant `JournalCollection.update` enforces
(`periods == generation_in_advance_days.keys()` for the journal-generating
approaches) and makes task generation raise `KeyError` for those workspaces.

"""

import json
from typing import Any

from alembic import op
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = "e8903716b712"
down_revision = "eed3559f70f5"
branch_labels = None
depends_on = None


# Journal generation approaches (frozen snapshot of the model at this revision).
APPROACH_NONE = "none"
APPROACH_ONLY_JOURNAL = "only-journal"
APPROACH_BOTH = "both-journal-and-task"

# Default "generate in advance" days for a period that is present in `periods`
# but missing from `generation_in_advance_days`. Values respect the bounds in
# JournalCollection._validate_generation_in_advance_days (daily must be 1,
# weekly 1..7, monthly 1..30; quarterly / yearly are unconstrained).
DEFAULT_ADVANCE_DAYS = {
    "daily": 1,
    "weekly": 3,
    "monthly": 15,
    "quarterly": 30,
    "yearly": 30,
}


def _log_progress(message: str) -> None:
    print(f"[backfill journal advance days] {message}", flush=True)


def _load_json(value: object) -> Any:
    """Parse a JSON column value that may arrive as text (sqlite) or parsed (postgres)."""
    if value is None:
        return None
    if isinstance(value, (str, bytes)):
        return json.loads(value)
    return value


def _target_advance_days(
    approach: str | None, periods: list[str], current: dict[str, int] | None
) -> dict[str, int] | None:
    """Compute the reconciled generation_in_advance_days for a row.

    Returns None when the row's approach is unrecognized (e.g. NULL), in which
    case the row is left untouched.
    """
    if approach == APPROACH_NONE:
        return {}
    if approach in (APPROACH_ONLY_JOURNAL, APPROACH_BOTH):
        current_map = current or {}
        return {
            period: current_map.get(period, DEFAULT_ADVANCE_DAYS.get(period, 1))
            for period in periods
        }
    return None


def upgrade():
    conn = op.get_bind()
    postgres = conn.dialect.name == "postgresql"

    rows = conn.execute(
        text(
            "SELECT ref_id, periods, generation_approach, generation_in_advance_days "
            "FROM journal_collection"
        )
    ).fetchall()

    _log_progress(f"Inspecting {len(rows)} journal_collection rows…")

    fixed = 0
    for row in rows:
        ref_id = row.ref_id
        approach = row.generation_approach
        periods = _load_json(row.periods) or []
        current = _load_json(row.generation_in_advance_days)

        target = _target_advance_days(approach, list(periods), current)
        if target is None:
            _log_progress(
                f"  ref_id={ref_id}: unrecognized approach {approach!r}, leaving as-is"
            )
            continue

        # `current is None` is itself invalid (the model field is non-optional),
        # so always repair it even if the reconciled map would be equal.
        if current is not None and current == target:
            continue

        value = json.dumps(target)
        if postgres:
            conn.execute(
                text(
                    "UPDATE journal_collection "
                    "SET generation_in_advance_days = CAST(:val AS JSON) "
                    "WHERE ref_id = :rid"
                ),
                {"val": value, "rid": ref_id},
            )
        else:
            conn.execute(
                text(
                    "UPDATE journal_collection "
                    "SET generation_in_advance_days = :val "
                    "WHERE ref_id = :rid"
                ),
                {"val": value, "rid": ref_id},
            )

        fixed += 1
        _log_progress(f"  ref_id={ref_id}: {current!r} -> {target!r}")

    _log_progress(f"Backfill complete: {fixed} journal_collection rows repaired.")


def downgrade():
    # Pure data repair; the original (inconsistent) values are not recoverable.
    pass
