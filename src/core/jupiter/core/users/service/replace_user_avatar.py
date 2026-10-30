"""Show a new picture for a user, in place of the one they had."""

from jupiter.core.common.sub.images.root import ImageDomainRepository
from jupiter.core.common.sub.images.sub.image.image_normaliser import NormalisedImage
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.image_source import ImageSource
from jupiter.core.common.sub.images.sub.image.root import Image
from jupiter.core.users.root import User
from jupiter.core.users.service.remove_user_avatar_image import (
    RemoveUserAvatarImageService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class ReplaceUserAvatarService:
    """Show a new picture for a user, in place of the one they had.

    Meant to run in a transaction, with the picture already in the store. The
    user is read again here rather than trusted from the start of the request,
    so that whichever picture they show right now is the one that goes.
    """

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
        store_path: ImagePath,
        picture: NormalisedImage,
        source: ImageSource,
    ) -> tuple[Image, Image | None]:
        """Show the picture. Gives the new image and the one it replaced, if any."""
        user = await uow.get_for(User).load_by_id(user_ref_id)

        replaced = await RemoveUserAvatarImageService().do_it(ctx, uow, user)

        image_domain = await uow.get(ImageDomainRepository).load_the_image_domain()
        image = await uow.get_for(Image).create(
            Image.new_image(
                ctx,
                image_domain_ref_id=image_domain.ref_id,
                owner=EntityLink.std(User.__name__, user_ref_id),
                purpose=ImagePurpose.AVATARS,
                store_path=store_path,
                content_hash=picture.content_hash,
                size_in_bytes=picture.size_in_bytes,
                width=picture.width,
                height=picture.height,
                source=source,
            )
        )
        await uow.get_for(User).save(user.change_avatar(ctx, image.ref_id))

        return image, replaced
