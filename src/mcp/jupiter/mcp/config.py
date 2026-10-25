"""The MCP configuration for Jupiter."""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import (
    Any,
    Generic,
    TypeVar,
    Union,
    cast,
)
from urllib.parse import urlsplit

import dotenv
from jupiter.core.config import JupiterGlobalProperties
from jupiter.framework.base.trace_id import TraceId, TraceIdDatabaseEncoder
from jupiter.framework.ports import Ports
from jupiter.framework.service.mcp.oauth_token_error import OAuthTokenError
from jupiter.framework.service.mcp.oauth_tokens import OAuthTokens
from jupiter.framework.service.mcp.resource import McpApiGatewayResource
from jupiter.framework.service.mcp.service import McpService
from jupiter.framework.service.mcp.tool import McpApiGatewayTool
from jupiter.framework.service.rest.api_gateway_method import (
    WebApiClientCallable,
    WebApiClientSerializable,
    _extract_types_from_api_call,
)
from jupiter.framework.service_properties import ServiceProperties
from jupiter.mcp.headers import (
    FRONTDOOR_HEADER,
    TRACE_ID_HEADER,
    build_frontdoor_header,
)
from jupiter.mcp.webapi_client import WebApiClient
from jupiter_webapi_client import AuthenticatedClient
from jupiter_webapi_client.api.auth.o_auth_token_exchange import (
    asyncio_detailed as oauth_token_exchange,
)
from jupiter_webapi_client.api.auth.o_auth_token_refresh import (
    asyncio_detailed as oauth_token_refresh,
)
from jupiter_webapi_client.api.mcp_key.m_cp_key_exchange import (
    asyncio_detailed as mcp_key_exchange,
)
from jupiter_webapi_client.models import (
    ErrorResponse,
    MCPKeyExchangeArgs,
    MCPKeyExchangeResult,
    OAuthTokenExchangeArgs,
    OAuthTokenExchangeResult,
    OAuthTokenRefreshArgs,
    OAuthTokenRefreshResult,
)
from jupiter_webapi_client.types import Unset

_ApiArgsT = TypeVar("_ApiArgsT", bound=WebApiClientSerializable)
_ApiResultT = TypeVar("_ApiResultT", bound=WebApiClientSerializable)
_ApiCallT = TypeVar("_ApiCallT", bound=WebApiClientCallable[Any, Any, Any])  # type: ignore[explicit-any]

_TRACE_ID_ENCODER = TraceIdDatabaseEncoder()

# The route in the web UI where a user signs in and approves an OAuth app.
_CONSENT_PATH = "/app/oauth/authorize"


@dataclass(frozen=True)
class JupiterMcpPorts(Ports):
    """The ports for the Jupiter MCP service."""

    webapi_client: WebApiClient


@dataclass(frozen=True)
class JupiterMcpProperties(ServiceProperties):
    """The properties for the Jupiter MCP service."""

    host: str
    port: int
    sentry_dsn: str
    webapi_url: str
    public_url: str
    webui_url: str


def required_url_from_env(name: str) -> str:
    """Read an absolute http(s) URL the service cannot run without, failing at startup."""
    raw = os.getenv(name)
    if not raw:
        raise Exception(
            f"Critical error - the environment variable {name} is required, "
            "and should be an http(s) URL"
        )
    parts = urlsplit(raw)
    if parts.scheme not in ("http", "https") or not parts.netloc:
        raise Exception(
            f"Critical error - the environment variable {name} is not an "
            f"http(s) URL: {raw}"
        )
    return raw.rstrip("/")


