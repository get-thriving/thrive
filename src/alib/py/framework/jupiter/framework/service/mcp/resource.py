"""Resources for the MCP service."""

import enum
import inspect
import json
import re
import types as types_mod
from abc import ABC, abstractmethod
from contextvars import ContextVar
from typing import (
    Any,
    Callable,
    Generic,
    Optional,
    TypeVar,
    Union,
    get_args,
    get_origin,
)

import attr
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.mcp.service import McpItem
from jupiter.framework.service.rest.api_gateway_method import (
    WebApiClientCallable,
    WebApiClientErrorResponse,
    WebApiClientSerializable,
    WebApiUnsetMarker,
    _extract_types_from_api_call,
    _resolve_attrs_hints,
)
from jupiter.framework.service_properties import ServiceProperties
from mcp.server.fastmcp import FastMCP

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)

_WebApiAuthenticatedClientT = TypeVar("_WebApiAuthenticatedClientT", bound=object)
_ApiArgsT = TypeVar("_ApiArgsT", bound=WebApiClientSerializable)
_ApiResultT = TypeVar("_ApiResultT", bound=WebApiClientSerializable)

_WebApiUnsetMarkerT = TypeVar("_WebApiUnsetMarkerT", bound=WebApiUnsetMarker)
_WebApiClientErrorResponseT = TypeVar(
    "_WebApiClientErrorResponseT", bound=WebApiClientErrorResponse
)

_ApiCallT = TypeVar("_ApiCallT", bound=WebApiClientCallable[Any, Any, Any])  # type: ignore[explicit-any]

_McpApiGatewayResourceT = TypeVar(
    "_McpApiGatewayResourceT",
    bound="McpApiGatewayResource[Any, Any, Any, Any, Any, Any, Any, Any, Any]",  # type: ignore[explicit-any]
)

_URI_TEMPLATE_RE: re.Pattern[str] = re.compile(r"\{(\w+)\}")


def _to_primitive_type(tp: Any) -> Any:  # type: ignore[explicit-any]
    """Map a complex domain type to a JSON-primitive Python annotation.

    Handles ``Optional[T]``, ``T | None``, primitives (str, int, float, bool),
    enum subclasses (→ str), attrs classes (→ str), and lists.
    """
    if tp is type(None):
        return type(None)
    if tp in (str, int, float, bool):
        return tp

    origin = get_origin(tp)
    if origin is Union or isinstance(tp, types_mod.UnionType):
        members = get_args(tp)
        has_none = type(None) in members
        non_none = [a for a in members if a is not type(None)]
        if len(non_none) == 0:
            return type(None)
        elif len(non_none) == 1:
            prim = _to_primitive_type(non_none[0])
            return Optional[prim] if has_none else prim  # type: ignore[return-value]
        else:
            prims = [_to_primitive_type(a) for a in non_none]
            result = Union[tuple(prims)]  # type: ignore[return-value]
            return Optional[result] if has_none else result  # type: ignore[return-value]

    if origin is list:
        inner_args = get_args(tp)
        if inner_args:
            return list[_to_primitive_type(inner_args[0])]  # type: ignore[return-value]
        return list  # type: ignore[return-value]

    if isinstance(tp, type) and issubclass(tp, enum.Enum):
        return str

    if isinstance(tp, type) and attr.has(tp):
        return str

    return str


class McpResource(McpItem, ABC):
    """Abstract base class for MCP resources."""


