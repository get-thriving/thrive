"""Tests for the authorization code handed to clients."""

import pytest
from jupiter.core.auth.sub.oauth_grant.oauth_code_external import (
    OAuthCodeExternal,
    OAuthCodeExternalWebDecoder,
    OAuthCodeExternalWebEncoder,
)
from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.realm.realm import RealmDecodingError

_SECRET = OAuthSecretPlain("0123456789abcdef0123456789abcdef")


def test_code_round_trips_with_its_prefix() -> None:
    code = OAuthCodeExternal(grant_ref_id=EntityId("42"), secret=_SECRET)
    encoded = OAuthCodeExternalWebEncoder().encode(code)
    assert encoded == f"oc_42.{_SECRET.secret_raw}"
    assert OAuthCodeExternalWebDecoder().decode(encoded) == code


def test_a_refresh_token_is_not_accepted_as_a_code() -> None:
    with pytest.raises(RealmDecodingError):
        OAuthCodeExternalWebDecoder().decode(f"or_42.{_SECRET.secret_raw}")


@pytest.mark.parametrize(
    "token",
    ["", "oc_x." + "a" * 32, "oc_1", "oc_1.short", "oc_.abc", "42", "oc_1." + "g" * 32],
)
def test_malformed_codes_are_rejected(token: str) -> None:
    with pytest.raises(RealmDecodingError):
        OAuthCodeExternalWebDecoder().decode(token)


def test_non_strings_are_rejected() -> None:
    with pytest.raises(RealmDecodingError):
        OAuthCodeExternalWebDecoder().decode(42)
