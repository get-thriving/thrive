"""Use case for linking a Google account to the signed in user."""

from jupiter.core.application.service.google_login import GoogleLoginService
from jupiter.core.auth.service.apply_google_profile_picture import (
    ApplyGoogleProfilePictureService,
)
from jupiter.core.auth.service.link_google_auth import LinkGoogleAuthService
from jupiter.core.auth.sub.google.google_auth_code import GoogleAuthCode
from jupiter.core.common.system_url import SystemUrl
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class LinkGoogleArgs(UseCaseArgsBase):
    """Link (Google auth) arguments."""

    google_auth_code: GoogleAuthCode
    callback_uri: SystemUrl


@secure_class
@mutation_use_case()
class LinkGoogleUseCase(JupiterLoggedInMutationUseCase[LinkGoogleArgs, None]):
    """Use case for linking a Google account to the signed in user."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LinkGoogleArgs,
    ) -> None:
        """Execute the command's action."""
        login_service = GoogleLoginService(
            self._ports,
            self._global_properties,
            self._time_provider,
            self._auth_token_stamper,
        )
        login_service.check_enabled()
        assert self._ports.google_oauth_client is not None

        google_user_info = await self._ports.google_oauth_client.get_user_info(
            args.google_auth_code.code_raw,
            args.callback_uri,
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            await LinkGoogleAuthService().do_it(
                uow, context.domain_context, context.user, google_user_info
            )

        # After the commit, as it downloads. A Google picture only fills an
        # empty spot or follows an earlier Google one, never an uploaded one.
        await ApplyGoogleProfilePictureService(
            self._ports.domain_storage_engine, self._ports.image_store
        ).do_it(
            context.domain_context,
            context.user.ref_id,
            google_user_info.picture_url,
            fill_empty=True,
        )
