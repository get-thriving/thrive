"""The name of a location."""

from functools import total_ordering

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import hashable_value


@total_ordering
@hashable_value
class LocationName(EntityName):
    """The name of a location."""

    def __init__(self, the_name: str) -> None:
        """Initialize the location name."""
        cleaned_name = " ".join(word for word in the_name.strip().split(" ") if word)
        if len(cleaned_name) == 0:
            raise InputValidationError("Expected location name to be non-empty")
        super().__init__(cleaned_name)
