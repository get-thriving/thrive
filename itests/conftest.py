"""Fixtures for integration tests."""

import os
import re
import uuid
from dataclasses import dataclass

import pytest
import validators


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, webui_url: str):
    """Browser context args."""
    return {
        **browser_context_args,
        "ignore_https_errors": True,
        "base_url": webui_url,
    }


@dataclass
class TestUser:
    """A test user."""

    __test__ = False  # pytest will ignore this class

    email: str
    name: str
    password: str

    @staticmethod
    def new_random() -> "TestUser":
        """Create a new random test user."""
        return TestUser(
            email=f"test-{uuid.uuid4()}@example.com",
            name="Test User",
            password="password-123",
        )


@pytest.fixture()
def new_random_user() -> TestUser:
    """Create a new random test user."""
    return TestUser.new_random()


@pytest.fixture(autouse=True, scope="session")
def webui_url() -> str:
    """The URL of the local Web UI server."""
    webui_url = os.getenv("WEBUI_URL")
    if webui_url is None:
        raise Exception("WEBUI_URL is not set")
    if re.match(r"^https?://0[.]0[.]0[.]0(:\d+)?", webui_url) or re.match(
        r"^https?://localhost(:\d+)?", webui_url
    ):
        return webui_url
    validation_result = validators.url(webui_url)
    if validation_result is not True:
        raise Exception(f"Invalid WEBUI_URL '{webui_url}'")
    return webui_url


@pytest.fixture(autouse=True, scope="session")
def webapi_url() -> str:
    """The URL of the local Web API server."""
    webapi_url = os.getenv("WEBAPI_URL")
    if webapi_url is None:
        raise Exception("WEBAPI_URL is not set")
    if re.match(r"^https?://0[.]0[.]0[.]0(:\d+)?", webapi_url) or re.match(
        r"^https?://localhost(:\d+)?", webapi_url
    ):
        return webapi_url
    validation_result = validators.url(webapi_url)
    if validation_result is not True:
        raise Exception(f"Invalid WEBAPI_URL '{webapi_url}'")
    return webapi_url


@pytest.fixture(autouse=True, scope="session")
def api_url() -> str:
    """The URL of the local API server."""
    api_url = os.getenv("API_URL")
    if api_url is None:
        raise Exception("API_URL is not set")
    if re.match(r"^https?://0[.]0[.]0[.]0(:\d+)?", api_url) or re.match(
        r"^https?://localhost(:\d+)?", api_url
    ):
        return api_url
    validation_result = validators.url(api_url)
    if validation_result is not True:
        raise Exception(f"Invalid API_URL '{api_url}'")
    return api_url


@pytest.fixture(autouse=True, scope="session")
def mcp_url() -> str:
    """The URL of the local MCP server."""
    mcp_url = os.getenv("MCP_URL")
    if mcp_url is None:
        raise Exception("MCP_URL is not set")
    if re.match(r"^https?://0[.]0[.]0[.]0(:\d+)?", mcp_url) or re.match(
        r"^https?://localhost(:\d+)?", mcp_url
    ):
        return mcp_url
    validation_result = validators.url(mcp_url)
    if validation_result is not True:
        raise Exception(f"Invalid MCP_URL '{mcp_url}'")
    return mcp_url


@pytest.fixture(autouse=True, scope="session")
def docs_url() -> str:
    """The URL of the local Docs server."""
    docs_url = os.getenv("DOCS_URL")
    if docs_url is None:
        raise Exception("DOCS_URL is not set")
    if re.match(r"^https?://0[.]0[.]0[.]0(:\d+)?", docs_url) or re.match(
        r"^https?://localhost(:\d+)?", docs_url
    ):
        return docs_url
    validation_result = validators.url(docs_url)
    if validation_result is not True:
        raise Exception(f"Invalid DOCS_URL '{docs_url}'")
    return docs_url
