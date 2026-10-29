"""Use case for a user going back to the picture generated from their name."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.images.service.remove_stored_image import RemoveStoredImageService
from jupiter.core.images.store.image_url import ImageUrl
from jupiter.core.users.root import User
from jupiter.core.users.service.clear_user_avatar import ClearUserAvatarService
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class UserAvatarClearArgs(UseCaseArgsBase):
    """UserAvatarClear args."""


@use_case_result
class UserAvatarClearResult(UseCaseResultBase):
    """UserAvatarClear result."""

    avatar_url: ImageUrl


@mutation_use_case()
class UserAvatarClearUseCase(
    JupiterLoggedInMutationUseCase[UserAvatarClearArgs, UserAvatarClearResult]
):
    """Use case for a user going back to the picture generated from their name."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: UserAvatarClearArgs,
    ) -> UserAvatarClearResult:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            removed = await ClearUserAvatarService().do_it(
                context.domain_context, uow, context.user.ref_id
            )
            user = await uow.get_for(User).load_by_id(context.user.ref_id)

        if removed is not None:
            await RemoveStoredImageService(self._ports.image_store).do_it(
                removed.purpose, removed.store_path
            )

        return UserAvatarClearResult(
            avatar_url=ImageUrl(user.generated_avatar.avatar_as_data_url)
        )
