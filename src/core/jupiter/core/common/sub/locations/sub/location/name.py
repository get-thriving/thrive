"""The name of a location."""

from difflib import SequenceMatcher

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value

LOCATION_NAME_SIMILARITY_THRESHOLD = 0.8


@hashable_value
class LocationName(EntityName):
    """The name of a location."""

    def is_similar_to(
        self,
        other: "LocationName",
        threshold: float = LOCATION_NAME_SIMILARITY_THRESHOLD,
    ) -> bool:
        """Whether this name is similar enough to ``other`` to treat as the same place."""
        ratio = SequenceMatcher(
            None, str(self).casefold(), str(other).casefold()
        ).ratio()
        return ratio >= threshold
