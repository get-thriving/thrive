"""Tools for the MCP service."""

import inspect
import json
import warnings
from abc import ABC, abstractmethod
from contextvars import ContextVar
from typing import (
    Annotated,
    Any,
    Callable,
    Generic,
    Optional,
    TypeVar,
    get_args,
    get_origin,
)

import attr
import httpx
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.mcp.resource import (
    _to_primitive_type,
)
from jupiter.framework.service.mcp.service import McpItem
from jupiter.framework.service.rest.api_gateway_method import (
    WebApiClientCallable,
    WebApiClientErrorResponse,
    WebApiClientSerializable,
    WebApiUnsetMarker,
    _decompose_union,
    _extract_types_from_api_call,
    _resolve_attrs_hints,
)
from jupiter.framework.service_properties import ServiceProperties
from mcp.server.mcpserver import MCPServer
from mcp.server.mcpserver.exceptions import ToolError
from pydantic import Field
from pydantic.json_schema import PydanticJsonSchemaWarning

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

_McpApiGatewayToolT = TypeVar(
    "_McpApiGatewayToolT",
    bound="McpApiGatewayTool[Any, Any, Any, Any, Any, Any, Any, Any, Any]",  # type: ignore[explicit-any]
)


class _NotProvided:
    """Default for flattened update-action parameters the caller left out."""

    def __repr__(self) -> str:
        return "NOT_PROVIDED"


_NOT_PROVIDED = _NotProvided()


def _update_action_value_hint(  # type: ignore[explicit-any]
    tp: Any, unset_marker: type[WebApiUnsetMarker]
) -> Any | None:
    """Return the ``value`` type hint if ``tp`` is an update-action wrapper, else ``None``.

    The generated client wraps each field of an update call as
    ``{should_change: bool, value?: T}``.
    """
    if not isinstance(tp, type) or not attr.has(tp):
        return None
    names = {f.name for f in attr.fields(tp)} - {"additional_properties"}
    if names != {"should_change", "value"}:
        return None
    return _resolve_attrs_hints(tp).get("value")


def _describe_webapi_error(status_code: int, parsed: object, content: bytes) -> str:
    """The Web API error, as the text a ``ToolError`` carries.

    Every unsuccessful Web API response is this one case. The status, reason,
    and detail are what the model gets; there is no per-exception translation.
    """
    reason = getattr(parsed, "reason", None)
    if reason is not None and not isinstance(reason, str):
        reason = str(reason)
    raw_detail = getattr(parsed, "detail", None)
    if raw_detail is None:
        detail = content.decode("utf-8", errors="replace")[:500]
    elif isinstance(raw_detail, str):
        detail = raw_detail
    else:
        detail = "; ".join(
            f"{'.'.join(str(part) for part in item.loc)}: {item.msg}"
            for item in raw_detail
        )
    if reason:
        return f"{status_code}: {reason}: {detail}"
    return f"{status_code}: {detail}"


class McpTool(McpItem, ABC):
    """Abstract base class for MCP tools."""


