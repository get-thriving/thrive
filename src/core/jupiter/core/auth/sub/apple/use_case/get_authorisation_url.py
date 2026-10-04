"""Use case for building an Apple OAuth authorisation URL."""

from jupiter.core.backend_blend import JupiterAuthProvider
from jupiter.core.common.system_url import SystemUrl
from jupiter.core.common.url import URL
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.secure import secure_class
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class AuthAppleGetAuthorisationUrlArgs(UseCaseArgsBase):
    """Arguments for building an Apple OAuth authorisation URL."""

    ready_url: SystemUrl
    callback_success_url: SystemUrl
    callback_failure_url: SystemUrl


@use_case_result
class AuthAppleGetAuthorisationUrlResult(UseCaseResultBase):
    """Result with the Apple OAuth authorisation URL and state."""

    authorisation_url: URL
    state: str


@secure_class
class AuthAppleGetAuthorisationUrlUseCase(
    JupiterGuestReadonlyUseCase[
        AuthAppleGetAuthorisationUrlArgs, AuthAppleGetAuthorisationUrlResult
    ],
):
    """Build an Apple OAuth authorisation redirect URL."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: AuthAppleGetAuthorisationUrlArgs,
    ) -> AuthAppleGetAuthorisationUrlResult:
        """Execute the command."""
        if (
            self._global_properties.auth_provider
            != JupiterAuthProvider.LOCAL_GOOGLE_APPLE
        ):
            raise InputValidationError("Apple OAuth client is not configured")
        if self._ports.apple_oauth_client is None:
            raise RuntimeError("Apple OAuth client is not configured")
        authorisation_url, state = self._ports.apple_oauth_client.get_authorisation_url(
            args.ready_url,
            args.callback_success_url,
            args.callback_failure_url,
        )
        return AuthAppleGetAuthorisationUrlResult(
            authorisation_url=authorisation_url,
            state=state,
        )
