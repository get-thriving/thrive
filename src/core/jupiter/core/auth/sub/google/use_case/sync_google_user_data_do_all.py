"""Daily sync of Google-authenticated user profiles and refresh tokens."""

import logging

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.service.apply_google_profile_picture import (
    ApplyGoogleProfilePictureService,
)
from jupiter.core.auth.sub.google.oauth_client import GoogleRefreshTokenRevokedError
from jupiter.core.auth.sub.google.root import (
    AuthGoogle,
    AuthGoogleNotFoundError,
    AuthGoogleRepository,
)
from jupiter.core.backend_blend import JupiterAuthProvider
from jupiter.core.config import (
    JupiterBackgroundMutationContext,
    JupiterBackgroundMutationUseCase,
)
from jupiter.core.users.root import User
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.use_case import background_mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

LOGGER = logging.getLogger(__name__)


@use_case_args
class SyncGoogleUserDataDoAllArgs(UseCaseArgsBase):
    """Args for the sync-google-user-data-do-all cron."""


@background_mutation_use_case("0 5 * * *")
class SyncGoogleUserDataDoAllUseCase(
    JupiterBackgroundMutationUseCase[SyncGoogleUserDataDoAllArgs, None]
):
    """Refresh Google OAuth tokens and sync user profile data from Google."""

    async def _execute(
        self,
        context: JupiterBackgroundMutationContext,
        args: SyncGoogleUserDataDoAllArgs,
    ) -> None:
        """Execute the command's action."""
        if (
            self._global_properties.auth_provider
            != JupiterAuthProvider.LOCAL_GOOGLE_APPLE
        ):
            LOGGER.info(
                "sync_google_user_data_do_all skipped: Google OAuth is not enabled"
            )
            return
        if self._ports.google_oauth_client is None:
            raise RuntimeError("Google OAuth client is not configured")

        google_oauth_client = self._ports.google_oauth_client

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            google_users = []
            for auth in await uow.get(AuthGoogleRepository).find_all_auth():
                linked_user = await uow.get_for(User).load_optional_by_id(
                    auth.user.ref_id
                )
                if linked_user is not None:
                    google_users.append(linked_user)

        pictures_to_apply: list[tuple[EntityId, str | None]] = []
        for user in google_users:
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                try:
                    auth_google = await uow.get_for(AuthGoogle).load_by_parent(
                        user.ref_id
                    )
                except AuthGoogleNotFoundError:
                    LOGGER.error(
                        "sync_google_user_data_do_all skipping user ref_id=%s: "
                        "no AuthGoogle record",
                        user.ref_id,
                    )
                    continue

                if auth_google.refresh_token_expired:
                    LOGGER.warning(
                        "sync_google_user_data_do_all skipping user ref_id=%s: "
                        "refresh token expired",
                        user.ref_id,
                    )
                    continue

                try:
                    google_user_info = (
                        await google_oauth_client.sync_user_info_from_refresh_token(
                            auth_google.refresh_token
                        )
                    )
                except GoogleRefreshTokenRevokedError:
                    auth_google = auth_google.revoke_refresh_token(
                        context.domain_context,
                        google_oauth_client.cleared_refresh_token(),
                    )
                    await uow.get_for(AuthGoogle).save(auth_google)
                    LOGGER.info(
                        "sync_google_user_data_do_all revoked refresh token for "
                        "user ref_id=%s",
                        user.ref_id,
                    )
                    continue

                if google_user_info.encrypted_refresh_token is not None:
                    auth_google = auth_google.update_refresh_token(
                        context.domain_context,
                        google_user_info.encrypted_refresh_token,
                    )
                    await uow.get_for(AuthGoogle).save(auth_google)

                pictures_to_apply.append((user.ref_id, google_user_info.picture_url))

                if user.auth_sign_up_method != UserAuthMethod.GOOGLE:
                    # Only the sign up method owns the profile: email is also the
                    # local login key, so a linked provider must not rewrite it.
                    continue

                if (
                    user.name != google_user_info.user_name
                    or user.email_address != google_user_info.email_address
                ):
                    user = user.sync_google_profile(
                        context.domain_context,
                        name=google_user_info.user_name,
                        email_address=google_user_info.email_address,
                    )
                    await uow.get_for(User).save(user)

                LOGGER.info(
                    "sync_google_user_data_do_all updated profile for user "
                    "ref_id=%s",
                    user.ref_id,
                )

        # Downloads happen outside of any transaction. Whoever removed their
        # picture does not get it back: this only follows a Google picture.
        apply_picture = ApplyGoogleProfilePictureService(
            self._ports.domain_storage_engine, self._ports.image_store
        )
        for user_ref_id, picture_url in pictures_to_apply:
            await apply_picture.do_it(
                context.domain_context, user_ref_id, picture_url, fill_empty=False
            )