class McpApiGatewayResource(
    Generic[
        _PortsT,
        _GlobalPropertiesT,
        _ServicePropertiesT,
        _WebApiAuthenticatedClientT,
        _WebApiUnsetMarkerT,
        _WebApiClientErrorResponseT,
        _ApiArgsT,
        _ApiResultT,
        _ApiCallT,
    ],
    McpResource,
    ABC,
):
    """An MCP resource that proxies a webapi-client read-only call.

    Subclasses must implement :meth:`get_authenticated_client` to create the
    authenticated webapi client from a token and the service ports.  They also
    inherit the :meth:`unset_marker_type` and :meth:`error_response_type`
    classmethods that extract the concrete type arguments from the MRO.
    """

    _uri: str
    _args: type[_ApiArgsT] | None
    _result: type[_ApiResultT] | None
    _api_call: _ApiCallT  # type: ignore[explicit-any]

    def __init__(
        self,
        uri: str,
        args: type[_ApiArgsT] | None,
        result: type[_ApiResultT] | None,
        api_call: _ApiCallT,
    ) -> None:
        """Initialise the resource."""
        self._uri = uri
        self._args = args
        self._result = result
        self._api_call = api_call

    @classmethod
    def resource(  # type: ignore[explicit-any]
        cls: type[_McpApiGatewayResourceT],
        uri: str,
        api_call: _ApiCallT,
    ) -> Callable[
        [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
        _McpApiGatewayResourceT,
    ]:
        """Return a builder that constructs this resource for a given set of ports/properties."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> _McpApiGatewayResourceT:
            return cls(uri, args, result, api_call)

        return build_it

    def attach(  # type: ignore[explicit-any]
        self,
        mcp_server: FastMCP,
        auth_token_var: ContextVar[str | None],
        ports: Any,
    ) -> None:
        """Register this resource with the MCP server."""
        # Determine which fields match the URI template variables
        template_vars: set[str] = set(_URI_TEMPLATE_RE.findall(self._uri))

        params: list[inspect.Parameter] = []
        if self._args is not None and attr.has(self._args):
            hints = _resolve_attrs_hints(self._args)
            for field in attr.fields(self._args):
                if field.name not in template_vars:
                    continue
                if field.name == "additional_properties":
                    continue
                ft = hints.get(field.name)
                if ft is None:
                    ft = str
                prim_tp = _to_primitive_type(ft)
                params.append(
                    inspect.Parameter(
                        field.name,
                        kind=inspect.Parameter.KEYWORD_ONLY,
                        annotation=prim_tp,
                    )
                )

        # Capture references for the closure
        args_type = self._args
        api_call = self._api_call
        unset_marker_fn = self.unset_marker
        get_client_fn = self.get_authenticated_client

        async def resource_fn(**kwargs: Any) -> str:  # type: ignore[explicit-any]
            token = auth_token_var.get()
            if token is None:
                return json.dumps({"error": "Not authenticated"})

            client = get_client_fn(ports, token)

            body: Any  # type: ignore[explicit-any]
            if args_type is not None:
                body = args_type.from_dict(kwargs)
            else:
                body = unset_marker_fn()

            response: Any = await api_call(client=client, body=body)  # type: ignore[explicit-any]

            if not response.status_code.is_success:
                return json.dumps({"error": str(response.parsed)})

            parsed = response.parsed
            if hasattr(parsed, "to_dict"):
                return json.dumps(parsed.to_dict())
            return json.dumps(str(parsed))

        resource_fn.__signature__ = inspect.Signature(  # type: ignore[attr-defined]
            parameters=params,
            return_annotation=str,
        )
        # Derive a human-readable name from the URI (e.g. "jupiter://inbox-tasks" → "inbox_tasks")
        resource_fn.__name__ = (
            re.sub(r"^[^:]+://", "", self._uri).replace("/", "_").replace("-", "_")
        )

        mcp_server.resource(self._uri)(resource_fn)

    @classmethod
    def unset_marker(cls) -> WebApiUnsetMarker:  # type: ignore[explicit-any]
        """Return an unset marker instance."""
        return cls.unset_marker_type()()

    @classmethod
    def unset_marker_type(cls) -> type[WebApiUnsetMarker]:  # type: ignore[explicit-any]
        """Extract the concrete ``_WebApiUnsetMarkerT`` from the class's Generic args."""
        for klass in cls.__mro__:
            for base in getattr(klass, "__orig_bases__", ()):
                if get_origin(base) is McpApiGatewayResource:
                    args = get_args(base)
                    if len(args) > 4 and isinstance(args[4], type):
                        return args[4]  # type: ignore[return-value]
        raise TypeError(
            f"Cannot extract _WebApiUnsetMarkerT from {cls.__name__}; "
            "ensure the class parameterises McpApiGatewayResource with concrete types"
        )

    @classmethod
    def error_response_type(cls) -> type[WebApiClientErrorResponse]:  # type: ignore[explicit-any]
        """Extract the concrete ``_WebApiClientErrorResponseT`` from the class's Generic args."""
        for klass in cls.__mro__:
            for base in getattr(klass, "__orig_bases__", ()):
                if get_origin(base) is McpApiGatewayResource:
                    args = get_args(base)
                    if len(args) > 5 and isinstance(args[5], type):
                        return args[5]  # type: ignore[return-value]
        raise TypeError(
            f"Cannot extract _WebApiClientErrorResponseT from {cls.__name__}; "
            "ensure the class parameterises McpApiGatewayResource with concrete types"
        )

    @abstractmethod
    def get_authenticated_client(  # type: ignore[explicit-any]
        self, ports: Any, token: str
    ) -> _WebApiAuthenticatedClientT:
        """Create an authenticated webapi client from ``ports`` and ``token``."""
