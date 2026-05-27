"""A REST service at the framework level."""

from abc import ABC, abstractmethod
from typing import Any, Callable, Final, Generic, TypeVar

import uvicorn
from fastapi import FastAPI, Request, Response, status
from fastapi.openapi.utils import get_openapi
from fastapi.routing import APIRoute
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.rest.resource import RestResource
from jupiter.framework.service.service import Service
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.time_provider import CronRunTimeProvider, PerRequestTimeProvider
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_RestServiceT = TypeVar("_RestServiceT", bound="RestService[Any, Any, Any]")  # type: ignore[explicit-any]


class RestService(
    Service[_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
    ABC,
    Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
):
    """A REST service at the framework level."""

    _request_time_provider: Final[PerRequestTimeProvider]
    _cron_time_provider: Final[CronRunTimeProvider]
    _fast_app: Final[FastAPI]
    _resources: list[RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        request_time_provider: PerRequestTimeProvider,
        cron_time_provider: CronRunTimeProvider,
        resources: list[RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]],
    ) -> None:
        """Initialize the service."""
        super().__init__(ports, global_properties, service_properties)
        self._request_time_provider = request_time_provider
        self._cron_time_provider = cron_time_provider
        self._fast_app = FastAPI(
            title=self.description,
            version=self.version,
            generate_unique_id_function=self._custom_generate_unique_id,
            openapi_url=self.openapi_json_route,
            docs_url=self.openapi_docs_route,
            redoc_url=self.openapi_redoc_route,
        )
        self._fast_app.openapi = self._custom_openapi  # type: ignore[method-assign]
        self._resources = resources

    @classmethod
    def build(  # type: ignore[explicit-any]
        cls: type[_RestServiceT],
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        request_time_provider: PerRequestTimeProvider,
        cron_time_provider: CronRunTimeProvider,
        *resource_builders: Callable[
            [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
            RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
        ],
    ) -> _RestServiceT:
        """Build the service."""
        resources = [
            resource_builder(ports, global_properties, service_properties)
            for resource_builder in resource_builders
        ]
        service = cls(
            ports,
            global_properties,
            service_properties,
            request_time_provider,
            cron_time_provider,
            list(resources),
        )

        @service._fast_app.get(service.healthz_route, status_code=status.HTTP_200_OK)
        async def healthz() -> None:
            """Health check endpoint."""
            return None

        @service._fast_app.get(
            service.default_healthz_route, status_code=status.HTTP_200_OK
        )
        async def default_healthz() -> None:
            """Default health check endpoint."""
            return None

        for resource in service._resources:
            resource.attach_route(service._fast_app, [])

        return service

    async def run(self) -> None:
        """Run the service."""
        self._fast_app.add_middleware(
            BaseHTTPMiddleware, dispatch=self._time_provider_middleware
        )
        self._fast_app.add_middleware(
            BaseHTTPMiddleware, dispatch=self._trace_id_middleware
        )
        self._fast_app.add_middleware(
            BaseHTTPMiddleware, dispatch=self._setting_middleware
        )

        config = uvicorn.Config(
            self._fast_app,
            host=self.host,
            port=self.port,
            log_config=None,
            log_level="info",
        )

        server = uvicorn.Server(config)
        await server.serve()

    async def _time_provider_middleware(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        """Middleware to provide the time provider."""
        self._request_time_provider.set_request_time()
        return await call_next(request)

    async def _trace_id_middleware(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        """Middleware to provide the trace id."""
        request.state.trace_id = TraceId.new()
        return await call_next(request)

    async def _setting_middleware(
        self,
        request: Request,
        call_next: RequestResponseEndpoint,
    ) -> Response:
        """Middleware to provide the version."""
        response: Response = await call_next(request)
        self.add_headers_to_response(response)  # mutate in place
        return response

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

    @property
    @abstractmethod
    def is_live(self) -> bool:
        """Whether the app is live."""

    @property
    def healthz_route(self) -> str:
        """The healthz route of the app."""
        return "/healthz"

    @property
    def default_healthz_route(self) -> str:
        """The default healthz route of the app."""
        return "/healthz"

    @property
    def openapi_json_route(self) -> str:
        """The openapi json route of the app."""
        return "/openapi.json"

    @property
    def openapi_docs_route(self) -> str:
        """The openapi docs route of the app."""
        return "/docs"

    @property
    def openapi_redoc_route(self) -> str:
        """The openapi redoc route of the app."""
        return "/redoc"

    def add_headers_to_response(self, response: Response) -> None:
        """Add the headers to the response."""

    def _custom_generate_unique_id(self, route: APIRoute) -> str:
        """Generate a OpenAPI unique id from just the route name."""
        return f"{route.name}"

    def _custom_openapi(self) -> dict[str, Any]:  # type: ignore
        print("here here here")
        openapi_schema = get_openapi(
            title=self.description,
            version=self.version,
            routes=self._fast_app.routes,
            description=self.description,
        )

        # Generate all components

        openapi_schema["components"] = {}

        openapi_schema["components"]["securitySchemes"] = {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                # Optional but helpful: tells UIs / generators what kind of bearer token it is
                # If it's not a JWT, you can omit this.
                "bearerFormat": "Opaque",
            }
        }

        openapi_schema["components"]["schemas"] = {}

        for resource in self._resources:
            openapi_schema["components"]["schemas"].update(
                resource.get_openapi_components()
            )

        openapi_schema["paths"] = {}

        for resource in self._resources:
            openapi_schema["paths"].update(resource.get_openapi_paths())

        self._fast_app.openapi_schema = openapi_schema
        return self._fast_app.openapi_schema
