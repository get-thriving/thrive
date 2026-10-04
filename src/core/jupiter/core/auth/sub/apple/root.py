"""Apple OAuth authentication record associated with a user."""

import abc

from jupiter.core.auth.sub.apple.refresh_token_encrypted import (
    AppleRefreshTokenEncrypted,
)
from jupiter.core.auth.sub.apple.subject_id import AppleSubjectId
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ParentLink,
    StubEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import (
    EntityNotFoundError,
    StubEntityRepository,
)


@entity("User")
@secure_class
@only_in_realm(DatabaseRealm)
class AuthApple(StubEntity):
    """Apple OAuth auth record for a user."""

    user: ParentLink
    apple_subject_id: AppleSubjectId
    refresh_token: AppleRefreshTokenEncrypted
    refresh_token_expired: bool

    @staticmethod
    @create_entity_action
    def new_auth_apple(
        ctx: DomainContext,
        user_ref_id: EntityId,
        apple_subject_id: AppleSubjectId,
        refresh_token: AppleRefreshTokenEncrypted,
    ) -> "AuthApple":
        """Create a new Apple auth record for a user."""
        return AuthApple._create(
            ctx,
            user=ParentLink(user_ref_id),
            apple_subject_id=apple_subject_id,
            refresh_token=refresh_token,
            refresh_token_expired=False,
        )

    @update_entity_action
    def update_refresh_token(
        self,
        ctx: DomainContext,
        refresh_token: AppleRefreshTokenEncrypted,
    ) -> "AuthApple":
        """Update the stored refresh token."""
        return self._new_version(
            ctx,
            refresh_token=refresh_token,
            refresh_token_expired=False,
        )

    @update_entity_action
    def expire_refresh_token(self, ctx: DomainContext) -> "AuthApple":
        """Mark the stored refresh token as expired."""
        return self._new_version(ctx, refresh_token_expired=True)

    @update_entity_action
    def revoke_refresh_token(
        self,
        ctx: DomainContext,
        cleared_refresh_token: AppleRefreshTokenEncrypted,
    ) -> "AuthApple":
        """Clear the stored refresh token and mark it expired (re-auth required)."""
        return self._new_version(
            ctx,
            refresh_token=cleared_refresh_token,
            refresh_token_expired=True,
        )


class AuthAppleNotFoundError(EntityNotFoundError):
    """Error raised when an Apple auth record does not exist."""


class AuthAppleRepository(StubEntityRepository[AuthApple], abc.ABC):
    """A repository for Apple auth records."""

    @abc.abstractmethod
    async def load_by_apple_subject_id(
        self, apple_subject_id: AppleSubjectId
    ) -> AuthApple:
        """Load an Apple auth record by Apple subject ID."""
