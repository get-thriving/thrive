"""The access control domain root entity."""

import abc

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    RootEntity,
    create_entity_action,
    entity,
)
from jupiter.framework.storage.repository import (
    EntityNotFoundError,
    RootEntityRepository,
)

THE_ACCESS_DOMAIN_REF_ID = EntityId("1")


@entity
class AccessDomain(RootEntity):
    """The singleton access domain for application-wide document sharing and access control."""

    @staticmethod
    @create_entity_action
    def new_access_domain(ctx: DomainContext) -> "AccessDomain":
        """Create the access domain singleton."""
        raise RuntimeError("AccessDomain singleton should never be created directly")


class AccessDomainNotFoundError(EntityNotFoundError):
    """Error raised when the access domain is not found."""


class AccessDomainRepository(RootEntityRepository[AccessDomain], abc.ABC):
    """Repository for the access domain singleton."""

    @abc.abstractmethod
    async def load_the_access_domain(self) -> AccessDomain:
        """Load the singleton access domain."""
