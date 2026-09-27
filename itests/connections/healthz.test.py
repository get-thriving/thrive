"""Integration tests for the MCP server connection."""

import ssl
import urllib.request

# Docker dev terminates TLS with a self-signed cert. Playwright ignores those
# errors; urllib does not.
_UNVERIFIED_SSL = ssl._create_unverified_context()  # nosec B323


def _open(url: str) -> urllib.request.addinfourl:
    if url.startswith("https://"):
        return urllib.request.urlopen(url, context=_UNVERIFIED_SSL)  # nosec B310
    return urllib.request.urlopen(url)  # nosec B310


def _healthz_url(service_url: str) -> str:
    return service_url.rstrip("/") + "/healthz"


def test_connections_webui_healthz_works(webui_url: str) -> None:
    """Test that the WebUI server healthz endpoint works."""
    with _open(_healthz_url(webui_url)) as response:
        assert response.status == 200


def test_connections_webapi_healthz_works(webapi_url: str) -> None:
    """Test that the WebAPI server healthz endpoint works."""
    with _open(_healthz_url(webapi_url)) as response:
        assert response.status == 200


def test_connections_api_healthz_works(api_url: str) -> None:
    """Test that the API server healthz endpoint works."""
    with _open(_healthz_url(api_url)) as response:
        assert response.status == 200


def test_connections_mcp_healthz_works(mcp_url: str) -> None:
    """Test that the MCP server healthz endpoint works.

    ``MCP_URL`` is the protocol endpoint (``…/mcp``). Health lives on the
    server root, not under that path.
    """
    base = mcp_url.rstrip("/")
    if base.endswith("/mcp"):
        base = base[: -len("/mcp")]
    with _open(f"{base}/healthz") as response:
        assert response.status == 200


def test_connections_docs_healthz_works(docs_url: str) -> None:
    """Test that the Docs server healthz endpoint works.

    MkDocs serves ``healthz.md`` at ``/healthz/`` (``use_directory_urls``).
    """
    with _open(docs_url.rstrip("/") + "/healthz/") as response:
        assert response.status == 200
