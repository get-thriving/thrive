"""An API key."""

from jupiter.core.api_key.key_secret_hash import KeySecretHash
from jupiter.core.api_key.key_secret_plain import KeySecretPlain
from jupiter.core.api_key.name import APIKeyName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.secure import secure_class
from jupiter.framework.update_action import UpdateAction


@entity
@secure_class
@only_in_realm(DatabaseRealm)
class APIKey(LeafEntity):
    """An API key."""

    user: ParentLink
    name: APIKeyName
    key_hash: KeySecretHash
    key_size: int
    last_four_digits: str

    @staticmethod
    @create_entity_action
    def new_api_key(
        ctx: MutationContext,
        user_ref_id: EntityId,
        name: APIKeyName,
        secret_plain: KeySecretPlain,
    ) -> "APIKey":
        """Create a new API key."""
        secret_hash = KeySecretHash.from_plain(secret_plain)
        return APIKey._create(
            ctx,
            user=ParentLink(user_ref_id),
            name=name,
            key_hash=secret_hash,
            key_size=len(secret_plain.secret_raw),
            last_four_digits=secret_plain.last_four_digits,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[APIKeyName],
    ) -> "APIKey":
        """Update the API key."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )
