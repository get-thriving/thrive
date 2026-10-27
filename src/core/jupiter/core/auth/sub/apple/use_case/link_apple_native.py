"""Use case for linking a Apple account to the signed in user, natively."""

from jupiter.core.application.service.apple_login import AppleLoginService
from jupiter.core.auth.service.link_apple_auth import LinkAppleAuthService
from jupiter.core.auth.sub.apple.apple_auth_code import AppleAuthCode
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
class LinkAppleNativeArgs(UseCaseArgsBase):
    """Link (native Apple sign in) arguments."""

    # The code from the Apple SDK in the app shell.
    apple_auth_code: AppleAuthCode
    apple_user_json: str | None


@secure_class
@mutation_use_case()
class LinkAppleNativeUseCase(
    JupiterTransactionalLoggedInMutationUseCase[LinkAppleNativeArgs, None]
):
    """Use case for linking a Apple account after native sign in."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LinkAppleNativeArgs,
    ) -> None:
        """Execute the command's action."""
        login_service = AppleLoginService(
            self._ports,
            self._global_properties,
            self._time_provider,
            self._auth_token_stamper,
        )
        login_service.check_enabled()
        assert self._ports.apple_oauth_client is not None

        apple_user_info = (
            await self._ports.apple_oauth_client.get_user_info_from_native_code(
                args.apple_auth_code.code_raw,
                args.apple_user_json,
            )
        )

        await LinkAppleAuthService().do_it(
            uow, context.domain_context, context.user, apple_user_info
        )
