"""Use case for loading a stored image to serve it."""

import base64

from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.images.store.image_content_type import ImageContentType
from jupiter.core.images.store.image_path import ImagePath
from jupiter.core.images.store.image_purpose import ImagePurpose
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ImageLoadArgs(UseCaseArgsBase):
    """ImageLoad args."""

    purpose: ImagePurpose
    path: ImagePath


@use_case_result
class ImageLoadResult(UseCaseResultBase):
    """ImageLoad result."""

    content_type: ImageContentType
    # The API speaks JSON, which has no bytes. Images are small enough for this.
    content_base64: str


class ImageLoadUseCase(JupiterGuestReadonlyUseCase[ImageLoadArgs, ImageLoadResult]):
    """Use case for loading a stored image to serve it.

    For stores a browser can't reach, the WebUI serves the images through this.
    Nobody has to be logged in: the path of an image is its secret, as it is in
    a public bucket.
    """

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: ImageLoadArgs,
    ) -> ImageLoadResult:
        """Execute the command's action."""
        image = await self._ports.image_store.load(args.purpose, args.path)
        return ImageLoadResult(
            content_type=image.content_type,
            content_base64=base64.b64encode(image.content).decode("ascii"),
        )
