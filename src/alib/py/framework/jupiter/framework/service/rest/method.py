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
    _name: Literal["GET", "POST", "PUT", "DELETE"]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        name: Literal["GET", "POST", "PUT", "DELETE"],
    ) -> None:
        """Initialize the method."""
        self._ports = ports
        self._global_properties = global_properties
        self._service_properties = service_properties
        self._name = name

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

    def attach_route(self, fast_app: FastAPI, paths: list[str]) -> None:
        """Attach the route to the FastAPI app."""
        api_path = self._build_final_api_path(self._build_api_path(paths))

        @fast_app.api_route(
            path=api_path,
            methods=[self._name],
            summary=api_path,
            description=self._description(),
            tags=[paths[0]],
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
    def _build_final_api_path(self, path: str) -> str:
        """Build the final API path."""

    @abstractmethod
    def get_openapi_components(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Get the OpenAPI components for the method."""

    @staticmethod
    def _build_api_path(paths: list[str]) -> str:
        """Build the API path."""
        new_paths = []
        for p in paths:
            if p.startswith(":"):
                param_name = p[1:].replace(":", "___")
                new_paths.append("{" + param_name + "}")
            else:
                new_paths.append(p)
        return "/" + "/".join(new_paths)


