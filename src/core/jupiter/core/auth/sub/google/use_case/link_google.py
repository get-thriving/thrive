"""Use case for linking a Google account to the signed in user."""

from jupiter.core.application.service.google_login import GoogleLoginService
from jupiter.core.auth.service.link_google_auth import LinkGoogleAuthService
from jupiter.core.auth.sub.google.google_auth_code import GoogleAuthCode
from jupiter.core.common.system_url import SystemUrl
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class LinkGoogleArgs(UseCaseArgsBase):
    """Link (Google auth) arguments."""

    google_auth_code: GoogleAuthCode
    callback_uri: SystemUrl


@secure_class
@mutation_use_case()
class LinkGoogleUseCase(
    JupiterTransactionalLoggedInMutationUseCase[LinkGoogleArgs, None]
):
    """Use case for linking a Google account to the signed in user."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
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

        await LinkGoogleAuthService().do_it(
            uow, context.domain_context, context.user, google_user_info
        )
