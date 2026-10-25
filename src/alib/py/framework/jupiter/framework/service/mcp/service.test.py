"""Tests for the OAuth endpoints and bearer authentication of the MCP service."""

import asyncio
import base64
import json
import time
from contextvars import ContextVar
from types import SimpleNamespace
from typing import Any
from urllib.parse import parse_qs, urlsplit

from jupiter.framework.service.mcp.oauth_token_error import OAuthTokenError
from jupiter.framework.service.mcp.oauth_tokens import OAuthTokens
from jupiter.framework.service.mcp.service import McpService, _McpKeyPathMiddleware
from starlette.testclient import TestClient

_PUBLIC = "https://mcp.example.com"
_CONSENT = "https://app.example.com/consent"
_RESOURCE = f"{_PUBLIC}/mcp"
_PKCE = {
    "response_type": "code",
    "client_id": "https://claude.ai/client.json",
    "redirect_uri": "http://127.0.0.1:53682/callback",
    "code_challenge": "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    "code_challenge_method": "S256",
    "state": "xyz",
}


def _jwt(exp_in_secs: int) -> str:
    def b64(data: dict[str, Any]) -> str:  # type: ignore[explicit-any]
        raw = base64.urlsafe_b64encode(json.dumps(data).encode()).rstrip(b"=")
        return raw.decode()

    return f"{b64({'alg': 'HS256'})}.{b64({'exp': time.time() + exp_in_secs})}.sig"


class _FakeService(McpService[Any, Any, Any]):  # type: ignore[explicit-any]
    description = "test"  # type: ignore[assignment]
    version = "0"  # type: ignore[assignment]
    host = "localhost"  # type: ignore[assignment]
    port = 0  # type: ignore[assignment]
    public_url = _PUBLIC  # type: ignore[assignment]
    consent_url = _CONSENT  # type: ignore[assignment]

    calls: list[tuple[Any, ...]]  # type: ignore[explicit-any]

    async def _do_key_exchange(self, key_str: str) -> str | None:
        return None

    async def _do_code_exchange(
        self,
        code: str,
        code_verifier: str,
        client_id: str,
        redirect_uri: str,
        resource: str,
    ) -> OAuthTokens:
        self.calls.append((code, code_verifier, client_id, redirect_uri, resource))
        if code == "bad-code":
            raise OAuthTokenError("invalid_grant", "Code does not match")
        return OAuthTokens("access-1", "refresh-1", 3600)

    async def _do_refresh(self, refresh_token: str, client_id: str) -> OAuthTokens:
        self.calls.append((refresh_token, client_id))
        return OAuthTokens("access-2", "refresh-2", 3600)


def _client() -> TestClient:
    service = _FakeService.build(object(), SimpleNamespace(), SimpleNamespace())
    service.calls = []
    client = TestClient(service._fast_app, follow_redirects=False)
    client.calls = service.calls  # type: ignore[attr-defined]
    return client


def test_protected_resource_metadata_names_the_resource_and_the_server() -> None:
    body = _client().get("/.well-known/oauth-protected-resource").json()
    assert body["resource"] == _RESOURCE
    assert body["authorization_servers"] == [_PUBLIC]


def test_authorization_server_metadata_advertises_pkce_and_public_clients() -> None:
    body = _client().get("/.well-known/oauth-authorization-server").json()
    assert body["authorization_endpoint"] == f"{_PUBLIC}/authorize"
    assert body["token_endpoint"] == f"{_PUBLIC}/token"
    assert body["code_challenge_methods_supported"] == ["S256"]
    assert "none" in body["token_endpoint_auth_methods_supported"]
    assert body["client_id_metadata_document_supported"] is True
    assert body["authorization_response_iss_parameter_supported"] is True


def test_authorize_sends_the_browser_to_the_consent_page_with_the_request() -> None:
    response = _client().get("/authorize", params=_PKCE)
    assert response.status_code == 302
    target = urlsplit(response.headers["location"])
    assert f"{target.scheme}://{target.netloc}{target.path}" == _CONSENT
    query = parse_qs(target.query)
    assert query["client_id"] == [_PKCE["client_id"]]
    assert query["state"] == ["xyz"]
    assert query["resource"] == [_RESOURCE]
    assert query["issuer"] == [_PUBLIC]


def test_authorize_names_the_issuer_itself_whatever_the_request_says() -> None:
    response = _client().get(
        "/authorize", params={**_PKCE, "issuer": "https://evil.example.com"}
    )
    assert response.status_code == 302
    query = parse_qs(urlsplit(response.headers["location"]).query)
    assert query["issuer"] == [_PUBLIC]


def test_authorize_rejects_requests_without_s256_pkce() -> None:
    for broken in (
        {**_PKCE, "code_challenge_method": "plain"},
        {k: v for k, v in _PKCE.items() if k != "code_challenge"},
        {**_PKCE, "response_type": "token"},
        {k: v for k, v in _PKCE.items() if k != "redirect_uri"},
        {**_PKCE, "resource": "https://other.example.com/mcp"},
    ):
        assert _client().get("/authorize", params=broken).status_code == 400


