"""Daily validation of Apple refresh tokens."""

import logging

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.apple.oauth_client import AppleRefreshTokenRevokedError
from jupiter.core.auth.sub.apple.root import AuthApple, AuthAppleNotFoundError
from jupiter.core.backend_blend import JupiterAuthProvider
from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.core.users.root import UserRepository
from jupiter.framework.use_case import background_mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


@use_case_args
class SyncAppleUserDataDoAllArgs(UseCaseArgsBase):
    """Args for the sync-apple-user-data-do-all cron."""


@background_mutation_use_case("0 6 * * *")
class SyncAppleUserDataDoAllUseCase(
    JupiterBackgroundMutationUseCase[SyncAppleUserDataDoAllArgs, None]
):
    """Validate Apple refresh tokens and store rotations. No profile update."""

    async def _execute(
        self,
        context: JupiterBackgroundMutationContext,
        args: SyncAppleUserDataDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        if (
            self._global_properties.auth_provider
            != JupiterAuthProvider.LOCAL_GOOGLE_APPLE
        ):
            LOGGER.info(
                "sync_apple_user_data_do_all skipped: Apple OAuth is not enabled"
            )
            return
        if self._ports.apple_oauth_client is None:
            raise RuntimeError("Apple OAuth client is not configured")

        apple_oauth_client = self._ports.apple_oauth_client

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            apple_users = await uow.get(
                UserRepository
            ).find_all_unarchived_by_auth_method(UserAuthMethod.APPLE)

        for user in apple_users:
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                try:
                    auth_apple = await uow.get_for(AuthApple).load_by_parent(
                        user.ref_id
                    )
                except AuthAppleNotFoundError:
                    LOGGER.error(
                        "sync_apple_user_data_do_all skipping user ref_id=%s: "
                        "no AuthApple record",
                        user.ref_id,
                    )
                    continue

                if auth_apple.refresh_token_expired:
                    LOGGER.warning(
                        "sync_apple_user_data_do_all skipping user ref_id=%s: "
                        "refresh token expired",
                        user.ref_id,
                    )
                    continue

                try:
                    rotated_refresh_token = (
                        await apple_oauth_client.validate_refresh_token(
                            auth_apple.refresh_token
                        )
                    )
                except AppleRefreshTokenRevokedError:
                    auth_apple = auth_apple.revoke_refresh_token(
                        context.domain_context,
                        apple_oauth_client.cleared_refresh_token(),
                    )
                    await uow.get_for(AuthApple).save(auth_apple)
                    LOGGER.info(
                        "sync_apple_user_data_do_all revoked refresh token for "
                        "user ref_id=%s",
                        user.ref_id,
                    )
                    continue

                if rotated_refresh_token is not None:
                    auth_apple = auth_apple.update_refresh_token(
                        context.domain_context,
                        rotated_refresh_token,
                    )
                    await uow.get_for(AuthApple).save(auth_apple)

                LOGGER.info(
                    "sync_apple_user_data_do_all validated refresh token for "
                    "user ref_id=%s",
                    user.ref_id,
                )
