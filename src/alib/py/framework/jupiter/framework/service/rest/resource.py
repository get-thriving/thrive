"""Resources for the REST service."""

import re
from abc import ABC, abstractmethod
from collections import defaultdict
from typing import Any, Callable, Generic, TypeVar

from fastapi import FastAPI
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.rest.method import RestMethod
from jupiter.framework.service_properties import ServiceProperties

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)
_RestResourceT = TypeVar("_RestResourceT", bound="RestResource[Any, Any, Any]")  # type: ignore[explicit-any]

_NAME_RE = re.compile(r"^([a-z][a-z0-9-]+|:[a-z][a-zA-Z0-9_]+(:[a-z][a-zA-Z0-9_]+)*)$")


class RestResource(ABC, Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]):
    """A resource for the REST service."""

    _ports: _PortsT
    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT
    _name: str
    _subresources: list[
        "RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]"
    ]
    _methods: list[RestMethod[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]]
    _attached_path: str | None

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        name: str,
        subresources: list[
            "RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]"
        ],
        methods: list[RestMethod[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]],
    ) -> None:
        """Initialize the resource."""
        if not _NAME_RE.match(name):
            raise ValueError(f"Invalid resource name: {name}")
        self._ports = ports
        self._global_properties = global_properties
        self._service_properties = service_properties
        self._name = name
        self._subresources = subresources
        self._methods = methods
        self._attached_path = None

    @classmethod
    def build(  # type: ignore[explicit-any]
        cls: type[_RestResourceT],
        name: str,
        *builders: Callable[
            [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
            RestMethod[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]
            | "RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]",
        ],
    ) -> Callable[[_PortsT, _GlobalPropertiesT, _ServicePropertiesT], _RestResourceT]:
        """Build the resource."""

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> _RestResourceT:
            subresources = []
            methods = []
            for builder in builders:
                built = builder(ports, global_properties, service_properties)
                if isinstance(built, RestMethod):
                    methods.append(built)
                else:
                    subresources.append(built)
            return cls(
                ports,
                global_properties,
                service_properties,
                name,
                subresources,
                methods,
            )

        return build_it

    def attach_route(self, fast_app: FastAPI, paths: list[str]) -> None:
        """Attach the route to the FastAPI app."""
        full_paths = [*paths, self._name]
        self._attached_path = self._build_final_api_path(
            self._build_api_path(full_paths)
        )
        for subresource in self._subresources:
            subresource.attach_route(fast_app, full_paths)
        for method in self._methods:
            method.attach_route(fast_app, full_paths, self._attached_path)

    def get_openapi_components(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Get the OpenAPI components for the resource."""
        components = {}
        for subresource in self._subresources:
            components.update(subresource.get_openapi_components())
        for method in self._methods:
            components.update(method.get_openapi_components())
        return components

    def get_openapi_paths(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Get the OpenAPI paths for the resource."""
        paths: dict[str, dict[str, Any]] = defaultdict(dict)  # type: ignore[explicit-any]
        if self._attached_path is None:
            raise Exception("This resource has no attached path")
        for subresource in self._subresources:
            paths.update(subresource.get_openapi_paths())
        for method in self._methods:
            paths[self._attached_path][
                method.method_name.lower()
            ] = method.get_openapi_path()
        return paths

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

    @abstractmethod
    def _build_final_api_path(self, path: str) -> str:
        """Build the final API path."""