def test_token_exchanges_a_code() -> None:
    client = _client()
    response = client.post(
        "/token",
        data={
            "grant_type": "authorization_code",
            "code": "oc_1.abc",
            "code_verifier": "verifier",
            "client_id": "c",
            "redirect_uri": "http://127.0.0.1:1/callback",
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "access_token": "access-1",
        "token_type": "Bearer",
        "expires_in": 3600,
        "refresh_token": "refresh-1",
    }
    assert response.headers["cache-control"] == "no-store"
    assert client.calls[0] == (  # type: ignore[attr-defined]
        "oc_1.abc",
        "verifier",
        "c",
        "http://127.0.0.1:1/callback",
        _RESOURCE,
    )


def test_token_refreshes() -> None:
    response = _client().post(
        "/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": "or_1.x",
            "client_id": "c",
        },
    )
    assert response.json()["refresh_token"] == "refresh-2"


def test_token_reports_oauth_errors() -> None:
    client = _client()
    bad_grant = client.post(
        "/token",
        data={
            "grant_type": "authorization_code",
            "code": "bad-code",
            "code_verifier": "v",
            "client_id": "c",
            "redirect_uri": "http://127.0.0.1:1/callback",
        },
    )
    assert bad_grant.status_code == 400
    assert bad_grant.json()["error"] == "invalid_grant"

    missing = client.post("/token", data={"grant_type": "refresh_token"})
    assert missing.json()["error"] == "invalid_request"

    unsupported = client.post("/token", data={"grant_type": "password"})
    assert unsupported.json()["error"] == "unsupported_grant_type"


async def _drive(
    middleware: _McpKeyPathMiddleware, path: str, headers: list[tuple[bytes, bytes]]
) -> tuple[int, dict[bytes, bytes], str | None]:
    sent: list[dict[str, Any]] = []  # type: ignore[explicit-any]

    async def receive() -> dict[str, Any]:  # type: ignore[explicit-any]
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(message: dict[str, Any]) -> None:  # type: ignore[explicit-any]
        sent.append(message)

    scope = {"type": "http", "path": path, "headers": headers}
    token_var = middleware._auth_token_var
    seen: list[str | None] = []

    async def mcp_app(scope: Any, receive: Any, send: Any) -> None:  # type: ignore[explicit-any]
        seen.append(token_var.get())
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b"mcp"})

    middleware._mcp_asgi_app = mcp_app
    await middleware(scope, receive, send)
    start = sent[0]
    return start["status"], dict(start["headers"]), seen[0] if seen else None


def _middleware() -> _McpKeyPathMiddleware:
    async def unused(scope: Any, receive: Any, send: Any) -> None:  # type: ignore[explicit-any]
        raise AssertionError("not expected")

    async def key_exchange(key: str) -> str | None:
        return None

    token_var: ContextVar[str | None] = ContextVar("t", default=None)
    return _McpKeyPathMiddleware(
        mcp_asgi_app=unused,
        fastapi_asgi_app=unused,
        key_exchange_fn=key_exchange,
        auth_token_var=token_var,
        resource_metadata_url=f"{_PUBLIC}/.well-known/oauth-protected-resource",
    )


def test_mcp_without_a_token_gets_the_discovery_challenge() -> None:
    status, headers, _ = asyncio.run(_drive(_middleware(), "/mcp", []))
    assert status == 401
    assert headers[b"www-authenticate"] == (
        b'Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource"'
    )


def test_mcp_with_an_expired_token_asks_to_refresh() -> None:
    headers = [(b"authorization", f"Bearer {_jwt(-5)}".encode())]
    status, response_headers, _ = asyncio.run(_drive(_middleware(), "/mcp", headers))
    assert status == 401
    assert b'error="invalid_token"' in response_headers[b"www-authenticate"]


def test_mcp_with_a_live_token_passes_it_through() -> None:
    token = _jwt(300)
    headers = [(b"authorization", f"Bearer {token}".encode())]
    status, _, seen = asyncio.run(_drive(_middleware(), "/mcp", headers))
    assert status == 200
    assert seen == token


def test_mcp_accepts_the_bearer_scheme_in_any_case() -> None:
    token = _jwt(300)
    headers = [(b"authorization", f"bearer {token}".encode())]
    status, _, seen = asyncio.run(_drive(_middleware(), "/mcp", headers))
    assert status == 200
    assert seen == token


def test_mcp_ignores_other_authorization_schemes() -> None:
    headers = [(b"authorization", b"Basic abc")]
    status, response_headers, _ = asyncio.run(_drive(_middleware(), "/mcp", headers))
    assert status == 401
    assert b"error=" not in response_headers[b"www-authenticate"]


def test_mcp_rejects_tokens_that_are_not_jwts_with_an_invalid_token_error() -> None:
    for token in ("not-a-jwt", "a.b.c", ""):
        headers = [(b"authorization", f"Bearer {token}".encode())]
        status, response_headers, _ = asyncio.run(
            _drive(_middleware(), "/mcp", headers)
        )
        assert status == 401
        if token:
            assert b'error="invalid_token"' in response_headers[b"www-authenticate"]
