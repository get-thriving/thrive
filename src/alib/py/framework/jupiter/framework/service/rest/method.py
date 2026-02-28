"""Methods for the REST service."""

from abc import ABC, abstractmethod
from typing import Any, Callable, Generic, Literal, Mapping, TypeVar

from fastapi import FastAPI, Request, Response
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service_properties import ServiceProperties

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_RestMethodT = TypeVar("_RestMethodT", bound="RestMethod[Any, Any, Any]")  # type: ignore[explicit-any]

_STANDARD_CONFIG: Mapping[str, Any] = {  # type: ignore[explicit-any]
    "response_model_exclude_defaults": True,
}


class RestMethod(ABC, Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]):
    """A method for the REST service."""

    _ports: _PortsT
    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT
    _method: Literal["GET", "POST", "PUT", "DELETE"]
    _attached_path: str | None
    _tag: str | None

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        method: Literal["GET", "POST", "PUT", "DELETE"],
    ) -> None:
        """Initialize the method."""
        self._ports = ports
        self._global_properties = global_properties
        self._service_properties = service_properties
        self._method = method
        self._attached_path = None
        self._tag = None

    @classmethod
    def build(  # type: ignore[explicit-any]
        cls: type[_RestMethodT], name: Literal["GET", "POST", "PUT", "DELETE"]
    ) -> Callable[[_PortsT, _GlobalPropertiesT, _ServicePropertiesT], _RestMethodT]:
        """Build the method."""

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> _RestMethodT:
            return cls(ports, global_properties, service_properties, name)

        return build_it

    def attach_route(
        self, fast_app: FastAPI, paths: list[str], attached_path: str
    ) -> None:
        """Attach the route to the FastAPI app."""
        self._attached_path = attached_path
        self._tag = paths[0]

        @fast_app.api_route(
            path=attached_path,
            methods=[self._method],
            summary=self._attached_path,
            description=self._description(),
            tags=[self._tag],
            **_STANDARD_CONFIG,
        )
        async def do_it(request: Request) -> Response:
            return await self.execute(request)

    @abstractmethod
    async def execute(self, request: Request) -> Response:
        """Execute the method."""

    @abstractmethod
    def _description(self) -> str:
        """The description of the method."""

    @abstractmethod
    def get_openapi_components(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Get the OpenAPI components for the method."""

    @abstractmethod
    def get_openapi_path(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Get the OpenAPI paths for the method."""

    @property
    def method_name(self) -> Literal["GET", "POST", "PUT", "DELETE"]:
        """The method."""
        return self._method
