"""Use case for exchanging a one-time OAuth code for MCP tokens."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.auth.sub.oauth_grant.client_id import OAuthClientId
from jupiter.core.auth.sub.oauth_grant.oauth_code_external import OAuthCodeExternal
from jupiter.core.auth.sub.oauth_grant.oauth_refresh_token_external import (
    OAuthRefreshTokenExternal,
)
from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
from jupiter.core.auth.sub.oauth_grant.pkce_code_verifier import PkceCodeVerifier
from jupiter.core.auth.sub.oauth_grant.resource import OAuthResource
from jupiter.core.auth.sub.oauth_grant.root import (
    InvalidOAuthGrantError,
    OAuthGrant,
)
from jupiter.core.common.system_url import SystemUrl
from jupiter.core.config import (
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import EntityNotFoundError
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class OAuthTokenExchangeArgs(UseCaseArgsBase):
    """OAuth token exchange args."""

    code: OAuthCodeExternal
    code_verifier: PkceCodeVerifier
    client_id: OAuthClientId
    redirect_uri: SystemUrl
    resource: OAuthResource


@use_case_result
class OAuthTokenExchangeResult(UseCaseResultBase):
    """OAuth token exchange result: a short-lived MCP token and the first refresh token."""

    auth_token_ext: AuthTokenExt
    refresh_token: OAuthRefreshTokenExternal
    expires_in_secs: int


@secure_class
class OAuthTokenExchangeUseCase(
    JupiterGuestMutationUseCase[OAuthTokenExchangeArgs, OAuthTokenExchangeResult]
):
    """Use case for exchanging a one-time code for MCP tokens."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: OAuthTokenExchangeArgs,
    ) -> OAuthTokenExchangeResult:
        """Execute the command's action."""
        right_now = self._time_provider.get_current_time()
        ref_id = args.code.grant_ref_id
        new_refresh_plain = OAuthSecretPlain.generate()
        failure: InvalidOAuthGrantError | None = None

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            try:
                grant = await uow.get_for(OAuthGrant).load_by_id(ref_id)
            except EntityNotFoundError as err:
                raise InvalidOAuthGrantError("Unknown code") from err
            if grant.archived:
                raise InvalidOAuthGrantError("Grant was revoked")

            if grant.code_redeemed:
                # A code is single use: seeing it again means it leaked, so end the grant.
                grant = grant.mark_archived(
                    context.domain_context, JupiterArchivalReason.USER
                )
                await uow.get_for(OAuthGrant).save(grant)
                failure = InvalidOAuthGrantError("Code was already redeemed")
            else:
                try:
                    grant = grant.redeem_code(
                        ctx=context.domain_context,
                        right_now=right_now,
                        code_plain=args.code.secret,
                        code_verifier=args.code_verifier,
                        client_id=args.client_id,
                        redirect_uri=args.redirect_uri,
                        resource=args.resource,
                        new_refresh_plain=new_refresh_plain,
                    )
                except InvalidOAuthGrantError as err:
                    failure = err
                else:
                    await uow.get_for(OAuthGrant).save(grant)

        if failure is not None:
            raise failure

        auth_token = self._auth_token_stamper.stamp_for_mcp(grant.user.ref_id)
        seconds_left = int(
            (auth_token.expiration_time.value - right_now.value).total_seconds()
        )
        return OAuthTokenExchangeResult(
            auth_token_ext=auth_token.to_ext(),
            refresh_token=OAuthRefreshTokenExternal(
                grant_ref_id=grant.ref_id, secret=new_refresh_plain
            ),
            expires_in_secs=max(0, seconds_left),
        )
