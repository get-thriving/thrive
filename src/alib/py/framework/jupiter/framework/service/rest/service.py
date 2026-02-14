"""A REST service at the framework level."""

from abc import ABC, abstractmethod
from typing import Final, Generic, TypeVar
from fastapi import FastAPI, HTTPException, Response, status
from fastapi.routing import APIRoute
from jupiter.framework.service.service import Service
from jupiter.framework.service_properties import ServiceProperties
import uvicorn


_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)

class RestService(Service[_ServicePropertiesT], ABC, Generic[_ServicePropertiesT]):
    """A REST service at the framework level."""

    _fast_app: Final[FastAPI]

    def __init__(self, properties: _ServicePropertiesT) -> None:
        """Initialize the service."""
        super().__init__(properties)
        self._fast_app = FastAPI(
            title=self.description,
            version=self.version,
            generate_unique_id_function=self._custom_generate_unique_id,
            openapi_url=self.openapi_json_route if not self.is_live else None,
            docs_url=self.openapi_docs_route if not self.is_live else None,
            redoc_url=self.openapi_redoc_route if not self.is_live else None,
        )
        self._fast_app.openapi = self._custom_openapi  # type: ignore[method-assign]

    async def run(self) -> None:
        """Run the service."""
        config = uvicorn.Config(
            self._fast_app,
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

    @property
    @abstractmethod
    def is_live(self) -> bool:
        """Whether the app is live."""

    @property
    def healthz_route(self) -> str:
        """The healthz route of the app."""
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
        pass
