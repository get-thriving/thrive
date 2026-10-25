"""Tests for OAuth grants."""

import pytest
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.auth.sub.oauth_grant.client_id import OAuthClientId
from jupiter.core.auth.sub.oauth_grant.oauth_grant_status import OAuthGrantStatus
from jupiter.core.auth.sub.oauth_grant.oauth_secret_hash import OAuthSecretHash
from jupiter.core.auth.sub.oauth_grant.oauth_secret_plain import OAuthSecretPlain
from jupiter.core.auth.sub.oauth_grant.pkce_code_challenge import PkceCodeChallenge
from jupiter.core.auth.sub.oauth_grant.pkce_code_verifier import PkceCodeVerifier
from jupiter.core.auth.sub.oauth_grant.resource import OAuthResource
from jupiter.core.auth.sub.oauth_grant.root import (
    CODE_EXPIRES_IN_MINS,
    REFRESH_EXPIRES_IN_MINS,
    InvalidOAuthGrantError,
    InvalidOAuthRequestError,
    OAuthGrant,
    check_redirect_uri,
)
from jupiter.core.common.system_url import SystemUrl
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.errors import InputValidationError

_VERIFIER = PkceCodeVerifier("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")
_RFC7636_CHALLENGE = PkceCodeChallenge("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM")
_CLIENT = OAuthClientId("https://claude.ai/client.json")
_REDIRECT = SystemUrl("http://127.0.0.1:53682/callback")
_RESOURCE = OAuthResource("https://mcp.example.com/mcp")


def _ctx() -> DomainContext:
    return DomainContext(
        trace_id=TraceId.new(),
        mutation_id=MutationId.new(),
        event_source="test",
        action_timestamp=Timestamp.from_unix_timestamp(0),
        _context_str="test",
    )


def _now(mins: int = 0) -> Timestamp:
    return Timestamp.from_unix_timestamp(0).add_minutes(mins)


def _grant(code: OAuthSecretPlain) -> OAuthGrant:
    return OAuthGrant.new_grant(
        ctx=_ctx(),
        user_ref_id=EntityId("1"),
        client_id=_CLIENT,
        redirect_uri=_REDIRECT,
        resource=_RESOURCE,
        code_challenge=_RFC7636_CHALLENGE,
        code_plain=code,
    ).assign_ref_id(EntityId("7"))


def _redeem(
    grant: OAuthGrant,
    code: OAuthSecretPlain,
    refresh: OAuthSecretPlain,
    *,
    client_id: OAuthClientId = _CLIENT,
    redirect_uri: SystemUrl = _REDIRECT,
    resource: OAuthResource = _RESOURCE,
    code_verifier: PkceCodeVerifier = _VERIFIER,
) -> OAuthGrant:
    return grant.redeem_code(
        ctx=_ctx(),
        right_now=_now(1),
        code_plain=code,
        code_verifier=code_verifier,
        client_id=client_id,
        redirect_uri=redirect_uri,
        resource=resource,
        new_refresh_plain=refresh,
    )


# --- Values ---


def test_pkce_matches_the_rfc_7636_example() -> None:
    assert PkceCodeChallenge.from_verifier(_VERIFIER) == _RFC7636_CHALLENGE
    assert _RFC7636_CHALLENGE.matches(_VERIFIER)
    assert not _RFC7636_CHALLENGE.matches(PkceCodeVerifier("a" * 43))


@pytest.mark.parametrize("challenge", ["", "short", "a" * 42, "a" * 44, "a" * 42 + "="])
def test_pkce_challenge_rejects_malformed(challenge: str) -> None:
    with pytest.raises(InputValidationError):
        PkceCodeChallenge(challenge)


@pytest.mark.parametrize("verifier", ["", "a" * 42, "a" * 129, "a" * 42 + " "])
def test_pkce_verifier_rejects_malformed(verifier: str) -> None:
    with pytest.raises(InputValidationError):
        PkceCodeVerifier(verifier)


@pytest.mark.parametrize("client_id", ["", "has space", "x" * 2049, "tab\there"])
def test_client_id_rejects_malformed(client_id: str) -> None:
    with pytest.raises(InputValidationError):
        OAuthClientId(client_id)


