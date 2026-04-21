"""Minimal crown entity projection for bulk operations."""

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.value import CompositeValue, value


@value
class EntityIndexingSummary(CompositeValue):
    """Entity id, last modification time, and archival flag only."""

    ref_id: EntityId
    last_modified_time: Timestamp
    archived: bool
