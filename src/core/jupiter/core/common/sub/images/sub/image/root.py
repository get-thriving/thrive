"""A stored image, owned by a user or a workspace."""

from typing import Final

from jupiter.core.common.sub.images.sub.image.image_content_hash import ImageContentHash
from jupiter.core.common.sub.images.sub.image.image_content_type import ImageContentType
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.image_source import ImageSource
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm

DEFAULT_IMAGE_NAME: Final[EntityName] = EntityName("Image")

# Sanity bounds for a stored image. These mirror the caps the normaliser
# accepts pictures under (4 MB, 40 million pixels); what it stores is far
# smaller (at most 256x256), so a size outside them is corrupt, not merely
# unusual.
MAX_IMAGE_SIZE_IN_BYTES: Final[int] = 4 * 1024 * 1024
MAX_IMAGE_PIXELS: Final[int] = 40_000_000


@entity("ImageDomain")
@only_in_realm(DatabaseRealm)
class Image(LeafSupportEntity):
    """A stored image, owned by a user or a workspace.

    The row is what ties an object in the image store to the owner it belongs
    to, so that it can be found and removed with them. The owner is a link to a
    user or a workspace, kept apart from the parent as those are two different
    roots. The owner points at the image it currently shows, and an image is
    never edited: a new picture is a new image, at a new path, and the old one
    is removed.
    """

    image_domain: ParentLink
    owner: EntityLink
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
        image_domain_ref_id: EntityId,
        owner: EntityLink,
        purpose: ImagePurpose,
        store_path: ImagePath,
        content_hash: ImageContentHash,
        size_in_bytes: int,
        width: int,
        height: int,
        source: ImageSource,
    ) -> "Image":
        """Create a new image."""
        if not 0 < size_in_bytes <= MAX_IMAGE_SIZE_IN_BYTES:
            raise InputValidationError(
                f"Image size must be between 1 and {MAX_IMAGE_SIZE_IN_BYTES} bytes, "
                f"got {size_in_bytes}"
            )
        if width <= 0 or height <= 0:
            raise InputValidationError(
                f"Image dimensions must be positive, got {width}x{height}"
            )
        if width * height > MAX_IMAGE_PIXELS:
            raise InputValidationError(
                f"Image has too many pixels: at most {MAX_IMAGE_PIXELS}, "
                f"got {width}x{height}"
            )
        return Image._create(
            ctx,
            name=DEFAULT_IMAGE_NAME,
            image_domain=ParentLink(image_domain_ref_id),
            owner=owner,
            purpose=purpose,
            store_path=store_path,
            content_type=store_path.content_type,
            content_hash=content_hash,
            size_in_bytes=size_in_bytes,
            width=width,
            height=height,
            source=source,
        )
