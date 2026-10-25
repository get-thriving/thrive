"""Integration tests for how the MCP service is reached.

These go through whatever sits in front of the service, such as the nginx of a
self-hosted setup, so they catch paths that get sent somewhere else.
"""

import requests


def _mcp_origin(mcp_url: str) -> str:
    """The root of the MCP server, where its OAuth endpoints live.

    ``MCP_URL`` is the protocol endpoint (``…/mcp``) in some setups and the bare
    origin in others.
    """
    origin = mcp_url.rstrip("/")
    if origin.endswith("/mcp"):
        origin = origin[: -len("/mcp")]
    return origin


def _request(
    method: str, url: str, data: dict[str, str] | None = None
) -> requests.Response:
    # Docker dev terminates TLS with a self-signed cert.
    return requests.request(
        method, url, data=data, verify=False, timeout=10
    )  # nosec B501


def test_connections_mcp_protected_resource_metadata_describes_the_mcp_url(
    mcp_url: str,
) -> None:
    """The metadata a client reads after a 401 names the MCP url and its issuer."""
    origin = _mcp_origin(mcp_url)

    response = _request("GET", f"{origin}/.well-known/oauth-protected-resource")

    assert response.status_code == 200
    body = response.json()
    assert body["resource"] == f"{origin}/mcp"
    assert body["authorization_servers"] == [origin]


def test_connections_mcp_authorization_server_metadata_points_at_the_origin(
    mcp_url: str,
) -> None:
    """The endpoints it advertises are the ones that are really served there."""
    origin = _mcp_origin(mcp_url)

    response = _request("GET", f"{origin}/.well-known/oauth-authorization-server")

    assert response.status_code == 200
    body = response.json()
    assert body["issuer"] == origin
    assert body["authorization_endpoint"] == f"{origin}/authorize"
    assert body["token_endpoint"] == f"{origin}/token"
    assert body["authorization_response_iss_parameter_supported"] is True


def test_connections_mcp_authorize_reaches_the_mcp_service(mcp_url: str) -> None:
    """A request without the OAuth parameters gets the service's own refusal."""
    response = _request("GET", f"{_mcp_origin(mcp_url)}/authorize")

    assert response.status_code == 400
    assert "response_type must be code" in response.text


def test_connections_mcp_token_reaches_the_mcp_service(mcp_url: str) -> None:
    """An unknown grant type gets the service's OAuth error."""
    response = _request(
        "POST",
        f"{_mcp_origin(mcp_url)}/token",
        data={"grant_type": "password"},
    )

    assert response.status_code == 400
    assert response.json()["error"] == "unsupported_grant_type"


def test_connections_mcp_key_url_reaches_key_authentication(mcp_url: str) -> None:
    """An MCP key url is the MCP url, then /v1/<key>/mcp.

    A bad key is turned down by the key check, which is told apart from the
    bearer check by its message.
    """
    response = _request("POST", f"{mcp_url.rstrip('/')}/v1/not-a-real-key/mcp")

    assert response.status_code == 401
    assert "Invalid or unknown MCP key" in response.text
