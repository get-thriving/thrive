"""Summary of a user returned by user search, safe for invite autocomplete."""

from jupiter.core.common.email_address import EmailAddress
from jupiter.core.users.name import UserName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.value import CompositeValue, value


@value
class UserSearchMatch(CompositeValue):
    """Summary of a user returned by user search, safe for invite autocomplete."""

    ref_id: EntityId
    name: UserName
    email_address: EmailAddress
