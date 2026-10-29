"""Tests for downloading Google profile pictures."""

import asyncio

import httpx
import pytest
from jupiter.core.auth.sub.google.profile_picture_fetcher import (
    GoogleProfilePictureFetcher,
)
from jupiter.core.images.normaliser.image_normaliser import MAX_INPUT_BYTES

_URL = "https://lh3.googleusercontent.com/a/abc=s96-c"


def _fetch(handler: httpx.MockTransport, url: str = _URL) -> bytes | None:
    return asyncio.run(GoogleProfilePictureFetcher(handler).fetch(url))


@pytest.mark.parametrize(
    "url",
    [
        _URL,
        "https://lh3.googleusercontent.com/a/abc",
    ],
)
def test_google_picture_hosts_are_acceptable(url: str) -> None:
    assert GoogleProfilePictureFetcher.is_acceptable_url(url)


@pytest.mark.parametrize(
    "url",
    [
        "http://lh3.googleusercontent.com/a/abc",
        "https://evil.example.com/a.png",
        "https://googleusercontent.com.evil.example.com/a.png",
        "https://user:pw@lh3.googleusercontent.com/a",
        "https://lh3.googleusercontent.com:8443/a",
        "https://127.0.0.1/a",
        "file:///etc/passwd",
    ],
)
def test_other_urls_are_not_acceptable(url: str) -> None:
    assert not GoogleProfilePictureFetcher.is_acceptable_url(url)


def test_the_size_asked_for_is_the_one_we_want() -> None:
    assert (
        GoogleProfilePictureFetcher.with_wanted_size(_URL)
        == "https://lh3.googleusercontent.com/a/abc=s512-c"
    )
    assert GoogleProfilePictureFetcher.with_wanted_size(
        "https://lh3.googleusercontent.com/a/abc"
    ) == ("https://lh3.googleusercontent.com/a/abc")


def test_fetch_gives_the_bytes() -> None:
    seen: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(str(request.url))
        return httpx.Response(200, content=b"picture")

    assert _fetch(httpx.MockTransport(handler)) == b"picture"
    assert seen == ["https://lh3.googleusercontent.com/a/abc=s512-c"]


def test_fetch_gives_nothing_on_an_error_status() -> None:
    assert _fetch(httpx.MockTransport(lambda _: httpx.Response(404))) is None


def test_fetch_does_not_follow_redirects() -> None:
    transport = httpx.MockTransport(
        lambda _: httpx.Response(302, headers={"location": "https://evil.example/"})
    )

    assert _fetch(transport) is None


def test_fetch_gives_nothing_for_too_big_a_picture() -> None:
    transport = httpx.MockTransport(
        lambda _: httpx.Response(200, content=b"\x00" * (MAX_INPUT_BYTES + 1))
    )

    assert _fetch(transport) is None


def test_fetch_gives_nothing_when_the_network_fails() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("down", request=request)

    assert _fetch(httpx.MockTransport(handler)) is None


def test_fetch_never_calls_out_for_an_odd_url() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise AssertionError("must not be called")

    assert _fetch(httpx.MockTransport(handler), "https://evil.example.com/a") is None
