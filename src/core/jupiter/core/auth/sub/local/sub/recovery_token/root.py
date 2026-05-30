"""Recovery token for authentication."""

from jupiter.core.auth.sub.local.sub.recovery_token.hash import RecoveryTokenHash
from jupiter.core.auth.sub.local.sub.recovery_token.plain import RecoveryTokenPlain
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


@entity("AuthLocal")
@secure_class
@only_in_realm(DatabaseRealm)
class RecoveryToken(StubEntity):
    """Recovery token associated with an auth record."""

    auth: ParentLink
    recovery_token_hash: RecoveryTokenHash

    @staticmethod
    def new_recovery_token(
        ctx: DomainContext,
        auth_ref_id: EntityId,
    ) -> tuple["RecoveryToken", RecoveryTokenPlain]:
        """Create a new recovery token for an auth record."""
        recovery_token = RecoveryTokenPlain.new_recovery_token()
        recovery_token_hash = RecoveryTokenHash.from_plain(recovery_token)

        return (
            RecoveryToken._new_recovery_token(
                ctx,
                auth_ref_id=auth_ref_id,
                recovery_token_hash=recovery_token_hash,
            ),
            recovery_token,
        )

    @staticmethod
    @create_entity_action
    def _new_recovery_token(
        ctx: DomainContext,
        auth_ref_id: EntityId,
        recovery_token_hash: RecoveryTokenHash,
    ) -> "RecoveryToken":
        """Create a new recovery token for an auth record."""
        return RecoveryToken._create(
            ctx,
            auth=ParentLink(auth_ref_id),
            recovery_token_hash=recovery_token_hash,
        )

    def check_recovery_token(self, recovery_token: RecoveryTokenPlain) -> bool:
        """Check a recovery token against this record."""
        return self.recovery_token_hash.check_against(recovery_token)

    def rotate(
        self,
        ctx: DomainContext,
    ) -> tuple["RecoveryToken", RecoveryTokenPlain]:
        """Rotate the recovery token."""
        recovery_token = RecoveryTokenPlain.new_recovery_token()
        recovery_token_hash = RecoveryTokenHash.from_plain(recovery_token)

        return (
            self._rotate(ctx, recovery_token_hash=recovery_token_hash),
            recovery_token,
        )

    @update_entity_action
    def _rotate(
        self,
        ctx: DomainContext,
        recovery_token_hash: RecoveryTokenHash,
    ) -> "RecoveryToken":
        """Rotate the recovery token."""
        return self._new_version(
            ctx,
            recovery_token_hash=recovery_token_hash,
        )
