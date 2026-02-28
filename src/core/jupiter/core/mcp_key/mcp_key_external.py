"""An external MCP key, as returned to the user."""

from jupiter.core.api_key.key_secret_plain import (
    KeySecretPlain,
    KeySecretPlainWebDecoder,
)
from jupiter.core.env import Env
from jupiter.framework.base.entity_id import EntityId, EntityIdDatabaseDecoder
from jupiter.framework.realm.realm import (
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value


@secret_value
@only_in_realm(WebRealm)
class MCPKeyExternal(SecretValue):
    """An external MCP key, as returned to the user."""

    env: Env
    ref_id: EntityId
    secret: KeySecretPlain

    @staticmethod
    def from_mcp_key(
        env: Env, mcp_key: "MCPKey", secret: KeySecretPlain  # type: ignore[name-defined]
    ) -> "MCPKeyExternal":
        """Create an external MCP key from an MCP key."""
        return MCPKeyExternal(
            env=env,
            ref_id=mcp_key.ref_id,
            secret=secret,
        )


class MCPKeyExternalWebDecoder(RealmDecoder[MCPKeyExternal, WebRealm]):
    """Decode an external MCP key from storage in the Web."""

    def decode(self, value: RealmThing) -> MCPKeyExternal:
        """Decode an external MCP key from storage in the Web."""
        if not isinstance(value, str):
            raise RealmDecodingError("Expected a string")

        parts = value.split("_")
        if len(parts) != 3:
            raise RealmDecodingError("Invalid MCPKey")

        prefix = parts[0]
        if prefix != "mk":
            raise RealmDecodingError("Invalid MCPKey")

        env_str = parts[1]
        try:
            env = Env(env_str)
        except Exception as e:
            raise RealmDecodingError("Invalid MCPKey") from e

        id_and_key = parts[2].split(".")
        if len(id_and_key) != 2:
            raise RealmDecodingError("Invalid MCPKey")

        ref_id = EntityIdDatabaseDecoder().decode(id_and_key[0])
        secret = KeySecretPlainWebDecoder().decode(id_and_key[1])

        return MCPKeyExternal(env, ref_id, secret)


class MCPKeyExternalWebEncoder(RealmEncoder[MCPKeyExternal, WebRealm]):
    """Encode an external MCP key for storage in the Web."""

    def encode(self, value: MCPKeyExternal) -> RealmThing:
        """Encode an external MCP key for storage in the Web."""
        return f"mk_{value.env.value}_{value.ref_id.as_int()}.{value.secret.secret_raw}"
