"""Attach a Apple account to an existing user."""

from jupiter.core.auth.service.auth_link_errors import (
    AuthMethodAlreadyLinkedError,
    ProviderAccountLinkedElsewhereError,
)
from jupiter.core.auth.sub.apple.root import (
    AuthApple,
    AuthAppleNotFoundError,
    AuthAppleRepository,
)
from jupiter.core.auth.sub.apple.user_info import AppleUserInfo
from jupiter.core.users.root import User
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork


class LinkAppleAuthService:
    """Links a Apple account the user has just proven they control."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        ctx: DomainContext,
        user: User,
        apple_user_info: AppleUserInfo,
    ) -> None:
        """Create the Apple auth record, unless it would be ambiguous."""
        try:
            existing_by_subject = await uow.get(
                AuthAppleRepository
            ).load_by_apple_subject_id(apple_user_info.apple_subject_id)
        except AuthAppleNotFoundError:
            pass
        else:
            if existing_by_subject.user.ref_id != user.ref_id:
                raise ProviderAccountLinkedElsewhereError(
                    "This Apple account is already used by another user"
                )
            raise AuthMethodAlreadyLinkedError("This Apple account is already linked")

        try:
            await uow.get_for(AuthApple).load_by_parent(user.ref_id)
        except AuthAppleNotFoundError:
            pass
        else:
            raise AuthMethodAlreadyLinkedError(
                "A Apple account is already linked. Unlink it first to use another."
            )

        if apple_user_info.encrypted_refresh_token is None:
            raise InputValidationError("Apple did not return a refresh token")

        new_auth = AuthApple.new_auth_apple(
            ctx,
            user_ref_id=user.ref_id,
            apple_subject_id=apple_user_info.apple_subject_id,
            refresh_token=apple_user_info.encrypted_refresh_token,
        )
        await uow.get_for(AuthApple).create(new_auth)

        if (
            not user.verified
            and apple_user_info.verified
            and apple_user_info.email_address == user.email_address
        ):
            await uow.get_for(User).save(user.mark_verified(ctx))
