"""An MCP service at the framework level."""

import asyncio
import base64
import json
import re
import time
from abc import ABC, abstractmethod
from contextvars import ContextVar
from typing import Any, Callable, Final, Generic, TypeVar
from urllib.parse import parse_qs, urlencode

import uvicorn
from fastapi import FastAPI, Request, Response, status
from fastapi.responses import JSONResponse, PlainTextResponse, RedirectResponse
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.mcp.oauth_token_error import OAuthTokenError
from jupiter.framework.service.mcp.oauth_tokens import OAuthTokens
from jupiter.framework.service.service import Service
from jupiter.framework.service_properties import ServiceProperties
from mcp.server.mcpserver import MCPServer
from mcp.server.transport_security import TransportSecuritySettings
from starlette.middleware.cors import CORSMiddleware

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_McpServiceT = TypeVar("_McpServiceT", bound="McpService[Any, Any, Any]")  # type: ignore[explicit-any]

_MCP_KEY_PATH_RE: re.Pattern[str] = re.compile(r"^/v1/([^/]+)/mcp(/.*)?$")
_MCP_BEARER_PATH_RE: re.Pattern[str] = re.compile(r"^/mcp(/.*)?$")

_OAUTH_NO_STORE = {"Cache-Control": "no-store", "Pragma": "no-cache"}