def build_mcp_properties() -> JupiterMcpProperties:
    """Build the MCP properties from the environment."""

    def find_up_the_dir_tree(partial_path: Union[str, Path]) -> Path:
        last_here = None
        right_here = Path(os.path.relpath(__file__)).parent
        while True:
            if last_here == right_here:
                raise Exception(f"Critical error - missing config file {partial_path}")
            config_file = right_here / partial_path
            if config_file.exists():
                return config_file
            last_here = right_here
            right_here = right_here.parent

    project_config_path = find_up_the_dir_tree("Config.project")
    dotenv.load_dotenv(dotenv_path=project_config_path, verbose=True)

    host = cast(str, os.getenv("HOST"))
    port = int(cast(str, os.getenv("PORT")))
    sentry_dsn = cast(str, os.getenv("SENTRY_DSN"))
    webapi_server_host = cast(str, os.getenv("WEBAPI_SERVER_HOST"))
    webapi_server_port = int(cast(str, os.getenv("WEBAPI_SERVER_PORT")))
    webapi_url = f"http://{webapi_server_host}:{webapi_server_port}"

    return JupiterMcpProperties(
        host=host,
        port=port,
        sentry_dsn=sentry_dsn,
        webapi_url=webapi_url,
        public_url=required_url_from_env("PUBLIC_URL"),
        webui_url=required_url_from_env("WEBUI_URL"),
    )


def _make_authenticated_client(
    ports: JupiterMcpPorts,
    global_properties: JupiterGlobalProperties,
    trace_id: TraceId,
    token: str,
) -> AuthenticatedClient:
    """Create an ``AuthenticatedClient`` for calls to the webapi."""
    return AuthenticatedClient(
        base_url=ports.webapi_client.client._base_url,
        raise_on_unexpected_status=True,
        token=token,
        headers={
            FRONTDOOR_HEADER: build_frontdoor_header(global_properties),
            TRACE_ID_HEADER: str(_TRACE_ID_ENCODER.encode(trace_id)),
        },
    )


class JupiterMcpResource(
    Generic[_ApiArgsT, _ApiResultT, _ApiCallT],
    McpApiGatewayResource[  # type: ignore[explicit-any]
        JupiterMcpPorts,
        JupiterGlobalProperties,
        JupiterMcpProperties,
        AuthenticatedClient,
        Unset,
        ErrorResponse,
        _ApiArgsT,
        _ApiResultT,
        _ApiCallT,
    ],
):
    """An MCP resource for Jupiter that proxies a webapi-client read-only call."""

    _global_properties: JupiterGlobalProperties

    def __init__(  # type: ignore[explicit-any]
        self,
        uri: str,
        args: Any,  # type: ignore[explicit-any]
        result: Any,  # type: ignore[explicit-any]
        api_call: Any,  # type: ignore[explicit-any]
        global_properties: JupiterGlobalProperties,
    ) -> None:
        """Initialise the resource."""
        super().__init__(uri, args, result, api_call)
        self._global_properties = global_properties

    @classmethod
    def resource(  # type: ignore[explicit-any, override]
        cls,
        uri: str,
        api_call: _ApiCallT,
    ) -> Any:
        """Return a builder that constructs this resource."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: JupiterMcpPorts,
            global_properties: JupiterGlobalProperties,
            service_properties: JupiterMcpProperties,
        ) -> "JupiterMcpResource[_ApiArgsT, _ApiResultT, _ApiCallT]":
            return cls(uri, args, result, api_call, global_properties)

        return build_it

    def get_authenticated_client(  # type: ignore[explicit-any]
        self, ports: Any, trace_id: TraceId, token: str
    ) -> AuthenticatedClient:
        """Create an authenticated client."""
        return _make_authenticated_client(
            cast(JupiterMcpPorts, ports), self._global_properties, trace_id, token
        )


class JupiterMcpTool(
    Generic[_ApiArgsT, _ApiResultT, _ApiCallT],
    McpApiGatewayTool[  # type: ignore[explicit-any]
        JupiterMcpPorts,
        JupiterGlobalProperties,
        JupiterMcpProperties,
        AuthenticatedClient,
        Unset,
        ErrorResponse,
        _ApiArgsT,
        _ApiResultT,
        _ApiCallT,
    ],
):
    """An MCP tool for Jupiter that proxies a webapi-client mutation call."""

    _global_properties: JupiterGlobalProperties

    def __init__(  # type: ignore[explicit-any]
        self,
        name: str,
        description: str,
        args: Any,  # type: ignore[explicit-any]
        result: Any,  # type: ignore[explicit-any]
        api_call: Any,  # type: ignore[explicit-any]
        global_properties: JupiterGlobalProperties,
    ) -> None:
        """Initialise the tool."""
        super().__init__(name, description, args, result, api_call)
        self._global_properties = global_properties

    @classmethod
    def tool(  # type: ignore[explicit-any, override]
        cls,
        name: str,
        description: str,
        api_call: _ApiCallT,
    ) -> Any:
        """Return a builder that constructs this tool."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: JupiterMcpPorts,
            global_properties: JupiterGlobalProperties,
            service_properties: JupiterMcpProperties,
        ) -> "JupiterMcpTool[_ApiArgsT, _ApiResultT, _ApiCallT]":
            return cls(name, description, args, result, api_call, global_properties)

        return build_it

    def get_authenticated_client(  # type: ignore[explicit-any]
        self, ports: Any, trace_id: TraceId, token: str
    ) -> AuthenticatedClient:
        """Create an authenticated client."""
        return _make_authenticated_client(
            cast(JupiterMcpPorts, ports), self._global_properties, trace_id, token
        )


