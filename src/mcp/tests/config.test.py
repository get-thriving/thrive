"""Tests for the MCP service's configuration."""

import pytest
from jupiter.mcp.config import required_url_from_env


def test_a_set_url_is_returned_without_a_trailing_slash(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("SOME_URL", "https://mcp.example.com/")
    assert required_url_from_env("SOME_URL") == "https://mcp.example.com"


def test_a_missing_url_fails_at_startup_naming_the_variable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.delenv("SOME_URL", raising=False)
    with pytest.raises(Exception, match="SOME_URL is required"):
        required_url_from_env("SOME_URL")


def test_an_empty_url_fails_at_startup(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("SOME_URL", "")
    with pytest.raises(Exception, match="SOME_URL is required"):
        required_url_from_env("SOME_URL")


@pytest.mark.parametrize(
    "raw", ["mcp.example.com", "ftp://mcp.example.com", "https://"]
)
def test_a_value_that_is_not_an_http_url_fails_at_startup(
    monkeypatch: pytest.MonkeyPatch, raw: str
) -> None:
    monkeypatch.setenv("SOME_URL", raw)
    with pytest.raises(Exception, match="not an http"):
        required_url_from_env("SOME_URL")