class _McpKeyPathMiddleware:
    """Pure ASGI middleware that authenticates MCP requests via the MCP key in the URL path.

    Matches paths of the form ``/v1/{mcp_key}/mcp[/…]``, exchanges the key for
    an auth token (setting a ContextVar), rewrites the path to ``/mcp[/…]``,
    and forwards to the MCPServer ASGI app.  All other paths are forwarded to the
    FastAPI app (which serves ``/healthz``).

    This is implemented as a plain ASGI callable (not
    ``starlette.middleware.base.BaseHTTPMiddleware``) so that SSE / streaming
    responses are not buffered.
    """

    def __init__(
        self,
        mcp_asgi_app: Any,  # type: ignore[explicit-any]
        fastapi_asgi_app: Any,  # type: ignore[explicit-any]
        key_exchange_fn: Callable[[str], Any],  # type: ignore[explicit-any]
        auth_token_var: ContextVar[str | None],
        resource_metadata_url: str,
    ) -> None:
        """Initialise the middleware."""
        self._resource_metadata_url = resource_metadata_url
        self._mcp_asgi_app = mcp_asgi_app
        self._fastapi_asgi_app = fastapi_asgi_app
        self._key_exchange_fn = key_exchange_fn
        self._auth_token_var = auth_token_var

    async def _handle_lifespan(
        self,
        scope: Any,  # type: ignore[explicit-any]
        receive: Any,  # type: ignore[explicit-any]
        send: Any,  # type: ignore[explicit-any]
    ) -> None:
        """Multiplex lifespan events to both the FastAPI and MCP ASGI apps."""
        fastapi_receive_q: asyncio.Queue[Any] = asyncio.Queue()  # type: ignore[explicit-any]
        mcp_receive_q: asyncio.Queue[Any] = asyncio.Queue()  # type: ignore[explicit-any]

        fastapi_startup_complete = asyncio.Event()
        mcp_startup_complete = asyncio.Event()
        fastapi_shutdown_complete = asyncio.Event()
        mcp_shutdown_complete = asyncio.Event()

        async def _fastapi_receive() -> Any:  # type: ignore[explicit-any]
            return await fastapi_receive_q.get()

        async def _mcp_receive() -> Any:  # type: ignore[explicit-any]
            return await mcp_receive_q.get()

        async def _fastapi_send(message: Any) -> None:  # type: ignore[explicit-any]
            if message["type"] == "lifespan.startup.complete":
                fastapi_startup_complete.set()
            elif message["type"] == "lifespan.shutdown.complete":
                fastapi_shutdown_complete.set()

        async def _mcp_send(message: Any) -> None:  # type: ignore[explicit-any]
            if message["type"] == "lifespan.startup.complete":
                mcp_startup_complete.set()
            elif message["type"] == "lifespan.shutdown.complete":
                mcp_shutdown_complete.set()

        startup_event = await receive()
        await fastapi_receive_q.put(startup_event)
        await mcp_receive_q.put(startup_event)

        fastapi_task = asyncio.create_task(
            self._fastapi_asgi_app(scope, _fastapi_receive, _fastapi_send)
        )
        mcp_task = asyncio.create_task(
            self._mcp_asgi_app(scope, _mcp_receive, _mcp_send)
        )

        await fastapi_startup_complete.wait()
        await mcp_startup_complete.wait()
        await send({"type": "lifespan.startup.complete"})

        shutdown_event = await receive()
        await fastapi_receive_q.put(shutdown_event)
        await mcp_receive_q.put(shutdown_event)

        await fastapi_shutdown_complete.wait()
        await mcp_shutdown_complete.wait()
        await asyncio.gather(fastapi_task, mcp_task)
        await send({"type": "lifespan.shutdown.complete"})

    async def __call__(
        self,
        scope: Any,  # type: ignore[explicit-any]
        receive: Any,  # type: ignore[explicit-any]
        send: Any,  # type: ignore[explicit-any]
    ) -> None:
        """Handle an ASGI request."""
        if scope["type"] == "lifespan":
            await self._handle_lifespan(scope, receive, send)
            return
        if scope["type"] in ("http", "websocket"):
            path: str = scope.get("path", "")
            match = _MCP_KEY_PATH_RE.match(path)
            if match:
                mcp_key_str = match.group(1)
                token: str | None = await self._key_exchange_fn(mcp_key_str)
                if token is None:
                    if scope["type"] == "http":
                        await send(
                            {
                                "type": "http.response.start",
                                "status": 401,
                                "headers": [
                                    [b"content-type", b"text/plain; charset=utf-8"]
                                ],
                            }
                        )
                        await send(
                            {
                                "type": "http.response.body",
                                "body": b"Invalid or unknown MCP key",
                                "more_body": False,
                            }
                        )
                    return

                ctx = self._auth_token_var.set(token)
                # Rewrite path so MCPServer sees /mcp[/…]
                suffix: str = match.group(2) or ""
                new_path = "/mcp" + suffix
                new_scope = dict(scope)
                new_scope["path"] = new_path
                if "raw_path" in new_scope:
                    new_scope["raw_path"] = new_path.encode()
                try:
                    await self._mcp_asgi_app(new_scope, receive, send)
                finally:
                    self._auth_token_var.reset(ctx)
                return

        if scope["type"] == "http" and _MCP_BEARER_PATH_RE.match(path):
            headers = {k.lower(): v for k, v in scope.get("headers", [])}
            raw_authorization = headers.get(b"authorization")
            token = self._bearer_token(
                raw_authorization.decode("latin-1") if raw_authorization else None
            )
            if token is None or not self._is_live_jwt(token):
                await self._send_unauthorized(
                    send, "invalid_token" if token is not None else None
                )
                return

            ctx = self._auth_token_var.set(token)
            try:
                await self._mcp_asgi_app(scope, receive, send)
            finally:
                self._auth_token_var.reset(ctx)
            return

        await self._fastapi_asgi_app(scope, receive, send)

    @staticmethod
    def _bearer_token(authorization_header: str | None) -> str | None:
        """Extract the token from an ``Authorization: Bearer`` header."""
        if authorization_header is None:
            return None
        scheme, _, token = authorization_header.partition(" ")
        if scheme.lower() != "bearer" or not token.strip():
            return None
        return token.strip()

    @staticmethod
    def _is_live_jwt(token: str) -> bool:
        """Whether the token looks like a JWT that has not expired.

        This only reads the expiry, to tell clients to refresh early. The signature
        is checked by the web API on every call, so a forged token gets nowhere.
        """
        parts = token.split(".")
        if len(parts) != 3:
            return False
        try:
            padded = parts[1] + "=" * (-len(parts[1]) % 4)
            exp = json.loads(base64.urlsafe_b64decode(padded))["exp"]
            return float(exp) > time.time()
        except (ValueError, KeyError, TypeError):
            return False

    async def _send_unauthorized(
        self,
        send: Any,  # type: ignore[explicit-any]
        error: str | None,
    ) -> None:
        """Answer 401, pointing the client at the metadata that starts sign in (RFC 9728)."""
        challenge = f'Bearer resource_metadata="{self._resource_metadata_url}"'
        if error is not None:
            challenge += f', error="{error}"'
        await send(
            {
                "type": "http.response.start",
                "status": 401,
                "headers": [
                    [b"content-type", b"text/plain; charset=utf-8"],
                    [b"www-authenticate", challenge.encode("latin-1")],
                ],
            }
        )
        await send(
            {
                "type": "http.response.body",
                "body": b"Authentication required",
                "more_body": False,
            }
        )


