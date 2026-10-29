"""Use case for a user uploading their picture."""

import asyncio
import base64
import binascii
from typing import Final

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.images.image_source import ImageSource
from jupiter.core.images.normaliser.image_normaliser import (
    MAX_INPUT_BYTES,
    ImageNormaliser,
)
from jupiter.core.images.service.remove_stored_image import RemoveStoredImageService
from jupiter.core.images.store.image_path import ImagePath
from jupiter.core.images.store.image_purpose import ImagePurpose
from jupiter.core.images.store.image_url import ImageUrl
from jupiter.core.users.service.replace_user_avatar import ReplaceUserAvatarService
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)

_MAX_BASE64_CHARS: Final[int] = ((MAX_INPUT_BYTES + 2) // 3) * 4


@use_case_args
class UserAvatarUploadArgs(UseCaseArgsBase):
    """UserAvatarUpload args."""

    # The API speaks JSON, which has no bytes. Pictures are small enough for this.
    image_base64: str


@use_case_result
class UserAvatarUploadResult(UseCaseResultBase):
    """UserAvatarUpload result."""

    avatar_url: ImageUrl


@mutation_use_case()
class UserAvatarUploadUseCase(
    JupiterLoggedInMutationUseCase[UserAvatarUploadArgs, UserAvatarUploadResult]
):
    """Use case for a user uploading their picture.

    The picture is cleaned up, stored, and only then pointed at, so the database
    never names an object that isn't there. The one it replaces is removed from
    the store once the database no longer names it.
    """

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: UserAvatarUploadArgs,
    ) -> UserAvatarUploadResult:
        """Execute the command's action."""
        picture = await asyncio.to_thread(
            ImageNormaliser().normalise, self._decode(args.image_base64)
        )
        image_store = self._ports.image_store
        remove_stored_image = RemoveStoredImageService(image_store)

        path = ImagePath.new_random(picture.content_type)
        await image_store.put(ImagePurpose.AVATARS, path, picture.as_stored_image())

        try:
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                image, replaced = await ReplaceUserAvatarService().do_it(
                    context.domain_context,
                    uow,
                    context.user.ref_id,
                    path,
                    picture,
                    ImageSource.UPLOADED,
                )
        except BaseException:
            # The database did not take it, so the object has no owner.
            await remove_stored_image.do_it(ImagePurpose.AVATARS, path)
            raise

        if replaced is not None:
            await remove_stored_image.do_it(replaced.purpose, replaced.store_path)

        link = await image_store.get_serving_link(image.purpose, image.store_path)
        return UserAvatarUploadResult(avatar_url=link.url)

    @staticmethod
    def _decode(image_base64: str) -> bytes:
        """Get the bytes out of what came in the request."""
        if len(image_base64) > _MAX_BASE64_CHARS:
            raise InputValidationError(
                f"The picture is too big: at most {MAX_INPUT_BYTES // (1024 * 1024)} MB"
            )
        try:
            return base64.b64decode(image_base64, validate=True)
        except (binascii.Error, ValueError):
            raise InputValidationError("The picture could not be read") from None
