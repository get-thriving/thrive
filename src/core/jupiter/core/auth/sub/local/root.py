"""Authentication information associated with a user."""

from jupiter.core.auth.sub.local.password_hash import PasswordHash
from jupiter.core.auth.sub.local.password_new_plain import PasswordNewPlain
from jupiter.core.auth.sub.local.password_plain import PasswordPlain
from jupiter.core.auth.sub.local.sub.recovery_token.plain import RecoveryTokenPlain
from jupiter.core.auth.sub.local.sub.recovery_token.root import RecoveryToken
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsRefId,
    OwnsAtMostOne,
    ParentLink,
    StubEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.secure import secure_class


class IncorrectPasswordError(Exception):
    """Exception raised when an invalid password is provided."""


class IncorrectRecoveryTokenError(Exception):
    """Exception raised when an incorrect recovery token is provided."""


@entity("User")
@secure_class
@only_in_realm(DatabaseRealm)
class AuthLocal(StubEntity):
    """Authentication information associated with a user."""

    user: ParentLink
    password_hash: PasswordHash

    recovery_token = OwnsAtMostOne(RecoveryToken, auth_ref_id=IsRefId())

    @staticmethod
    def new_auth(
        ctx: DomainContext,
        user_ref_id: EntityId,
        password: PasswordNewPlain,
        password_repeat: PasswordNewPlain,
    ) -> "AuthLocal":
        """Create a new auth for a user."""
        if password != password_repeat:
            raise InputValidationError("Expected the password and repeat to match")

        password_hash = PasswordHash.from_new_plain(password)

        return AuthLocal._new_auth(
            ctx,
            user_ref_id=user_ref_id,
            password_hash=password_hash,
        )

    @staticmethod
    @create_entity_action
    def _new_auth(
        ctx: DomainContext,
        user_ref_id: EntityId,
        password_hash: PasswordHash,
    ) -> "AuthLocal":
        """Create a new auth for a user."""
        return AuthLocal._create(
            ctx,
            user=ParentLink(user_ref_id),
            password_hash=password_hash,
        )

    @update_entity_action
    def change_password(
        self,
        ctx: DomainContext,
        current_password: PasswordPlain,
        new_password: PasswordNewPlain,
        new_password_repeat: PasswordNewPlain,
    ) -> "AuthLocal":
        """Change the password for a user at the authentication level."""
        if not self.password_hash.check_against(current_password):
            raise IncorrectPasswordError("Invalid password")
        if new_password != new_password_repeat:
            raise InputValidationError("Expected the password and repeat to match")

        new_password_hash = PasswordHash.from_new_plain(new_password)

        return self._new_version(
            ctx,
            password_hash=new_password_hash,
        )

    def reset_password(
        self,
        ctx: DomainContext,
        recovery_token_entity: RecoveryToken,
        recovery_token: RecoveryTokenPlain,
        new_password: PasswordNewPlain,
        new_password_repeat: PasswordNewPlain,
    ) -> tuple["AuthLocal", RecoveryToken, RecoveryTokenPlain]:
        """Reset the password for a user by using a recovery token."""
        if not recovery_token_entity.check_recovery_token(recovery_token):
            raise IncorrectRecoveryTokenError("Invalid recovery token")
        if new_password != new_password_repeat:
            raise InputValidationError("Expected the password and repeat to match")

        new_password_hash = PasswordHash.from_new_plain(new_password)
        recovery_token_entity, new_recovery_token = recovery_token_entity.rotate(ctx)

        new_auth = self._reset_password(
            ctx,
            new_password_hash=new_password_hash,
        )

        return (new_auth, recovery_token_entity, new_recovery_token)

    @update_entity_action
    def _reset_password(
        self,
        ctx: DomainContext,
        new_password_hash: PasswordHash,
    ) -> "AuthLocal":
        """Reset the password for a user."""
        return self._new_version(
            ctx,
            password_hash=new_password_hash,
        )

    def check_password_against(self, password: PasswordPlain) -> bool:
        """Check a password for this auth."""
        return self.password_hash.check_against(password)
