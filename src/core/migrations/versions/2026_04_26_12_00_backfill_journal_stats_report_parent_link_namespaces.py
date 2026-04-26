"""Backfill journal_stats report inbox source strings to parent-link namespaces.

Revision ID: 7c4b9a2d8f01
Revises: deadbeefdead
Create Date: 2026-04-26 12:00:00.000000

``ReportPeriodResult`` stores inbox breakdown ``source`` values and the top-level
``sources`` list as ``the_type:purpose`` strings (see
``parent_link_namespace_from_entity_link``). Older rows still use kebab-case
namespace values from the pre-``owner`` ``inbox_task`` column. This migration
rewrites those strings in persisted ``journal_stats.report`` JSON so they match
the format produced after the EntityLink / parent-link namespace work
(``2026_04_24_18_30_inbox_task_owner_entity_link`` and friends).
"""

from __future__ import annotations

import json
from typing import Any

from alembic import op
from sqlalchemy import inspect, text

revision = "7c4b9a2d8f01"
down_revision = "deadbeefdead"
branch_labels = None
depends_on = None

# Same mapping as inbox_task.namespace -> owner prefix in
# ``2026_04_24_18_30_inbox_task_owner_entity_link`` (type:purpose only, no ref id).
_LEGACY_SOURCE_TO_PARENT_LINK_NAMESPACE: dict[str, str] = {
    "todo-task": "TodoTask:std",
    "working-mem-cleanup": "WorkingMemCollection:std",
    "time-plan": "TimePlan:std",
    "habit": "Habit:std",
    "chore": "Chore:std",
    "big-plan": "BigPlan:std",
    "journal": "Journal:std",
    "metric": "Metric:std",
    "person-catch-up": "Person:std",
    "person-occasion": "Occasion:std",
    "person-birthday": "Occasion:std",
    "slack-task": "SlackTask:std",
    "email-task": "EmailTask:std",
    "life-plan-eval": "LifePlan:std",
    # Older journal_stats JSON migrations (see 2026_03_21 migrations).
    "todo": "TodoTask:std",
    "user": "TodoTask:std",
}


def _has_table(table_name: str) -> bool:
    inspector = inspect(op.get_bind())
    return table_name in inspector.get_table_names()


def _has_column(table_name: str, column_name: str) -> bool:
    inspector = inspect(op.get_bind())
    if table_name not in inspector.get_table_names():
        return False
    return any(
        column["name"] == column_name for column in inspector.get_columns(table_name)
    )


def _migrate_inbox_tasks_summary(summary: dict[str, Any]) -> bool:
    changed = False
    for bucket in ("created", "not_started", "working", "not_done", "done"):
        b = summary.get(bucket)
        if not isinstance(b, dict):
            continue
        for item in b.get("per_source_cnt") or []:
            if not isinstance(item, dict):
                continue
            src = item.get("source")
            if isinstance(src, str) and src in _LEGACY_SOURCE_TO_PARENT_LINK_NAMESPACE:
                item["source"] = _LEGACY_SOURCE_TO_PARENT_LINK_NAMESPACE[src]
                changed = True
    return changed


def _migrate_report_dict(report: dict[str, Any]) -> bool:
    changed = False

    sources = report.get("sources")
    if isinstance(sources, list):
        new_sources: list[Any] = []
        sources_changed = False
        for s in sources:
            if isinstance(s, str) and s in _LEGACY_SOURCE_TO_PARENT_LINK_NAMESPACE:
                new_sources.append(_LEGACY_SOURCE_TO_PARENT_LINK_NAMESPACE[s])
                sources_changed = True
            else:
                new_sources.append(s)
        if sources_changed:
            report["sources"] = new_sources
            changed = True

    g = report.get("global_inbox_tasks_summary")
    if isinstance(g, dict) and _migrate_inbox_tasks_summary(g):
        changed = True

    pp = report.get("per_period_breakdown")
    if isinstance(pp, list):
        for it in pp:
            if not isinstance(it, dict):
                continue
            inner = it.get("inbox_tasks_summary")
            if isinstance(inner, dict) and _migrate_inbox_tasks_summary(inner):
                changed = True

    return changed


def _coerce_report_to_dict(report: Any) -> dict[str, Any] | None:
    if report is None:
        return None
    if isinstance(report, dict):
        return report
    if isinstance(report, str):
        try:
            parsed = json.loads(report)
        except json.JSONDecodeError:
            return None
        return parsed if isinstance(parsed, dict) else None
    return None


def upgrade() -> None:
    if not (_has_table("journal_stats") and _has_column("journal_stats", "report")):
        return

    bind = op.get_bind()
    rows = bind.execute(text("SELECT journal_ref_id, report FROM journal_stats")).fetchall()

    for journal_ref_id, report in rows:
        data = _coerce_report_to_dict(report)
        if data is None:
            continue
        if not _migrate_report_dict(data):
            continue
        bind.execute(
            text(
                "UPDATE journal_stats SET report = :report WHERE journal_ref_id = :jid"
            ),
            {"report": json.dumps(data, separators=(",", ":")), "jid": journal_ref_id},
        )


def downgrade() -> None:
    pass
