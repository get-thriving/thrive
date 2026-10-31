"""Show the picture Google has for a user, where that is theirs to change."""

import asyncio
import logging
from typing import Final

from jupiter.core.auth.sub.google.profile_picture_fetcher import (
    GoogleProfilePictureFetcher,
)
from jupiter.core.common.sub.images.image_store import ImageStore
from jupiter.core.common.sub.images.sub.image.image_normaliser import ImageNormaliser
from jupiter.core.common.sub.images.sub.image.image_path import ImagePath
from jupiter.core.common.sub.images.sub.image.image_purpose import ImagePurpose
from jupiter.core.common.sub.images.sub.image.image_source import ImageSource
from jupiter.core.common.sub.images.sub.image.root import Image
from jupiter.core.common.sub.images.sub.image.service.remove_stored_image import (
    RemoveStoredImageService,
)
from jupiter.core.users.root import User
from jupiter.core.users.service.replace_user_avatar import ReplaceUserAvatarService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import (
    DomainStorageEngine,
    DomainUnitOfWork,
    EntityNotFoundError,
)

LOGGER = logging.getLogger(__name__)


class ApplyGoogleProfilePictureService:
    """Show the picture Google has for a user, where that is theirs to change.

    A picture the user uploaded is never replaced. A user with none gets
    Google's only when `fill_empty` says so, which is on signing up and on
    linking, and not on the daily refresh: someone who removed it does not want
    it back. A picture that came from Google follows Google, and is left alone
    when it has not changed.

    Best effort: a login must not fail because a picture would not download, so
    whatever goes wrong is logged and the user keeps what they had.
    """

    _storage_engine: Final[DomainStorageEngine]
    _image_store: Final[ImageStore]
    _fetcher: Final[GoogleProfilePictureFetcher]

    def __init__(
        self,
        storage_engine: DomainStorageEngine,
        image_store: ImageStore,
        fetcher: GoogleProfilePictureFetcher | None = None,
    ) -> None:
        """Constructor."""
        self._storage_engine = storage_engine
        self._image_store = image_store
        self._fetcher = fetcher or GoogleProfilePictureFetcher()

    async def do_it(
        self,
        ctx: DomainContext,
        user_ref_id: EntityId,
        picture_url: str | None,
        *,
        fill_empty: bool,
    ) -> None:
        """Show the picture, if it is to be shown."""
        if picture_url is None:
            return

        try:
            await self._do_it(ctx, user_ref_id, picture_url, fill_empty)
        except Exception:  # noqa: BLE001
            LOGGER.warning(
                "Could not use the Google picture of user ref_id=%s",
                user_ref_id,
                exc_info=True,
            )

    async def _do_it(
        self,
        ctx: DomainContext,
        user_ref_id: EntityId,
        picture_url: str,
        fill_empty: bool,
    ) -> None:
        async with self._storage_engine.get_unit_of_work() as uow:
            allowed, current = await self._may_replace(uow, user_ref_id, fill_empty)
        if not allowed:
            return

        raw = await self._fetcher.fetch(picture_url)
        if raw is None:
            return
        picture = await asyncio.to_thread(ImageNormaliser().normalise, raw)
        if current is not None and current.content_hash == picture.content_hash:
            return

        path = ImagePath.new_random(picture.content_type)
        await self._image_store.put(
            ImagePurpose.AVATARS, path, picture.as_stored_image()
        )
        remove_stored_image = RemoveStoredImageService(self._image_store)

        try:
            async with self._storage_engine.get_unit_of_work() as uow:
                # Things may have changed while we were downloading.
                allowed, _ = await self._may_replace(uow, user_ref_id, fill_empty)
                if not allowed:
                    await remove_stored_image.do_it(ImagePurpose.AVATARS, path)
                    return
                _, replaced = await ReplaceUserAvatarService().do_it(
                    ctx, uow, user_ref_id, path, picture, ImageSource.GOOGLE
                )
        except BaseException:
            await remove_stored_image.do_it(ImagePurpose.AVATARS, path)
            raise

        if replaced is not None:
            await remove_stored_image.do_it(replaced.purpose, replaced.store_path)

    @staticmethod
    async def _may_replace(
        uow: DomainUnitOfWork, user_ref_id: EntityId, fill_empty: bool
    ) -> tuple[bool, Image | None]:
        """Whether Google's picture may go in, and the picture it would replace."""
        user = await uow.get_for(User).load_by_id(user_ref_id)
        if user.avatar_image_ref_id is None:
            return fill_empty, None

        try:
            image = await uow.get_for(Image).load_by_id(user.avatar_image_ref_id)
        except EntityNotFoundError:
            return fill_empty, None

        return image.source == ImageSource.GOOGLE, image