class McpApiGatewayTool(
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
    McpTool,
    ABC,
):
    """An MCP tool that proxies a webapi-client mutation call.

    Subclasses must implement :meth:`get_authenticated_client` to create the
    authenticated webapi client from a token and the service ports.  They also
    inherit the :meth:`unset_marker_type` and :meth:`error_response_type`
    classmethods that extract the concrete type arguments from the MRO.
    """

    _name: str
    _description: str
    _args: type[_ApiArgsT] | None
    _result: type[_ApiResultT] | None
    _api_call: _ApiCallT  # type: ignore[explicit-any]

    def __init__(
        self,
        name: str,
        description: str,
        args: type[_ApiArgsT] | None,
        result: type[_ApiResultT] | None,
        api_call: _ApiCallT,
    ) -> None:
        """Initialise the tool."""
        self._name = name
        self._description = description
        self._args = args
        self._result = result
        self._api_call = api_call

    @classmethod
    def tool(  # type: ignore[explicit-any]
        cls: type[_McpApiGatewayToolT],
        name: str,
        description: str,
        api_call: _ApiCallT,
    ) -> Callable[
        [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
        _McpApiGatewayToolT,
    ]:
        """Return a builder that constructs this tool for a given set of ports/properties."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> _McpApiGatewayToolT:
            return cls(name, description, args, result, api_call)

        return build_it

    def attach(  # type: ignore[explicit-any]
        self,
        mcp_server: MCPServer,
        auth_token_var: ContextVar[str | None],
        ports: Any,
    ) -> None:
        """Register this tool with the MCP server."""
        params: list[inspect.Parameter] = []
        flattened_fields: set[str] = set()
        if self._args is not None and attr.has(self._args):
            hints = _resolve_attrs_hints(self._args)
            unset_marker = self.unset_marker_type()
            for field in attr.fields(self._args):
                if field.name == "additional_properties":
                    continue
                ft = hints.get(field.name)
                if ft is None:
                    ft = str

                value_hint = _update_action_value_hint(ft, unset_marker)
                if value_hint is not None:
                    _, value_has_none, value_clean = _decompose_union(
                        value_hint, unset_marker
                    )
                    value_prim = _to_primitive_type(value_clean)
                    doc = "Omit to leave unchanged."
                    if value_has_none:
                        value_prim = Optional[value_prim]
                        doc += " Pass null to clear."
                    flattened_fields.add(field.name)
                    params.append(
                        inspect.Parameter(
                            field.name,
                            kind=inspect.Parameter.KEYWORD_ONLY,
                            annotation=Annotated[value_prim, Field(description=doc)],
                            default=_NOT_PROVIDED,
                        )
                    )
                    continue

                has_unset, has_none, clean = _decompose_union(ft, unset_marker)
                prim_clean = _to_primitive_type(clean)

                if has_none:
                    prim_final: Any = Optional[prim_clean]  # type: ignore[explicit-any]
                else:
                    prim_final = prim_clean

                default: Any = inspect.Parameter.empty  # type: ignore[explicit-any]
                if has_unset:
                    default = None

                params.append(
                    inspect.Parameter(
                        field.name,
                        kind=inspect.Parameter.KEYWORD_ONLY,
                        annotation=prim_final,
                        default=default,
                    )
                )

        # Capture references for the closure
        args_type = self._args
        api_call = self._api_call
        unset_marker_fn = self.unset_marker
        get_client_fn = self.get_authenticated_client

        async def tool_fn(**kwargs: Any) -> str:  # type: ignore[explicit-any]
            token = auth_token_var.get()
            if token is None:
                raise ToolError("Not authenticated: the MCP key is missing or invalid.")

            trace_id = TraceId.new()  # TODO: Extract trace id from the request
            client = get_client_fn(ports, trace_id, token)

            body: Any  # type: ignore[explicit-any]
            if args_type is not None:
                for name in flattened_fields:
                    given = kwargs.pop(name, _NOT_PROVIDED)
                    if given is _NOT_PROVIDED:
                        kwargs[name] = {"should_change": False}
                    else:
                        kwargs[name] = {"should_change": True, "value": given}
                try:
                    body = args_type.from_dict(kwargs)
                except (KeyError, ValueError, TypeError) as err:
                    raise ToolError(f"Invalid arguments: {err}") from err
            else:
                body = unset_marker_fn()

            try:
                response: Any = await api_call(client=client, body=body)  # type: ignore[explicit-any]
            except httpx.TransportError as err:
                raise ToolError(
                    "Could not reach the Thrive server. Try again later."
                ) from err

            if not response.status_code.is_success:
                raise ToolError(
                    _describe_webapi_error(
                        int(response.status_code), response.parsed, response.content
                    )
                )

            parsed = response.parsed
            if hasattr(parsed, "to_dict"):
                return json.dumps(parsed.to_dict())
            return json.dumps(str(parsed))

        tool_fn.__signature__ = inspect.Signature(  # type: ignore[attr-defined]
            parameters=params,
            return_annotation=str,
        )

        with warnings.catch_warnings():
            # The not-provided sentinel default is deliberately not JSON-serializable.
            warnings.simplefilter("ignore", PydanticJsonSchemaWarning)
            mcp_server.tool(name=self._name, description=self._description)(tool_fn)

    @classmethod
    def unset_marker(cls) -> WebApiUnsetMarker:  # type: ignore[explicit-any]
        """Return an unset marker instance."""
        return cls.unset_marker_type()()

    @classmethod
    def unset_marker_type(cls) -> type[WebApiUnsetMarker]:  # type: ignore[explicit-any]
        """Extract the concrete ``_WebApiUnsetMarkerT`` from the class's Generic args."""
        for klass in cls.__mro__:
            for base in getattr(klass, "__orig_bases__", ()):
                if get_origin(base) is McpApiGatewayTool:
                    args = get_args(base)
                    if len(args) > 4 and isinstance(args[4], type):
                        return args[4]  # type: ignore[return-value]
        raise TypeError(
            f"Cannot extract _WebApiUnsetMarkerT from {cls.__name__}; "
            "ensure the class parameterises McpApiGatewayTool with concrete types"
        )

    @classmethod
    def error_response_type(cls) -> type[WebApiClientErrorResponse]:  # type: ignore[explicit-any]
        """Extract the concrete ``_WebApiClientErrorResponseT`` from the class's Generic args."""
        for klass in cls.__mro__:
            for base in getattr(klass, "__orig_bases__", ()):
                if get_origin(base) is McpApiGatewayTool:
                    args = get_args(base)
                    if len(args) > 5 and isinstance(args[5], type):
                        return args[5]  # type: ignore[return-value]
        raise TypeError(
            f"Cannot extract _WebApiClientErrorResponseT from {cls.__name__}; "
            "ensure the class parameterises McpApiGatewayTool with concrete types"
        )

    @abstractmethod
    def get_authenticated_client(  # type: ignore[explicit-any]
        self, ports: Any, trace_id: TraceId, token: str
    ) -> _WebApiAuthenticatedClientT:
        """Create an authenticated webapi client from ``ports`` and ``token``."""
