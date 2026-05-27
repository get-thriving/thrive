"""The base value object for any kind of tag tag."""

import re
from functools import total_ordering
from typing import Final

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.errors import InputValidationError
from jupiter.framework.value import hashable_value

_TAG_RE: Final[re.Pattern[str]] = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9]*-?)*$")


@total_ordering
@hashable_value
class TagName(EntityName):
    """The base value object for any kind of tag tag."""

    def __init__(self, the_name: str) -> None:
        """Initialize the tag name."""
        super().__init__(the_name)
        if not _TAG_RE.match(the_name):
            raise InputValidationError(
                f"Expected entity id '{the_name}' to match '{_TAG_RE.pattern}'",
            )
