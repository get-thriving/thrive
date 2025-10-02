"""A suggested date for an inbox task."""

from jupiter.framework_new.base.adateimport ADate
from jupiter.framework_new.value import CompositeValue, value


@value
class SuggestedDate(CompositeValue):
    """A suggested date for an inbox task."""

    date: ADate
    description: str