@pytest.mark.parametrize(
    "resource",
    ["", "mcp.example.com/mcp", "ftp://example.com/mcp", "https://x.com/mcp#frag"],
)
def test_resource_rejects_malformed(resource: str) -> None:
    with pytest.raises(InputValidationError):
        OAuthResource(resource)


def test_secret_hash_round_trip() -> None:
    secret = OAuthSecretPlain.generate()
    hashed = OAuthSecretHash.from_plain(secret)
    assert hashed.check_against(secret)
    assert not hashed.check_against(OAuthSecretPlain.generate())


@pytest.mark.parametrize("secret", ["", "abc", "g" * 32, "A" * 32, "a" * 31])
def test_secret_rejects_malformed(secret: str) -> None:
    with pytest.raises(InputValidationError):
        OAuthSecretPlain(secret)


@pytest.mark.parametrize(
    "redirect_uri",
    [
        "http://localhost:8123/callback",
        "http://127.0.0.1:8123/callback",
        "http://[::1]:8123/callback",
        "https://claude.ai/api/mcp/auth_callback",
        "https://claude.com/api/mcp/auth_callback",
        "https://chatgpt.com/connector_platform_oauth_redirect",
    ],
)
def test_redirect_uri_allowed(redirect_uri: str) -> None:
    check_redirect_uri(SystemUrl(redirect_uri))


@pytest.mark.parametrize(
    "redirect_uri",
    [
        "https://evil.example.com/callback",
        "http://evil.example.com/callback",
        "https://localhost/callback",
        "http://localhost.evil.com/callback",
        "https://chatgpt.com/connector/oauth/some-callback-id",
        "https://chatgpt.com.evil.com/connector_platform_oauth_redirect",
        "https://chatgpt.com/connector_platform_oauth_redirect/extra",
    ],
)
def test_redirect_uri_rejected(redirect_uri: str) -> None:
    with pytest.raises(InvalidOAuthRequestError):
        check_redirect_uri(SystemUrl(redirect_uri))


# --- The grant ---


def test_code_redeems_once_and_starts_the_refresh_chain() -> None:
    code, refresh = OAuthSecretPlain.generate(), OAuthSecretPlain.generate()
    grant = _redeem(_grant(code), code, refresh)
    assert grant.code_redeemed
    assert grant.refresh_hash.check_against(refresh)
    with pytest.raises(InvalidOAuthGrantError, match="already redeemed"):
        _redeem(grant, code, refresh)


def test_new_grant_rejects_a_foreign_redirect_uri() -> None:
    with pytest.raises(InvalidOAuthRequestError):
        OAuthGrant.new_grant(
            ctx=_ctx(),
            user_ref_id=EntityId("1"),
            client_id=_CLIENT,
            redirect_uri=SystemUrl("https://evil.example.com/callback"),
            resource=_RESOURCE,
            code_challenge=_RFC7636_CHALLENGE,
            code_plain=OAuthSecretPlain.generate(),
        )


def test_code_expires() -> None:
    code = OAuthSecretPlain.generate()
    with pytest.raises(InvalidOAuthGrantError, match="expired"):
        _grant(code).redeem_code(
            ctx=_ctx(),
            right_now=_now(CODE_EXPIRES_IN_MINS),
            code_plain=code,
            code_verifier=_VERIFIER,
            client_id=_CLIENT,
            redirect_uri=_REDIRECT,
            resource=_RESOURCE,
            new_refresh_plain=OAuthSecretPlain.generate(),
        )


@pytest.mark.parametrize(
    "overrides",
    [
        {"code_verifier": PkceCodeVerifier("b" * 43)},
        {"client_id": OAuthClientId("someone-else")},
        {"redirect_uri": SystemUrl("http://127.0.0.1:1/callback")},
        {"resource": OAuthResource("https://other.example.com/mcp")},
    ],
)
def test_code_rejected_when_request_does_not_match(
    overrides: dict[str, object],
) -> None:
    code = OAuthSecretPlain.generate()
    with pytest.raises(InvalidOAuthGrantError):
        _redeem(
            _grant(code),
            code,
            OAuthSecretPlain.generate(),
            **overrides,  # type: ignore[arg-type]
        )