class JupiterMcpService(
    McpService[JupiterMcpPorts, JupiterGlobalProperties, JupiterMcpProperties]
):
    """The Jupiter MCP service."""

    @property
    def description(self) -> str:
        """The description of the app."""
        return self._global_properties.description

    @property
    def version(self) -> str:
        """The version of the app."""
        return str(self._global_properties.version)

    @property
    def host(self) -> str:
        """The host of the app."""
        return self._service_properties.host

    @property
    def port(self) -> int:
        """The port of the app."""
        return self._service_properties.port

    @property
    def public_url(self) -> str:
        """The externally visible base URL of the app."""
        return self._service_properties.public_url

    @property
    def consent_url(self) -> str:
        """The web UI page where a user signs in and approves an app."""
        return f"{self._service_properties.webui_url}{_CONSENT_PATH}"

    async def _do_key_exchange(self, key_str: str) -> str | None:
        """Exchange an MCP key string for an auth token."""
        client = self._ports.webapi_client.client

        resp = await mcp_key_exchange(
            client=client, body=MCPKeyExchangeArgs(mcp_key_external=key_str)
        )

        if not resp.status_code.is_success:
            return None

        true_resp = cast(MCPKeyExchangeResult, resp.parsed)
        return true_resp.auth_token_ext

    async def _do_code_exchange(
        self,
        code: str,
        code_verifier: str,
        client_id: str,
        redirect_uri: str,
        resource: str,
    ) -> OAuthTokens:
        """Exchange an authorization code for tokens."""
        resp = await oauth_token_exchange(
            client=self._ports.webapi_client.client,
            body=OAuthTokenExchangeArgs(
                code=code,
                code_verifier=code_verifier,
                client_id=client_id,
                redirect_uri=redirect_uri,
                resource=resource,
            ),
        )
        return self._tokens_or_error(resp)

    async def _do_refresh(self, refresh_token: str, client_id: str) -> OAuthTokens:
        """Exchange a refresh token for tokens."""
        resp = await oauth_token_refresh(
            client=self._ports.webapi_client.client,
            body=OAuthTokenRefreshArgs(
                refresh_token=refresh_token, client_id=client_id
            ),
        )
        return self._tokens_or_error(resp)

    @staticmethod
    def _tokens_or_error(resp: Any) -> OAuthTokens:  # type: ignore[explicit-any]
        """Turn a webapi answer into tokens, or the OAuth error it carries."""
        if resp.status_code.is_success:
            result = cast(
                OAuthTokenExchangeResult | OAuthTokenRefreshResult, resp.parsed
            )
            return OAuthTokens(
                access_token=result.auth_token_ext,
                refresh_token=result.refresh_token,
                expires_in=result.expires_in_secs,
            )
        if resp.status_code.is_client_error and isinstance(resp.parsed, ErrorResponse):
            # The web API words these as OAuth errors (invalid_grant, invalid_request).
            detail = resp.parsed.detail
            raise OAuthTokenError(
                (
                    resp.parsed.reason
                    if resp.parsed.reason.startswith("invalid_")
                    else "invalid_request"
                ),
                detail if isinstance(detail, str) else "Invalid request",
            )
        raise OAuthTokenError("server_error", "The authorization server failed")
