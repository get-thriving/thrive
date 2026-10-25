"""An authorization code, as the client sees it."""

from typing import Final

from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
from jupiter.framework.base.entity_id import EntityId, EntityIdDatabaseDecoder
from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.realm import (
    EventStoreRealm,
    RealmDecoder,
    RealmDecodingError,
    RealmEncoder,
    RealmThing,
    WebRealm,
    only_in_realm,
)
from jupiter.framework.value import SecretValue, secret_value

_CODE_PREFIX: Final[str] = "oc"


@secret_value
@only_in_realm(WebRealm, EventStoreRealm)
class OAuthCodeExternal(SecretValue):
    """An authorization code, as the client sees it: ``oc_<grant id>.<secret>``."""

    grant_ref_id: EntityId
    secret: OAuthSecretPlain


class OAuthCodeExternalWebDecoder(RealmDecoder[OAuthCodeExternal, WebRealm]):
    """Decode an authorization code from the Web."""

    def decode(self, value: RealmThing) -> OAuthCodeExternal:
        """Decode an authorization code from the Web."""
        if not isinstance(value, str):
            raise RealmDecodingError("Expected a token string")

        head, _, secret_raw = value.partition(".")
        token_prefix, _, ref_id_str = head.partition("_")
        if token_prefix != _CODE_PREFIX or not ref_id_str.isdigit():
            raise RealmDecodingError("Malformed token")

        try:
            return OAuthCodeExternal(
                EntityIdDatabaseDecoder().decode(int(ref_id_str)),
                OAuthSecretPlain(secret_raw),
            )
        except InputValidationError as err:
            raise RealmDecodingError("Malformed token") from err


class OAuthCodeExternalWebEncoder(RealmEncoder[OAuthCodeExternal, WebRealm]):
    """Encode an authorization code for the Web."""

    def encode(self, value: OAuthCodeExternal) -> RealmThing:
        """Encode an authorization code for the Web."""
        return f"{_CODE_PREFIX}_{value.grant_ref_id.as_int()}.{value.secret.secret_raw}"


class OAuthCodeExternalEventStoreRealmEncoder(
    RealmEncoder[OAuthCodeExternal, EventStoreRealm]
):
    """Encode an authorization code for the Event Store, without leaking it."""

    def encode(self, value: OAuthCodeExternal) -> RealmThing:
        """Encode an authorization code for the Event Store, without leaking it."""
        return "*" * 16
