"""An MCP key."""

from typing import TYPE_CHECKING

from jupiter.core.api_key.key_secret_hash import KeySecretHash
from jupiter.core.api_key.key_secret_plain import KeySecretPlain
from jupiter.core.mcp_key.mcp_key_summary import MCPKeySummary
from jupiter.core.mcp_key.name import MCPKeyName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
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

if TYPE_CHECKING:
    from jupiter.core.users.root import User


class InvalidMCPKeyError(Exception):
    """Error raised when the MCP key is invalid."""


@entity
@secure_class
@only_in_realm(DatabaseRealm)
class MCPKey(LeafEntity):
    """An MCP key."""

    user: ParentLink["User"]
    name: MCPKeyName
    key_hash: KeySecretHash
    key_size: int
    last_four_digits: str

    @staticmethod
    @create_entity_action
    def new_mcp_key(
        ctx: DomainContext,
        user_ref_id: EntityId,
        name: MCPKeyName,
        secret_plain: KeySecretPlain,
    ) -> "MCPKey":
        """Create a new MCP key."""
        secret_hash = KeySecretHash.from_plain(secret_plain)
        return MCPKey._create(
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
        ctx: DomainContext,
        name: UpdateAction[MCPKeyName],
    ) -> "MCPKey":
        """Update the MCP key."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )

    @property
    def summary(self) -> MCPKeySummary:
        """Get the summary of the MCP key."""
        return MCPKeySummary(
            ref_id=self.ref_id,
            name=self.name,
            last_four_digits=self.last_four_digits,
            archived=self.archived,
        )
