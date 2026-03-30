"""Methods for the API gateway."""

import enum
import inspect
import json
import re
import sys
import types as types_mod
from abc import ABC, abstractmethod
from http import HTTPStatus
from typing import (
    Any,
    Awaitable,
    Callable,
    Generic,
    Literal,
    Mapping,
    Protocol,
    TypeVar,
    Union,
    cast,
    get_args,
    get_origin,
    get_type_hints,
)

import attr
import httpx
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from jupiter.framework.global_properties import GlobalProperties
from jupiter.framework.openapi import OPENAPI_ERROR_RESPONSES
from jupiter.framework.ports import Ports
from jupiter.framework.service.rest.method import RestMethod
from jupiter.framework.service_properties import ServiceProperties
from jupiter.framework.base.trace_id import TraceId

_PortsT = TypeVar("_PortsT", bound=Ports)
_GlobalPropertiesT = TypeVar("_GlobalPropertiesT", bound=GlobalProperties)
_ServicePropertiesT = TypeVar("_ServicePropertiesT", bound=ServiceProperties)


class WebApiClientSerializable(Protocol):
    """Protocol for types with from_dict and to_dict."""

    def to_dict(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Convert the object to a dictionary."""

    @classmethod
    def from_dict(cls: type[Any], src_dict: Mapping[str, Any]) -> Any:  # type: ignore[explicit-any]
        """Convert a dictionary to an object."""


class WebApiClientErrorResponse(Protocol):
    """Protocol for web API client error responses."""

    @property
    def reason(self) -> str:
        """The reason for the error."""
        ...

    def to_dict(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Convert the object to a dictionary."""
        ...


_WebApiClientErrorResponseT = TypeVar(
    "_WebApiClientErrorResponseT", bound=WebApiClientErrorResponse
)


_WebApiAuthenticatedClientT = TypeVar("_WebApiAuthenticatedClientT", bound=object)
_ApiArgsT = TypeVar("_ApiArgsT", bound=WebApiClientSerializable)
_ApiResultT = TypeVar("_ApiResultT", bound=WebApiClientSerializable)


_WebApiAuthenticatedClientT_contra = TypeVar(
    "_WebApiAuthenticatedClientT_contra", bound=object, contravariant=True
)
_CallApiArgsT_contra = TypeVar(
    "_CallApiArgsT_contra", bound=WebApiClientSerializable, contravariant=True
)
_CallApiResultT_co = TypeVar(
    "_CallApiResultT_co", bound=WebApiClientSerializable, covariant=True
)

_WebApiClientResponseParsedT_co = TypeVar(
    "_WebApiClientResponseParsedT_co", bound=object, covariant=True
)


class _WebApiClientResponse(Protocol[_WebApiClientResponseParsedT_co]):
    """Protocol for web API client responses."""

    @property
    def status_code(self) -> HTTPStatus: ...

    @property
    def parsed(self) -> _WebApiClientResponseParsedT_co: ...


class WebApiClientCallable(
    Protocol[
        _WebApiAuthenticatedClientT_contra, _CallApiArgsT_contra, _CallApiResultT_co
    ]
):
    """Protocol for callable API functions."""

    def __call__(
        self,
        *,
        client: _WebApiAuthenticatedClientT_contra,
        body: _CallApiArgsT_contra,
    ) -> Awaitable[
        _WebApiClientResponse[WebApiClientErrorResponse | _CallApiResultT_co]
    ]:
        """The callable API function."""
        ...


_ApiCallT = TypeVar("_ApiCallT", bound=WebApiClientCallable[Any, Any, Any])  # type: ignore[explicit-any]


class WebApiUnsetMarker(Protocol):
    """Protocol for unset markers."""

    def __bool__(self) -> Literal[False]:
        """The unset marker."""
        ...


_WebApiUnsetMarkerT = TypeVar("_WebApiUnsetMarkerT", bound=WebApiUnsetMarker)


def _extract_types_from_api_call(  # type: ignore[explicit-any, return-value]
    api_call: Any,
    unset_marker_type: type[WebApiUnsetMarker],
    error_response_type: type[WebApiClientErrorResponse],
) -> tuple[type[Any] | None, type[Any] | None]:  # type: ignore[explicit-any]
    """Extract Args and Result types from an api_call's type hints.

    The ``body`` parameter is expected to be annotated ``SomeArgs | Unset``.
    The return annotation is ``Response[ErrorResponse | SomeResult]`` when the
    call returns a result, or ``Response[Any]`` (because ``Any | ErrorResponse``
    evaluates to ``Any`` in Python 3.12+) when it does not.
    """
    hints = get_type_hints(api_call)

    # body: SomeArgs | Unset  →  extract the non-Unset member
    args_type: type[Any] | None = None  # type: ignore[explicit-any]
    body_hint = hints.get("body")
    if body_hint is not None:
        for arg in get_args(body_hint):
            if arg is not unset_marker_type:
                args_type = arg
                break

    # return: Response[ErrorResponse | SomeResult]
    # For void calls: Response[Any] (Any | ErrorResponse == Any in 3.12+)
    result_type: type[Any] | None = None  # type: ignore[explicit-any]
    return_hint = hints.get("return")
    if return_hint is not None:
        response_type_args = get_args(return_hint)
        if response_type_args:
            inner = response_type_args[0]
            if inner is not Any:
                for arg in get_args(inner):
                    if arg is not error_response_type:
                        result_type = arg
                        break

    return args_type, result_type


def _extract_operation_id_from_api_call(api_call: Any) -> str:  # type: ignore[explicit-any]
    """Derive an OpenAPI operationId from an api_call's module and file name."""
    module = api_call.__module__
    try:
        filepath = inspect.getfile(api_call)
        filename = filepath.rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
        if filename.endswith(".py"):
            filename = filename[:-3]
    except TypeError:
        filename = "<unknown_file>"
    return f"{module}.{filename}"


def _attrs_type_has_payload(tp: type[Any] | None) -> bool:  # type: ignore[explicit-any]
    """Check whether an attrs type has meaningful fields beyond ``ref_id``."""
    if tp is None or not attr.has(tp):
        return False
    return any(
        f.name not in ("ref_id", "additional_properties") for f in attr.fields(tp)
    )


_PATH_PARAM_RE = re.compile(r"\{([^}]+)\}")


def _extract_path_parameters(path: str) -> list[dict[str, Any]]:  # type: ignore[explicit-any]
    """Extract OpenAPI parameter objects from ``{param}`` segments in a path."""
    return [
        {
            "name": match.group(1),
            "in": "path",
            "required": True,
            "schema": {"type": "string"},
        }
        for match in _PATH_PARAM_RE.finditer(path)
    ]


def _build_query_parameters(  # type: ignore[explicit-any]
    args_type: type[Any] | None,
    unset_marker: type[WebApiUnsetMarker],
) -> list[dict[str, Any]]:
    """Build OpenAPI query parameter objects from the fields of an attrs args type.

    Skips ``ref_id`` (handled as a path parameter) and ``additional_properties``.
    """
    if args_type is None or not attr.has(args_type):
        return []

    hints = _resolve_attrs_hints(args_type)
    parameters: list[dict[str, Any]] = []  # type: ignore[explicit-any]

    def _scalar_schema(tp: Any) -> dict[str, Any]:  # type: ignore[explicit-any]
        if tp is type(None):
            return {"type": "null"}
        if tp is str:
            return {"type": "string"}
        if tp is int:
            return {"type": "integer"}
        if tp is float:
            return {"type": "number"}
        if tp is bool:
            return {"type": "boolean"}
        if isinstance(tp, type) and issubclass(tp, enum.Enum):
            return {"type": "string", "enum": [e.value for e in tp]}
        origin = get_origin(tp)
        if origin is list:
            return {"type": "array", "items": _scalar_schema(get_args(tp)[0])}
        if origin is Union or isinstance(tp, types_mod.UnionType):
            members = [a for a in get_args(tp) if a is not type(None)]
            if len(members) == 1:
                return _scalar_schema(members[0])
            return {"anyOf": [_scalar_schema(m) for m in members]}
        return {"type": "string"}

    for field in attr.fields(args_type):
        if field.name in ("ref_id", "additional_properties"):
            continue
        ft = hints.get(field.name)
        if ft is None:
            continue

        has_unset, has_none, clean = _decompose_union(ft, unset_marker)
        schema = _scalar_schema(clean)

        if has_none:
            schema = {"anyOf": [schema, {"type": "null"}]}

        param: dict[str, Any] = {  # type: ignore[explicit-any]
            "name": field.name,
            "in": "query",
            "required": not has_unset,
            "schema": schema,
        }
        parameters.append(param)

    return parameters


def _resolve_attrs_hints(cls: type[Any]) -> dict[str, Any]:  # type: ignore[explicit-any]
    """Resolve string annotations, injecting sibling model types for TYPE_CHECKING refs."""
    mod = sys.modules.get(cls.__module__)
    globalns: dict[str, Any] = dict(getattr(mod, "__dict__", {})) if mod else {}  # type: ignore[explicit-any]
    pkg_name = cls.__module__.rsplit(".", 1)[0]
    pkg = sys.modules.get(pkg_name)
    if pkg is not None:
        for name in dir(pkg):
            obj = getattr(pkg, name, None)
            if isinstance(obj, type):
                globalns.setdefault(name, obj)
    try:
        return get_type_hints(cls, globalns=globalns)
    except TypeError:
        return {}


def _decompose_union(  # type: ignore[explicit-any]
    tp: Any,
    unset_marker: type[WebApiUnsetMarker],
) -> tuple[bool, bool, Any]:
    """Strip ``Unset`` and ``None`` from a union, returning ``(has_unset, has_none, cleaned)``."""
    origin = get_origin(tp)
    if origin is not Union and not isinstance(tp, types_mod.UnionType):
        return False, False, tp
    args = get_args(tp)
    has_unset = any(a is unset_marker for a in args)
    has_none = type(None) in args
    rest = [a for a in args if a is not unset_marker and a is not type(None)]
    if len(rest) == 0:
        return has_unset, has_none, type(None)
    if len(rest) == 1:
        return has_unset, has_none, rest[0]
    return has_unset, has_none, Union[tuple(rest)]


def _build_openapi_schemas_for_type(  # type: ignore[explicit-any]
    root_type: type[Any] | None,
    unset_marker: type[WebApiUnsetMarker],
    exclude_ref_id: bool = False,
) -> dict[str, Any]:  # type: ignore[explicit-any]
    """Build OpenAPI component schemas for an attrs type and all its transitive dependencies.

    Handles primitives, ``str`` Enums, attrs-defined classes (including
    dict-like types that only carry ``additional_properties``), ``list``,
    ``dict``, and unions (including ``None``/``Unset`` stripping).
    """
    if root_type is None:
        return {}

    schemas: dict[str, Any] = {}  # type: ignore[explicit-any]
    visited: set[type[Any]] = set()  # type: ignore[explicit-any]

    def _type_to_schema(tp: type[Any]) -> dict[str, Any]:  # type: ignore[explicit-any]
        if tp is type(None):
            return {"type": "null"}
        if tp is str:
            return {"type": "string"}
        if tp is int:
            return {"type": "integer"}
        if tp is float:
            return {"type": "number"}
        if tp is bool:
            return {"type": "boolean"}
        if isinstance(tp, type) and issubclass(tp, enum.Enum):
            _walk(tp)
            return {"$ref": f"#/components/schemas/{tp.__name__}"}
        if isinstance(tp, type) and attr.has(tp):
            _walk(tp)
            return {"$ref": f"#/components/schemas/{tp.__name__}"}
        origin = get_origin(tp)
        if origin is list:
            return {"type": "array", "items": _type_to_schema(get_args(tp)[0])}
        if origin is dict:
            value_type = get_args(tp)[1]
            return {
                "type": "object",
                "additionalProperties": _type_to_schema(value_type),
            }
        if origin is Union or isinstance(tp, types_mod.UnionType):
            members = [a for a in get_args(tp) if a is not type(None)]
            if len(members) == 1:
                return _type_to_schema(members[0])
            return {"anyOf": [_type_to_schema(m) for m in members]}
        return {"type": "string"}

    def _walk(tp: type[Any], is_root: bool = False) -> None:  # type: ignore[explicit-any]
        if tp in visited:
            return
        visited.add(tp)

        if isinstance(tp, type) and issubclass(tp, enum.Enum):
            schemas[tp.__name__] = {
                "title": tp.__name__,
                "type": "string",
                "enum": [e.value for e in tp],
            }
            return

        if not attr.has(tp):
            return

        hints = _resolve_attrs_hints(tp)
        user_fields = [a for a in attr.fields(tp) if a.name != "additional_properties"]

        # Dict-like attrs types that only carry additional_properties
        if not user_fields:
            ap_hint = hints.get("additional_properties")
            if ap_hint is not None and get_origin(ap_hint) is dict:
                value_type = get_args(ap_hint)[1]
                schemas[tp.__name__] = {
                    "title": tp.__name__,
                    "type": "object",
                    "additionalProperties": _type_to_schema(value_type),
                }
            else:
                schemas[tp.__name__] = {"title": tp.__name__, "type": "object"}
            return

        properties: dict[str, Any] = {}  # type: ignore[explicit-any]
        required: list[str] = []

        for field in user_fields:
            if is_root and exclude_ref_id and field.name == "ref_id":
                continue

            ft = hints.get(field.name)
            if ft is None:
                continue

            has_unset, has_none, clean = _decompose_union(ft, unset_marker)
            field_schema = _type_to_schema(clean)

            if has_none:
                field_schema = {"anyOf": [field_schema, {"type": "null"}]}

            if not has_unset:
                required.append(field.name)

            properties[field.name] = field_schema

        schema: dict[str, Any] = {  # type: ignore[explicit-any]
            "title": tp.__name__,
            "type": "object",
            "properties": properties,
            "additionalProperties": False,
        }
        if required:
            schema["required"] = required
        schemas[tp.__name__] = schema

    _walk(root_type, is_root=True)
    return schemas


_RestApiGatewayMethodT = TypeVar("_RestApiGatewayMethodT", bound="RestApiGatewayMethod[Any, Any, Any, Any, Any, Any, Any, Any, Any]")  # type: ignore[explicit-any]


class RestApiGatewayMethod(
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
    RestMethod[_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
    ABC,
):
    """A REST method for the metrics resource."""

    _args: type[_ApiArgsT] | None
    _result: type[_ApiResultT] | None
    _api_call: _ApiCallT  # type: ignore[explicit-any]

    def __init__(  # type: ignore[explicit-any]
        self,
        ports: _PortsT,
        global_properties: _GlobalPropertiesT,
        service_properties: _ServicePropertiesT,
        args: type[_ApiArgsT] | None,
        result: type[_ApiResultT] | None,
        api_call: _ApiCallT,
        name: Literal["GET", "POST", "PUT", "DELETE"],
    ):
        """Initialize the method."""
        super().__init__(ports, global_properties, service_properties, name)
        self._args = args
        self._result = result
        self._api_call = api_call

    @classmethod
    def get(  # type: ignore[explicit-any]
        cls: type[_RestApiGatewayMethodT],
        api_call: _ApiCallT,
    ) -> Callable[
        [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
        """RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT]""",
    ]:
        """Build a GET method."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT,
        ]:
            return cls(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "GET",
            )

        return build_it

    @classmethod
    def post(  # type: ignore[explicit-any]
        cls: type[_RestApiGatewayMethodT],
        api_call: _ApiCallT,
    ) -> Callable[
        [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
        """RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT]""",
    ]:
        """Build a POST method."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT,
        ]:
            return cls(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "POST",
            )

        return build_it

    @classmethod
    def put(  # type: ignore[explicit-any]
        cls: type[_RestApiGatewayMethodT],
        api_call: _ApiCallT,
    ) -> Callable[
        [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
        """RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT]""",
    ]:
        """Build a PUT method."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT,
        ]:
            return cls(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "PUT",
            )

        return build_it

    @classmethod
    def delete(  # type: ignore[explicit-any]
        cls: type[_RestApiGatewayMethodT],
        api_call: _ApiCallT,
    ) -> Callable[
        [_PortsT, _GlobalPropertiesT, _ServicePropertiesT],
        """RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT,
        ]""",
    ]:
        """Build a DELETE method."""
        args, result = _extract_types_from_api_call(
            api_call, cls.unset_marker_type(), cls.error_response_type()
        )

        def build_it(  # type: ignore[explicit-any]
            ports: _PortsT,
            global_properties: _GlobalPropertiesT,
            service_properties: _ServicePropertiesT,
        ) -> RestApiGatewayMethod[
            _PortsT,
            _GlobalPropertiesT,
            _ServicePropertiesT,
            _WebApiAuthenticatedClientT,
            _WebApiUnsetMarkerT,
            _WebApiClientErrorResponseT,
            _ApiArgsT,
            _ApiResultT,
            _ApiCallT,
        ]:
            return cls(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "DELETE",
            )

        return build_it

    def _description(self) -> str:  # type: ignore[explicit-any]
        """The description of the method."""
        doc = self._api_call.__doc__
        if not doc:
            return ""
        # Extract only up to "Args: " if present, else first line
        doc_lines = doc.strip().splitlines()
        result_lines = []
        for line in doc_lines:
            if line.strip().startswith("Args:"):
                break
            result_lines.append(line)
        # Only return up to the "Args:" block, join, strip trailing blank lines
        return "\n".join(result_lines).strip()

    async def execute(self, request: Request) -> Response:  # type: ignore[explicit-any]
        """Core execution logic."""

        def extract_bearer_token_from_request(request: Request) -> str | None:
            """Extract bearer token from the request's Authorization header, or None if invalid."""
            auth_header: str | None = request.headers.get("authorization")
            if not auth_header:
                return None
            if not auth_header.lower().startswith("bearer "):
                return None
            token = auth_header[7:].strip()
            if not token:
                return None
            return token

        def _reduce_path_params(request: Request) -> dict[str, str]:
            """Build a reduced dict from path params.

            Keys containing "___" (e.g. "occasions___ref_id") are stripped
            to their suffix (e.g. "ref_id"). Keys are processed in sorted
            order so longer prefixed keys overwrite shorter plain ones.
            """
            reduced: dict[str, str] = {}
            for key in sorted(request.path_params.keys(), key=len):
                value = request.path_params[key]
                if "___" in key:
                    suffix = key.split("___")[-1]
                    reduced[suffix] = value
                else:
                    reduced[key] = value
            return reduced

        def parse_args_from_query(request: Request) -> _ApiArgsT | None:
            """Parse query params from the request into the args type, or None on error."""
            if self._args is None:
                return None

            try:
                query_dict = dict(request.query_params)
                query_dict.update(_reduce_path_params(request))
                return self._args.from_dict(query_dict)  # type: ignore[no-any-return]
            except KeyError:
                return None

        async def parse_args_from_body(request: Request) -> _ApiArgsT | None:
            """Parse body from the request into the args type, or None on error."""
            if self._args is None:
                return None

            try:
                raw_body = await request.body()
                if len(raw_body) == 0:
                    body_dict = {}
                else:
                    body_dict = json.loads(raw_body)
                body_dict.update(_reduce_path_params(request))
                return self._args.from_dict(body_dict)  # type: ignore[no-any-return]
            except (KeyError, ValueError):
                return None

        api_key = extract_bearer_token_from_request(request)
        if api_key is None:
            return Response(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content="Missing or invalid Authorization header",
            )

        try:
            auth_token = await self._do_key_exchange(api_key)
        except httpx.TimeoutException:
            return Response(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT, content="Timeout"
            )

        if isinstance(auth_token, Response):
            return auth_token

        if self._args is not None:
            if request.method == "GET":
                args = parse_args_from_query(request)
            else:
                args = await parse_args_from_body(request)
            if args is None:
                return Response(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content="Invalid arguments",
                )
        else:
            args = None

        auth_client = self.get_authenticated_client(request.state.trace_id, auth_token)

        try:
            response = await self._api_call(
                client=auth_client, body=args or self.unset_marker()
            )
        except httpx.TimeoutException:
            return Response(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT, content="Timeout"
            )

        if not response.status_code.is_success:
            error_resp = cast(WebApiClientErrorResponse, response.parsed)
            return JSONResponse(
                status_code=status.HTTP_502_BAD_GATEWAY,
                content={
                    "status": response.status_code,
                    "response": error_resp.to_dict(),
                },
            )

        if self._result is None or self._result is Any:  # type: ignore[explicit-any, comparison-overlap]
            return JSONResponse(content=None)

        if not isinstance(response.parsed, self._result):
            return Response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content="Unexpected response type",
            )

        return JSONResponse(content=response.parsed.to_dict())

    def get_openapi_components(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Get the OpenAPI components for the method."""
        components = dict(OPENAPI_ERROR_RESPONSES)
        components.update(
            _build_openapi_schemas_for_type(self._result, self.unset_marker_type())
        )
        if self._method != "GET":
            components.update(
                _build_openapi_schemas_for_type(
                    self._args, self.unset_marker_type(), exclude_ref_id=True
                )
            )
        return components

    def get_openapi_path(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Get the OpenAPI path for the method."""
        request_body: dict[str, Any] = {}  # type: ignore[explicit-any]
        if (
            self.method_name != "GET"
            and self._args is not None
            and _attrs_type_has_payload(self._args)
        ):
            request_body = {  # type: ignore[explicit-any]
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": f"#/components/schemas/{self._args.__name__}"
                        }
                    }
                },
            }

        responses: dict[str, Any] = {}  # type: ignore[explicit-any]

        if self._result is not None and self._result is not Any:  # type: ignore[explicit-any, comparison-overlap]
            responses["200"] = {
                "description": "Successful response",
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": f"#/components/schemas/{self._result.__name__}"
                        }
                    }
                },
            }
        else:
            responses["200"] = {
                "description": "Successful response / Empty body",
            }

        responses["400"] = {
            "description": "Invalid arguments",
            "content": {"text/plain": {"schema": {"type": "string"}}},
        }
        responses["401"] = {
            "description": "Missing or invalid Authorization header, or API key exchange failed",
            "content": {"text/plain": {"schema": {"type": "string"}}},
        }
        responses["500"] = {
            "description": "Unexpected status or unexpected response type",
            "content": {"text/plain": {"schema": {"type": "string"}}},
        }
        responses["502"] = {
            "description": "Downstream API call failed",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "object",
                        "required": ["status", "response"],
                        "properties": {
                            "status": {"type": "integer"},
                            "response": {"$ref": "#/components/schemas/ErrorResponse"},
                        },
                        "additionalProperties": False,
                    }
                }
            },
        }
        responses["504"] = {
            "description": "Gateway timeout",
            "content": {"text/plain": {"schema": {"type": "string"}}},
        }

        operation_id = _extract_operation_id_from_api_call(self._api_call)

        if self._tag is None:
            raise Exception("Tag is None")

        parameters = _extract_path_parameters(self._attached_path or "")
        if self.method_name == "GET" and _attrs_type_has_payload(self._args):
            parameters.extend(
                _build_query_parameters(self._args, self.unset_marker_type())
            )

        path_object: dict[str, Any] = {  # type: ignore[explicit-any]
            "summary": self._description(),
            "description": self._description(),
            "operationId": operation_id,
            "tags": [self._tag],
            "security": [{"BearerAuth": []}],
            "responses": responses,
        }

        if request_body:
            path_object["requestBody"] = request_body
        if parameters:
            path_object["parameters"] = parameters

        return path_object

    @classmethod
    def unset_marker(cls) -> WebApiUnsetMarker:  # type: ignore[explicit-any]
        """The unset marker for the method."""
        return cls.unset_marker_type()()

    @classmethod
    def unset_marker_type(cls) -> type[WebApiUnsetMarker]:  # type: ignore[explicit-any]
        """The type of the unset marker for the method."""
        for klass in cls.__mro__:
            for base in getattr(klass, "__orig_bases__", ()):
                if get_origin(base) is RestApiGatewayMethod:
                    args = get_args(base)
                    if len(args) > 4 and isinstance(args[4], type):
                        return args[4]  # type: ignore[return-value]
        raise TypeError(
            f"Cannot extract _WebApiUnsetMarkerT from {cls.__name__}; "
            "ensure the class parameterises RestApiGatewayMethod with concrete types"
        )

    @classmethod
    def error_response_type(cls) -> type[WebApiClientErrorResponse]:  # type: ignore[explicit-any]
        """The type of the error response for the method."""
        for klass in cls.__mro__:
            for base in getattr(klass, "__orig_bases__", ()):
                if get_origin(base) is RestApiGatewayMethod:
                    args = get_args(base)
                    if len(args) > 5 and isinstance(args[5], type):
                        return args[5]  # type: ignore[return-value]
        raise TypeError(
            f"Cannot extract _WebApiClientErrorResponseT from {cls.__name__}; "
            "ensure the class parameterises RestApiGatewayMethod with concrete types"
        )

    @abstractmethod
    def get_authenticated_client(self, trace_id: TraceId, token: str) -> _WebApiAuthenticatedClientT:  # type: ignore[explicit-any]
        """The authenticated client for the method."""

    @abstractmethod
    async def _do_key_exchange(self, key: str) -> str | Response:  # type: ignore[explicit-any]
        """Do the key exchange for the method."""
