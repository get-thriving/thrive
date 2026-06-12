"""Tests for publish entity."""

from jupiter.core.common.sub.publish.sub.entity.root import ALLOWED_PUBLISH_OWNER_TYPES
from jupiter.core.named_entity_tag import NamedEntityTag


def test_allowed_publish_owner_types_matches_shareable_named_entity_tags() -> None:
    assert ALLOWED_PUBLISH_OWNER_TYPES == frozenset(
        {
            NamedEntityTag.TODO_TASK.value,
            NamedEntityTag.WORKING_MEM.value,
            NamedEntityTag.TIME_PLAN.value,
            NamedEntityTag.SCHEDULE_STREAM.value,
            NamedEntityTag.SCHEDULE_EVENT_IN_DAY.value,
            NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS_BLOCK.value,
            NamedEntityTag.HABIT.value,
            NamedEntityTag.CHORE.value,
            NamedEntityTag.BIG_PLAN.value,
            NamedEntityTag.DOC.value,
            NamedEntityTag.DIR.value,
            NamedEntityTag.JOURNAL.value,
            NamedEntityTag.CHAPTER.value,
            NamedEntityTag.GOAL.value,
            NamedEntityTag.MILESTONE.value,
            NamedEntityTag.VISION.value,
            NamedEntityTag.VACATION.value,
            NamedEntityTag.ASPECT.value,
            NamedEntityTag.SMART_LIST.value,
            NamedEntityTag.SMART_LIST_ITEM.value,
            NamedEntityTag.METRIC.value,
            NamedEntityTag.METRIC_ENTRY.value,
            NamedEntityTag.PERSON.value,
        }
    )
