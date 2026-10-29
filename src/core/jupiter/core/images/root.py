"""A stored image that belongs to a user."""

from typing import Final

from jupiter.core.images.image_content_hash import ImageContentHash
from jupiter.core.images.image_source import ImageSource
from jupiter.core.images.store.image_content_type import ImageContentType
from jupiter.core.images.store.image_path import ImagePath
from jupiter.core.images.store.image_purpose import ImagePurpose
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
)
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm

DEFAULT_IMAGE_NAME: Final[EntityName] = EntityName("Image")


@entity("User")
@only_in_realm(DatabaseRealm)
class Image(LeafSupportEntity):
    """A stored image that belongs to a user.

    The row is what ties an object in the image store to the user it belongs
    to, so that it can be found and removed with them. The user points at the
    image it currently shows, and an image is never edited: a new picture is a
    new image, at a new path, and the old one is removed.
    """

    user: ParentLink
    purpose: ImagePurpose
    store_path: ImagePath
    content_type: ImageContentType
    content_hash: ImageContentHash
    size_in_bytes: int
    width: int
    height: int
    source: ImageSource

    @staticmethod
    @create_entity_action
    def new_image(
        ctx: DomainContext,
        user_ref_id: EntityId,
        purpose: ImagePurpose,
        store_path: ImagePath,
        content_hash: ImageContentHash,
        size_in_bytes: int,
        width: int,
        height: int,
        source: ImageSource,
    ) -> "Image":
        """Create a new image."""
        return Image._create(
            ctx,
            name=DEFAULT_IMAGE_NAME,
            user=ParentLink(user_ref_id),
            purpose=purpose,
            store_path=store_path,
            content_type=store_path.content_type,
            content_hash=content_hash,
            size_in_bytes=size_in_bytes,
            width=width,
            height=height,
            source=source,
        )
