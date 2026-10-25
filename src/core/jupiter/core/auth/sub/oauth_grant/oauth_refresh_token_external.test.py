"""Tests for the refresh token handed to clients."""

import pytest
from jupiter.core.auth.sub.oauth_grant.oauth_refresh_token_external import (
    OAuthRefreshTokenExternal,
    OAuthRefreshTokenExternalWebDecoder,
    OAuthRefreshTokenExternalWebEncoder,
)
from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.realm.realm import RealmDecodingError

_SECRET = OAuthSecretPlain("0123456789abcdef0123456789abcdef")


def test_refresh_token_round_trips_with_its_prefix() -> None:
    token = OAuthRefreshTokenExternal(grant_ref_id=EntityId("42"), secret=_SECRET)
    encoded = OAuthRefreshTokenExternalWebEncoder().encode(token)
    assert encoded == f"or_42.{_SECRET.secret_raw}"
    assert OAuthRefreshTokenExternalWebDecoder().decode(encoded) == token


def test_a_code_is_not_accepted_as_a_refresh_token() -> None:
    with pytest.raises(RealmDecodingError):
        OAuthRefreshTokenExternalWebDecoder().decode(f"oc_42.{_SECRET.secret_raw}")


@pytest.mark.parametrize(
    "token",
    ["", "or_x." + "a" * 32, "or_1", "or_1.short", "or_.abc", "42", "or_1." + "g" * 32],
)
def test_malformed_refresh_tokens_are_rejected(token: str) -> None:
    with pytest.raises(RealmDecodingError):
        OAuthRefreshTokenExternalWebDecoder().decode(token)
