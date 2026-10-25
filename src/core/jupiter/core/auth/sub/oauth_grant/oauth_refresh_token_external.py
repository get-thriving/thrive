"""A refresh token, as the client sees it."""

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

_REFRESH_PREFIX: Final[str] = "or"


@secret_value
@only_in_realm(WebRealm, EventStoreRealm)
class OAuthRefreshTokenExternal(SecretValue):
    """A refresh token, as the client sees it: ``or_<grant id>.<secret>``."""

    grant_ref_id: EntityId
    secret: OAuthSecretPlain


class OAuthRefreshTokenExternalWebDecoder(
    RealmDecoder[OAuthRefreshTokenExternal, WebRealm]
):
    """Decode a refresh token from the Web."""

    def decode(self, value: RealmThing) -> OAuthRefreshTokenExternal:
        """Decode a refresh token from the Web."""
        if not isinstance(value, str):
            raise RealmDecodingError("Expected a token string")

        head, _, secret_raw = value.partition(".")
        token_prefix, _, ref_id_str = head.partition("_")
        if token_prefix != _REFRESH_PREFIX or not ref_id_str.isdigit():
            raise RealmDecodingError("Malformed token")

        try:
            return OAuthRefreshTokenExternal(
                EntityIdDatabaseDecoder().decode(int(ref_id_str)),
                OAuthSecretPlain(secret_raw),
            )
        except InputValidationError as err:
            raise RealmDecodingError("Malformed token") from err


class OAuthRefreshTokenExternalWebEncoder(
    RealmEncoder[OAuthRefreshTokenExternal, WebRealm]
):
    """Encode a refresh token for the Web."""

    def encode(self, value: OAuthRefreshTokenExternal) -> RealmThing:
        """Encode a refresh token for the Web."""
        return (
            f"{_REFRESH_PREFIX}_{value.grant_ref_id.as_int()}.{value.secret.secret_raw}"
        )


class OAuthRefreshTokenExternalEventStoreRealmEncoder(
    RealmEncoder[OAuthRefreshTokenExternal, EventStoreRealm]
):
    """Encode a refresh token for the Event Store, without leaking it."""

    def encode(self, value: OAuthRefreshTokenExternal) -> RealmThing:
        """Encode a refresh token for the Event Store, without leaking it."""
        return "*" * 16
