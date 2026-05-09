"""Map ``period is None`` (lifetime) to a non-NULL PK column value for PostgreSQL."""

from typing import Any, Mapping, cast

from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.gamification.score_period_best import ScorePeriodBest
from jupiter.core.gamification.score_stats import (
    SCORE_PERIOD_NONE_DB_VALUE,
    ScoreStats,
)
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmThing
from sqlalchemy import or_
from sqlalchemy.sql.elements import ColumnElement


def optional_period_pk_match(
    column: ColumnElement[object], period: RecurringTaskPeriod | None
) -> ColumnElement[bool]:
    """Match rows where optional ``period`` equals domain ``period`` (including lifetime)."""
    if period is not None:
        return column == period.value
    return or_(column.is_(None), column == SCORE_PERIOD_NONE_DB_VALUE)


def db_encode_score_stats_row(
    registry: RealmCodecRegistry, record: ScoreStats
) -> dict[str, RealmThing]:
    row = dict(cast(Mapping[str, RealmThing], registry.db_encode(record)))
    if row.get("period") is None:
        row["period"] = SCORE_PERIOD_NONE_DB_VALUE
    return row


def db_encode_score_period_best_row(
    registry: RealmCodecRegistry, record: ScorePeriodBest
) -> dict[str, RealmThing]:
    row = dict(cast(Mapping[str, RealmThing], registry.db_encode(record)))
    if row.get("period") is None:
        row["period"] = SCORE_PERIOD_NONE_DB_VALUE
    return row


def mapping_for_decode_score_stats(mapping: Any) -> Mapping[str, RealmThing]:
    m = dict(mapping)
    if m.get("period") in (None, SCORE_PERIOD_NONE_DB_VALUE):
        m["period"] = None
    return cast(Mapping[str, RealmThing], m)


def mapping_for_decode_score_period_best(mapping: Any) -> Mapping[str, RealmThing]:
    m = dict(mapping)
    if m.get("period") in (None, SCORE_PERIOD_NONE_DB_VALUE):
        m["period"] = None
    return cast(Mapping[str, RealmThing], m)
