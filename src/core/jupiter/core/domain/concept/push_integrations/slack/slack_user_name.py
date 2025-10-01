"""A Slack user name."""

from jupiter.framework_new.base.entity_name import EntityName
from jupiter.framework_new.value import hashable_value


@hashable_value
class SlackUserName(EntityName):
    """A Slack user name."""
