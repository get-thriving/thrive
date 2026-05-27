"""Integration tests for the MCP server connection."""

import urllib.request


def test_connections_webui_healthz_works(webui_url: str) -> None:
    """Test that the WebUI server healthz endpoint works."""
    with urllib.request.urlopen(f"{webui_url}/healthz") as response:  # nosec B310
        assert response.status == 200


def test_connections_webapi_healthz_works(webapi_url: str) -> None:
    """Test that the WebAPI server healthz endpoint works."""
    with urllib.request.urlopen(f"{webapi_url}/healthz") as response:  # nosec B310
        assert response.status == 200


def test_connections_api_healthz_works(api_url: str) -> None:
    """Test that the API server healthz endpoint works."""
    with urllib.request.urlopen(f"{api_url}/healthz") as response:  # nosec B310
        assert response.status == 200


def test_connections_mcp_healthz_works(mcp_url: str) -> None:
    """Test that the MCP server healthz endpoint works."""
    with urllib.request.urlopen(f"{mcp_url}/healthz") as response:  # nosec B310
        assert response.status == 200


def test_connections_docs_healthz_works(docs_url: str) -> None:
    """Test that the Docs server healthz endpoint works."""
    with urllib.request.urlopen(f"{docs_url}/healthz") as response:  # nosec B310
        assert response.status == 200
