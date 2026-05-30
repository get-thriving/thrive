"""Use case for building a Google OAuth authorisation URL."""

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
class AuthGoogleGetAuthorisationUrlArgs(UseCaseArgsBase):
    """Arguments for building a Google OAuth authorisation URL."""

    callback_uri: SystemUrl


@use_case_result
class AuthGoogleGetAuthorisationUrlResult(UseCaseResultBase):
    """Result with the Google OAuth authorisation URL and state."""

    authorisation_url: URL
    state: str


@secure_class
class AuthGoogleGetAuthorisationUrlUseCase(
    JupiterGuestReadonlyUseCase[
        AuthGoogleGetAuthorisationUrlArgs, AuthGoogleGetAuthorisationUrlResult
    ],
):
    """Build a Google OAuth authorisation redirect URL."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: AuthGoogleGetAuthorisationUrlArgs,
    ) -> AuthGoogleGetAuthorisationUrlResult:
        """Execute the command."""
        if (
            self._global_properties.auth_provider
            != JupiterAuthProvider.LOCAL_GOOGLE_APPLE
        ):
            raise InputValidationError("Google OAuth client is not configured")
        if self._ports.google_oauth_client is None:
            raise RuntimeError("Google OAuth client is not configured")
        authorisation_url, state = (
            self._ports.google_oauth_client.get_authorisation_url(args.callback_uri)
        )
        return AuthGoogleGetAuthorisationUrlResult(
            authorisation_url=authorisation_url,
            state=state,
        )
