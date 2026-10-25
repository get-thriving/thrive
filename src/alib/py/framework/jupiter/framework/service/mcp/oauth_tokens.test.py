"""Tests for the tokens handed back to an OAuth client."""

from jupiter.framework.service.mcp.oauth_tokens import OAuthTokens


def test_tokens_do_not_show_up_in_text() -> None:
    tokens = OAuthTokens("access-secret", "refresh-secret", 3600)
    for text in (repr(tokens), str(tokens), f"{tokens}"):
        assert "access-secret" not in text
        assert "refresh-secret" not in text


def test_tokens_keep_their_fields() -> None:
    tokens = OAuthTokens("access-secret", "refresh-secret", 3600)
    assert tokens.access_token == "access-secret"
    assert tokens.refresh_token == "refresh-secret"
    assert tokens.expires_in == 3600
