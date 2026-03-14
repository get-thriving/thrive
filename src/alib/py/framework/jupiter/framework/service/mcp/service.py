"""An MCP service at the framework level."""

import asyncio
import re
from abc import ABC, abstractmethod
from contextvars import ContextVar
from typing import Any, Callable, Final, Generic, TypeVar

import uvicorn
from fastapi import FastAPI, status
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.service import Service
from jupiter.framework.service_properties import ServiceProperties
from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings
from starlette.middleware.cors import CORSMiddleware

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_McpServiceT = TypeVar("_McpServiceT", bound="McpService[Any, Any, Any]")  # type: ignore[explicit-any]

_MCP_KEY_PATH_RE: re.Pattern[str] = re.compile(r"^/v1/([^/]+)/mcp(/.*)?$")


class _McpKeyPathMiddleware:
    """Pure ASGI middleware that authenticates MCP requests via the MCP key in the URL path.

    Matches paths of the form ``/v1/{mcp_key}/mcp[/…]``, exchanges the key for
    an auth token (setting a ContextVar), rewrites the path to ``/mcp[/…]``,
    and forwards to the FastMCP ASGI app.  All other paths are forwarded to the
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
    ) -> None:
        """Initialise the middleware."""
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
                # Rewrite path so FastMCP sees /mcp[/…]
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

        await self._fastapi_asgi_app(scope, receive, send)


class McpItem(ABC):
    """Abstract base for items (resources or tools) that can be attached to an MCP server."""

    @abstractmethod
    def attach(  # type: ignore[explicit-any]
        self,
        mcp_server: FastMCP,
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
    _mcp_server: Final[FastMCP]  # type: ignore[misc]
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
        self._mcp_server = FastMCP(
            self.description,
            transport_security=TransportSecuritySettings(
                enable_dns_rebinding_protection=False
            ),
        )
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

        for item in service._items:
            item.attach(service._mcp_server, service._auth_token_var, ports)

        return service

    async def run(self) -> None:
        """Run the service."""
        mcp_asgi_app = self._mcp_server.streamable_http_app()

        combined_app = _McpKeyPathMiddleware(
            mcp_asgi_app=mcp_asgi_app,
            fastapi_asgi_app=self._fast_app,
            key_exchange_fn=self._do_key_exchange,
            auth_token_var=self._auth_token_var,
        )

        cors_app = CORSMiddleware(
            combined_app,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
            expose_headers=["mcp-session-id"],
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
