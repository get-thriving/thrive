"""Clear provider auth credentials when an account is closed."""

import logging
from typing import Final, assert_never

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.apple.oauth_client import AppleOauthClient
from jupiter.core.auth.sub.apple.root import AuthApple, AuthAppleNotFoundError
from jupiter.core.users.root import User
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainUnitOfWork

LOGGER = logging.getLogger(__name__)


class UrgentClearAuthInfoForUser:
    """Revoke provider credentials that must not outlive a closed account."""

    _apple_oauth_client: Final[AppleOauthClient | None]

    def __init__(self, apple_oauth_client: AppleOauthClient | None) -> None:
        """Constructor."""
        self._apple_oauth_client = apple_oauth_client

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        ctx: DomainContext,
        user: User,
    ) -> None:
        """Clear auth info the provider requires us to drop on account close.

        Google and local accounts have nothing to revoke.
        """
        match user.auth_method:
            case UserAuthMethod.APPLE:
                await self._revoke_apple_refresh_token(uow, ctx, user)
            case UserAuthMethod.GOOGLE:
                return
            case UserAuthMethod.LOCAL:
                return
            case _ as unreachable:
                assert_never(unreachable)

    async def _revoke_apple_refresh_token(
        self,
        uow: DomainUnitOfWork,
        ctx: DomainContext,
        user: User,
    ) -> None:
        """Revoke the Apple refresh token.

        Apple requires this when an account is deleted. A failed HTTP call is
        logged and does not stop the close. The daily job only sees unarchived
        users, so this is the only attempt.
        """
        apple_oauth_client = self._apple_oauth_client
        if apple_oauth_client is None:
            LOGGER.error(
                "urgent_clear_auth_info_for_user skipping Apple token revoke for "
                "user ref_id=%s: Apple OAuth client is not configured",
                user.ref_id,
            )
            return

        try:
            auth_apple = await uow.get_for(AuthApple).load_by_parent(user.ref_id)
        except AuthAppleNotFoundError:
            LOGGER.error(
                "urgent_clear_auth_info_for_user skipping Apple token revoke for "
                "user ref_id=%s: no AuthApple record",
                user.ref_id,
            )
            return

        if auth_apple.refresh_token_expired:
            return

        try:
            await apple_oauth_client.revoke_refresh_token(auth_apple.refresh_token)
        except Exception:
            LOGGER.exception(
                "urgent_clear_auth_info_for_user Apple token revoke failed for "
                "user ref_id=%s",
                user.ref_id,
            )

        auth_apple = auth_apple.revoke_refresh_token(
            ctx,
            apple_oauth_client.cleared_refresh_token(),
        )
        await uow.get_for(AuthApple).save(auth_apple)
