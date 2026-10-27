"""Attach a Google account to an existing user."""

from jupiter.core.auth.service.auth_link_errors import (
    AuthMethodAlreadyLinkedError,
    ProviderAccountLinkedElsewhereError,
)
from jupiter.core.auth.sub.google.root import (
    AuthGoogle,
    AuthGoogleNotFoundError,
    AuthGoogleRepository,
)
from jupiter.core.auth.sub.google.user_info import GoogleUserInfo
from jupiter.core.users.root import User
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork


class LinkGoogleAuthService:
    """Links a Google account the user has just proven they control."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        ctx: DomainContext,
        user: User,
        google_user_info: GoogleUserInfo,
    ) -> None:
        """Create the Google auth record, unless it would be ambiguous."""
        try:
            existing_by_subject = await uow.get(
                AuthGoogleRepository
            ).load_by_google_subject_id(google_user_info.google_subject_id)
        except AuthGoogleNotFoundError:
            pass
        else:
            if existing_by_subject.user.ref_id != user.ref_id:
                raise ProviderAccountLinkedElsewhereError(
                    "This Google account is already used by another user"
                )
            raise AuthMethodAlreadyLinkedError("This Google account is already linked")

        try:
            await uow.get_for(AuthGoogle).load_by_parent(user.ref_id)
        except AuthGoogleNotFoundError:
            pass
        else:
            raise AuthMethodAlreadyLinkedError(
                "A Google account is already linked. Unlink it first to use another."
            )

        if google_user_info.encrypted_refresh_token is None:
            raise InputValidationError("Google did not return a refresh token")

        new_auth = AuthGoogle.new_auth_google(
            ctx,
            user_ref_id=user.ref_id,
            google_subject_id=google_user_info.google_subject_id,
            refresh_token=google_user_info.encrypted_refresh_token,
        )
        await uow.get_for(AuthGoogle).create(new_auth)

        if (
            not user.verified
            and google_user_info.verified
            and google_user_info.email_address == user.email_address
        ):
            await uow.get_for(User).save(user.mark_verified(ctx))
