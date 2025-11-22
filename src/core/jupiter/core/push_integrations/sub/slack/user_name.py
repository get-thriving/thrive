"""A Slack user name."""

from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.value import hashable_value


@hashable_value
class SlackUserName(EntityName):
    """A Slack user name."""