class McpItem(ABC):
    """Abstract base for items (resources or tools) that can be attached to an MCP server."""

    @abstractmethod
    def attach(  # type: ignore[explicit-any]
        self,
        mcp_server: MCPServer,
        auth_token_var: ContextVar[str | None],
        ports: Any,
    ) -> None:
        """Attach this item to the MCP server."""


class McpService(
    Service[_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
    ABC,
    Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
):
    """An MCP service at the framework level."""

    _auth_token_var: Final[ContextVar[str | None]]  # type: ignore[misc]
    _mcp_server: Final[MCPServer]  # type: ignore[misc]
    _fast_app: Final[FastAPI]  # type: ignore[misc]
    _items: list[McpItem]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        items: list[McpItem],
    ) -> None:
        """Initialise the service."""
        super().__init__(ports, global_properties, service_properties)
        self._auth_token_var = ContextVar("mcp_auth_token", default=None)
        self._mcp_server = MCPServer(self.description)
        self._fast_app = FastAPI(title=self.description, version=self.version)
        self._items = items

    @classmethod
    def build(  # type: ignore[explicit-any]
        cls: type[_McpServiceT],
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        *item_builders: Callable[
            [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
            McpItem,
        ],
    ) -> _McpServiceT:
        """Build the service from a list of item builder callables."""
        items = [
            item_builder(ports, global_properties, service_properties)
            for item_builder in item_builders
        ]
        service = cls(ports, global_properties, service_properties, list(items))

        @service._fast_app.get("/healthz", status_code=status.HTTP_200_OK)
        async def healthz() -> None:
            """Health check endpoint."""
            return None

        public = service.public_url.rstrip("/")
        resource = f"{public}/mcp"

        @service._fast_app.get("/.well-known/oauth-protected-resource")
        async def protected_resource_metadata() -> JSONResponse:
            """Say which resource this is, and who authorizes access to it."""
            return JSONResponse(
                {
                    "resource": resource,
                    "authorization_servers": [public],
                    "bearer_methods_supported": ["header"],
                }
            )

        @service._fast_app.get("/.well-known/oauth-authorization-server")
        async def authorization_server_metadata() -> JSONResponse:
            """Describe the authorization endpoints clients should use."""
            return JSONResponse(
                {
                    "issuer": public,
                    "authorization_endpoint": f"{public}/authorize",
                    "token_endpoint": f"{public}/token",
                    "response_types_supported": ["code"],
                    "grant_types_supported": ["authorization_code", "refresh_token"],
                    "code_challenge_methods_supported": ["S256"],
                    "token_endpoint_auth_methods_supported": ["none"],
                    "client_id_metadata_document_supported": True,
                    # RFC 9207: the redirect back to the client names the issuer.
                    "authorization_response_iss_parameter_supported": True,
                }
            )

        @service._fast_app.get("/authorize")
        async def authorize(request: Request) -> Response:
            """Send the browser to the consent page with the OAuth request."""
            params = dict(request.query_params)
            # Nothing here is safe to redirect back to a client with: the redirect URI is
            # only validated once the user consents. So problems are shown, not redirected.
            if params.get("response_type") != "code":
                return PlainTextResponse("response_type must be code", status_code=400)
            if not params.get("client_id") or not params.get("redirect_uri"):
                return PlainTextResponse(
                    "client_id and redirect_uri are required", status_code=400
                )
            if params.get("code_challenge_method") != "S256" or not params.get(
                "code_challenge"
            ):
                return PlainTextResponse("PKCE with S256 is required", status_code=400)
            if params.get("resource", resource).rstrip("/") != resource:
                return PlainTextResponse("Unknown resource", status_code=400)
            params["resource"] = resource
            # The consent page repeats this as ``iss`` in the redirect back to the
            # client (RFC 9207). Whatever the request said is not to be trusted.
            params["issuer"] = public
            return RedirectResponse(
                f"{service.consent_url}?{urlencode(params)}", status_code=302
            )

        @service._fast_app.post("/token")
        async def token(request: Request) -> JSONResponse:
            """Exchange a code or a refresh token for tokens."""
            form = {
                key: values[0]
                for key, values in parse_qs((await request.body()).decode()).items()
            }

            def required(name: str) -> str:
                value = form.get(name)
                if not value:
                    raise OAuthTokenError("invalid_request", f"{name} is required")
                return value

            try:
                grant_type = form.get("grant_type")
                if grant_type == "authorization_code":
                    tokens = await service._do_code_exchange(
                        required("code"),
                        required("code_verifier"),
                        required("client_id"),
                        required("redirect_uri"),
                        form.get("resource", resource),
                    )
                elif grant_type == "refresh_token":
                    tokens = await service._do_refresh(
                        required("refresh_token"), required("client_id")
                    )
                else:
                    raise OAuthTokenError(
                        "unsupported_grant_type", "Unsupported grant_type"
                    )
            except OAuthTokenError as err:
                return JSONResponse(
                    {"error": err.error, "error_description": err.description},
                    status_code=400,
                    headers=_OAUTH_NO_STORE,
                )
            return JSONResponse(
                {
                    "access_token": tokens.access_token,
                    "token_type": "Bearer",
                    "expires_in": tokens.expires_in,
                    "refresh_token": tokens.refresh_token,
                },
                headers=_OAUTH_NO_STORE,
            )

        for item in service._items:
            item.attach(
                service._mcp_server,
                service._auth_token_var,
                ports,
            )

        return service

    async def run(self) -> None:
        """Run the service."""
        mcp_asgi_app = self._mcp_server.streamable_http_app(
            transport_security=TransportSecuritySettings(
                enable_dns_rebinding_protection=False
            ),
        )

        combined_app = _McpKeyPathMiddleware(
            mcp_asgi_app=mcp_asgi_app,
            fastapi_asgi_app=self._fast_app,
            key_exchange_fn=self._do_key_exchange,
            auth_token_var=self._auth_token_var,
            resource_metadata_url=(
                f"{self.public_url.rstrip('/')}/.well-known/oauth-protected-resource"
            ),
        )

        cors_app = CORSMiddleware(
            combined_app,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
            expose_headers=["mcp-session-id", "www-authenticate"],
        )

        config = uvicorn.Config(
            cors_app,
            host=self.host,
            port=self.port,
            log_config=None,
            log_level="info",
        )
        server = uvicorn.Server(config)
        await server.serve()

    @property
    @abstractmethod
    def description(self) -> str:
        """The description of the app."""

    @property
    @abstractmethod
    def version(self) -> str:
        """The version of the app."""

    @property
    @abstractmethod
    def host(self) -> str:
        """The host of the app."""

    @property
    @abstractmethod
    def port(self) -> int:
        """The port of the app."""

    @abstractmethod
    async def _do_key_exchange(self, key_str: str) -> str | None:
        """Exchange a raw MCP key string for an auth token, or return None if invalid."""

    @property
    @abstractmethod
    def public_url(self) -> str:
        """The externally visible base URL of this service."""

    @property
    @abstractmethod
    def consent_url(self) -> str:
        """The URL of the page where a user signs in and approves an app."""

    @abstractmethod
    async def _do_code_exchange(
        self,
        code: str,
        code_verifier: str,
        client_id: str,
        redirect_uri: str,
        resource: str,
    ) -> OAuthTokens:
        """Exchange an authorization code for tokens, or raise ``OAuthTokenError``."""

    @abstractmethod
    async def _do_refresh(self, refresh_token: str, client_id: str) -> OAuthTokens:
        """Exchange a refresh token for tokens, or raise ``OAuthTokenError``."""
