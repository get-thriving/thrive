"""Stable type:purpose prefix for inbox task ownership (no ref id)."""

from __future__ import annotations

from typing import Final

from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError


def parent_link_namespace_from_entity_link(link: EntityLink) -> str:
    """Build ``the_type:purpose`` from a full owner link (drops ref id)."""
    wire = f"{link.the_type}:{link.purpose}"
    _validate_parent_link_namespace(wire)
    return wire


def parent_link_namespace_allows_user_field_edits(pln: str) -> bool:
    """Whether user-editable core fields (name, eisen, etc.) are allowed."""
    return pln in _USER_EDITABLE


def parent_link_as_owner_prefix(pln: str) -> str:
    """Prefix for SQL ``LIKE`` / ``GLOB`` matching full ``EntityLink`` rows."""
    return f"{pln}:"


def _validate_parent_link_namespace(value: str) -> None:
    if not value or ":" not in value:
        raise InputValidationError(
            f"Invalid parent link namespace: {value!r}",
        )


TODO_TASK: Final[str] = "TodoTask:std"
WORKING_MEM_CLEANUP: Final[str] = "WorkingMemCollection:std"
TIME_PLAN: Final[str] = "TimePlan:std"
HABIT: Final[str] = "Habit:std"
CHORE: Final[str] = "Chore:std"
BIG_PLAN: Final[str] = "BigPlan:std"
JOURNAL: Final[str] = "Journal:std"
METRIC: Final[str] = "Metric:std"
PERSON_CATCH_UP: Final[str] = "Person:std"
PERSON_OCCASION: Final[str] = "Occasion:std"
SLACK_TASK: Final[str] = "SlackTask:std"
EMAIL_TASK: Final[str] = "EmailTask:std"
LIFE_PLAN_EVAL: Final[str] = "LifePlan:std"

_USER_EDITABLE: frozenset[str] = frozenset(
    {TODO_TASK, BIG_PLAN, SLACK_TASK, EMAIL_TASK},
)

ALL_INBOX_TASK_SOURCE_PARENT_LINK_NAMESPACES: tuple[str, ...] = (
    TODO_TASK,
    WORKING_MEM_CLEANUP,
    TIME_PLAN,
    HABIT,
    CHORE,
    BIG_PLAN,
    JOURNAL,
    METRIC,
    PERSON_CATCH_UP,
    PERSON_OCCASION,
    SLACK_TASK,
    EMAIL_TASK,
    LIFE_PLAN_EVAL,
)


def all_parent_link_namespaces_for_workspace_sources() -> frozenset[str]:
    """All source kinds that can appear on inbox tasks in a workspace."""
    return frozenset(ALL_INBOX_TASK_SOURCE_PARENT_LINK_NAMESPACES)
