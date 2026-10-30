"""The images domain root entity."""

import abc

from jupiter.core.common.sub.images.sub.image.root import Image
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    IsRefId,
    RootEntity,
    create_entity_action,
    entity,
)
from jupiter.framework.storage.repository import (
    EntityNotFoundError,
    RootEntityRepository,
)

THE_IMAGE_DOMAIN_REF_ID = EntityId("1")


@entity
class ImageDomain(RootEntity):
    """The singleton images domain, for the images of users and workspaces alike."""

    images = ContainsMany(Image, image_domain_ref_id=IsRefId())

    @staticmethod
    @create_entity_action
    def new_image_domain(ctx: DomainContext) -> "ImageDomain":
        """Create the images domain singleton."""
        raise RuntimeError("ImageDomain singleton should never be created directly")


class ImageDomainNotFoundError(EntityNotFoundError):
    """Error raised when the images domain is not found."""


class ImageDomainRepository(RootEntityRepository[ImageDomain], abc.ABC):
    """Repository for the images domain singleton."""

    @abc.abstractmethod
    async def load_the_image_domain(self) -> ImageDomain:
        """Load the singleton images domain."""
