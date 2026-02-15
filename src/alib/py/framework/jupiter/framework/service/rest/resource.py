"""Resources for the REST service."""

import re
from abc import ABC
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

_NAME_RE = re.compile(r"^([a-z][a-z0-9-]+)|(:[a-z][a-zA-Z0-9_]+)$")


class RestResource(ABC, Generic[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]):
    """A resource for the REST service."""

    _ports: _PortsT
    _global_properties: _GlobalPropertiesT
    _service_properties: _ServicePropertiesT
    _name: str
    _subresources: list["RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]"]
    _methods: list[RestMethod[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]]

    def __init__(
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        name: str,
        subresources: list["RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]"],
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

    @classmethod
    def build(  # type: ignore[explicit-any]
        cls: type[_RestResourceT],
        name: str,
        *builders: Callable[
            [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
            RestMethod[_PortsT, _GlobalPropertiesT, _ServicePropertiesT] | 
            "RestResource[_PortsT, _GlobalPropertiesT, _ServicePropertiesT]",
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
                ports, global_properties, service_properties, name, subresources, methods
            )

        return build_it

    def attach_route(self, fast_app: FastAPI, paths: list[str]) -> None:
        """Attach the route to the FastAPI app."""
        for subresource in self._subresources:
            subresource.attach_route(fast_app, [*paths, self._name])
        for method in self._methods:
            method.attach_route(fast_app, [*paths, self._name])
