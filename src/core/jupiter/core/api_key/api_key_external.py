"""An external API key, as returned to the user."""

from jupiter.core.api_key.key_secret_plain import (
    KeySecretPlain,
    KeySecretPlainWebDecoder,
)
from jupiter.core.api_key.root import APIKey
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
class APIKeyExternal(SecretValue):
    """An external API key, as returned to the user."""

    env: Env
    ref_id: EntityId
    secret: KeySecretPlain

    @staticmethod
    def from_api_key(
        env: Env, api_key: APIKey, secret: KeySecretPlain
    ) -> "APIKeyExternal":
        """Create an external API key from an API key."""
        return APIKeyExternal(
            env=env,
            ref_id=api_key.ref_id,
            secret=secret,
        )


class APIKeyExternalWebDecoder(RealmDecoder[APIKeyExternal, WebRealm]):
    """Decode an external API key from storage in the Web."""

    def decode(self, value: RealmThing) -> APIKeyExternal:
        """Decode an external API key from storage in the Web."""
        if not isinstance(value, str):
            raise RealmDecodingError("Expected a string")

        parts = value.split("_")
        if len(parts) != 3:
            raise RealmDecodingError("Invalid APIKey")

        prefix = parts[0]
        if prefix != "ak":
            raise RealmDecodingError("Invalid APIKey")

        env_str = parts[1]
        try:
            env = Env(env_str)
        except Exception as e:
            raise RealmDecodingError("Invalid APIKey") from e

        id_and_key = parts[2].split(".")
        if len(id_and_key) != 2:
            raise RealmDecodingError("Invalid APIKey")

        ref_id = EntityIdDatabaseDecoder().decode(id_and_key[0])
        secret = KeySecretPlainWebDecoder().decode(id_and_key[1])

        return APIKeyExternal(env, ref_id, secret)


class APIKeyExternalWebEncoder(RealmEncoder[APIKeyExternal, WebRealm]):
    """Encode an external API key for storage in the Web."""

    def encode(self, value: APIKeyExternal) -> RealmThing:
        """Encode an external API key for storage in the Web."""
        return f"ak_{value.env.value}_{value.ref_id.as_int()}.{value.secret.secret_raw}"