def test_wrong_code_rejected() -> None:
    with pytest.raises(InvalidOAuthGrantError, match="does not match"):
        _redeem(
            _grant(OAuthSecretPlain.generate()),
            OAuthSecretPlain.generate(),
            OAuthSecretPlain.generate(),
        )


def test_refresh_rotates_and_flags_the_replaced_token() -> None:
    code, first, second = (OAuthSecretPlain.generate() for _ in range(3))
    grant = _redeem(_grant(code), code, first)
    grant = grant.rotate_refresh(
        ctx=_ctx(),
        right_now=_now(5),
        refresh_plain=first,
        client_id=grant.client_id,
        new_refresh_plain=second,
    )
    assert grant.refresh_hash.check_against(second)
    assert grant.was_previous_refresh(first)
    assert not grant.was_previous_refresh(second)
    with pytest.raises(InvalidOAuthGrantError):
        grant.rotate_refresh(
            ctx=_ctx(),
            right_now=_now(6),
            refresh_plain=first,
            client_id=grant.client_id,
            new_refresh_plain=OAuthSecretPlain.generate(),
        )


def test_refresh_expires() -> None:
    code, refresh = OAuthSecretPlain.generate(), OAuthSecretPlain.generate()
    grant = _redeem(_grant(code), code, refresh)
    with pytest.raises(InvalidOAuthGrantError, match="expired"):
        grant.rotate_refresh(
            ctx=_ctx(),
            right_now=_now(1 + REFRESH_EXPIRES_IN_MINS),
            refresh_plain=refresh,
            client_id=grant.client_id,
            new_refresh_plain=OAuthSecretPlain.generate(),
        )


def test_refresh_needs_a_redeemed_code_first() -> None:
    with pytest.raises(InvalidOAuthGrantError, match="no refresh token"):
        _grant(OAuthSecretPlain.generate()).rotate_refresh(
            ctx=_ctx(),
            right_now=_now(1),
            refresh_plain=OAuthSecretPlain.generate(),
            client_id=_CLIENT,
            new_refresh_plain=OAuthSecretPlain.generate(),
        )


# --- Status ---


def test_a_grant_whose_code_is_not_redeemed_is_pending_until_the_code_expires() -> None:
    grant = _grant(OAuthSecretPlain.generate())
    assert grant.status_at(_now(1)) == OAuthGrantStatus.PENDING
    assert grant.expires_time == _now(CODE_EXPIRES_IN_MINS)
    assert grant.status_at(_now(CODE_EXPIRES_IN_MINS)) == OAuthGrantStatus.EXPIRED


def test_a_redeemed_grant_is_active_until_its_refresh_token_expires() -> None:
    code, refresh = OAuthSecretPlain.generate(), OAuthSecretPlain.generate()
    grant = _redeem(_grant(code), code, refresh)
    assert grant.status_at(_now(5)) == OAuthGrantStatus.ACTIVE
    assert grant.expires_time == _now(1 + REFRESH_EXPIRES_IN_MINS)
    assert (
        grant.status_at(_now(1 + REFRESH_EXPIRES_IN_MINS)) == OAuthGrantStatus.EXPIRED
    )


def test_a_revoked_grant_is_revoked_whatever_else_is_true() -> None:
    code, refresh = OAuthSecretPlain.generate(), OAuthSecretPlain.generate()
    grant = _redeem(_grant(code), code, refresh).mark_archived(
        _ctx(), JupiterArchivalReason.USER
    )
    assert grant.status_at(_now(5)) == OAuthGrantStatus.REVOKED
    assert grant.summary_at(_now(5)).archived


def test_the_summary_carries_what_the_page_shows() -> None:
    code, refresh = OAuthSecretPlain.generate(), OAuthSecretPlain.generate()
    grant = _redeem(_grant(code), code, refresh)
    summary = grant.summary_at(_now(5))
    assert summary.ref_id == EntityId("7")
    assert summary.client_id == _CLIENT
    assert summary.redirect_uri == _REDIRECT
    assert summary.status == OAuthGrantStatus.ACTIVE
    assert summary.refresh_issued_time == _now(1)
    assert summary.expires_time == _now(1 + REFRESH_EXPIRES_IN_MINS)
