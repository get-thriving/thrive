"""Lightweight user summary for display and search."""

from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.name import UserName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.value import CompositeValue, value


@value
class UserLight(CompositeValue):
    """A user's ref id, name, and email address."""

    ref_id: EntityId
    name: UserName
    email_address: EmailAddress
