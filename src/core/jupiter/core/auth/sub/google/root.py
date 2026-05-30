"""Google OAuth authentication record associated with a user."""

import abc

from jupiter.core.auth.sub.google.refresh_token_encrypted import (
    GoogleRefreshTokenEncrypted,
)
from jupiter.core.auth.sub.google.subject_id import GoogleSubjectId
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
class AuthGoogle(StubEntity):
    """Google OAuth auth record for a user."""

    user: ParentLink
    google_subject_id: GoogleSubjectId
    refresh_token: GoogleRefreshTokenEncrypted
    refresh_token_expired: bool

    @staticmethod
    @create_entity_action
    def new_auth_google(
        ctx: DomainContext,
        user_ref_id: EntityId,
        google_subject_id: GoogleSubjectId,
        refresh_token: GoogleRefreshTokenEncrypted,
    ) -> "AuthGoogle":
        """Create a new Google auth record for a user."""
        return AuthGoogle._create(
            ctx,
            user=ParentLink(user_ref_id),
            google_subject_id=google_subject_id,
            refresh_token=refresh_token,
            refresh_token_expired=False,
        )

    @update_entity_action
    def update_refresh_token(
        self,
        ctx: DomainContext,
        refresh_token: GoogleRefreshTokenEncrypted,
    ) -> "AuthGoogle":
        """Update the stored refresh token."""
        return self._new_version(
            ctx,
            refresh_token=refresh_token,
            refresh_token_expired=False,
        )

    @update_entity_action
    def expire_refresh_token(self, ctx: DomainContext) -> "AuthGoogle":
        """Mark the stored refresh token as expired."""
        return self._new_version(ctx, refresh_token_expired=True)

    @update_entity_action
    def revoke_refresh_token(
        self,
        ctx: DomainContext,
        cleared_refresh_token: GoogleRefreshTokenEncrypted,
    ) -> "AuthGoogle":
        """Clear the stored refresh token and mark it expired (re-auth required)."""
        return self._new_version(
            ctx,
            refresh_token=cleared_refresh_token,
            refresh_token_expired=True,
        )


class AuthGoogleNotFoundError(EntityNotFoundError):
    """Error raised when a Google auth record does not exist."""


class AuthGoogleRepository(StubEntityRepository[AuthGoogle], abc.ABC):
    """A repository for Google auth records."""

    @abc.abstractmethod
    async def load_by_google_subject_id(
        self, google_subject_id: GoogleSubjectId
    ) -> AuthGoogle:
        """Load a Google auth record by Google subject ID."""
