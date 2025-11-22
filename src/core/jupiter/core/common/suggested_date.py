"""A suggested date for an inbox task."""

from jupiter.framework.base.adate import ADate
from jupiter.framework.value import CompositeValue, value


@value
class SuggestedDate(CompositeValue):
    """A suggested date for an inbox task."""

    date: ADate
    description: str
