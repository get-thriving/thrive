"""Summary of an API key, safe for web display."""

from jupiter.core.api_key.name import APIKeyName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.value import CompositeValue, value


@value
class APIKeySummary(CompositeValue):
    """Summary of an API key, safe for web display."""

    ref_id: EntityId
    name: APIKeyName
    last_four_digits: str
    archived: bool
