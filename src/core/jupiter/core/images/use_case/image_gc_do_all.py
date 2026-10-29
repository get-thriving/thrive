"""Background removal of images in the store that no row names."""

import logging

from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.core.images.root import Image
from jupiter.core.images.service.plan_image_gc import plan_image_gc
from jupiter.core.images.service.remove_stored_image import RemoveStoredImageService
from jupiter.core.images.store.image_purpose import ImagePurpose
from jupiter.framework.use_case import background_mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


@use_case_args
class ImageGcDoAllArgs(UseCaseArgsBase):
    """Args for the image-gc-do-all cron."""


@background_mutation_use_case("30 4 * * *")
class ImageGcDoAllUseCase(JupiterBackgroundMutationUseCase[ImageGcDoAllArgs, None]):
    """Remove the objects in the image store that no image row names.

    They come from a crash between storing an object and committing its row, from
    a failed delete after a commit, and from removals that happened outside of
    this process. Rows whose object is gone are only counted: a user whose
    picture went missing is shown the one drawn from their name.
    """

    async def _execute(
        self,
        context: JupiterBackgroundMutationContext,
        args: ImageGcDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        image_store = self._ports.image_store
        remove_stored_image = RemoveStoredImageService(image_store)
        now = self._time_provider.get_current_time()

        for purpose in ImagePurpose:
            # The store first, then the rows: an object that is put in the store
            # after we listed it is not ours to judge, and one whose row is
            # committed just after we read the rows is protected by its age.
            stored = [info async for info in image_store.list_images(purpose)]
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                images = await uow.get_for(Image).find_all_generic(allow_archived=True)
            known_paths = [
                image.store_path for image in images if image.purpose == purpose
            ]

            plan = plan_image_gc(stored, known_paths, now)

            LOGGER.info(
                "image_gc_do_all purpose=%s stored=%d rows=%d removing=%d "
                "left_for_next_run=%d young_orphans=%d rows_without_object=%d",
                purpose.value,
                len(stored),
                len(known_paths),
                len(plan.to_remove),
                plan.left_for_next_run,
                plan.young_orphans,
                plan.rows_without_object,
            )

            for path in plan.to_remove:
                await remove_stored_image.do_it(purpose, path)
