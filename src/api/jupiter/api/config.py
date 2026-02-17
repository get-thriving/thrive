"""The API configuration."""

import json
import os
from dataclasses import dataclass
from pathlib import Path
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
    get_type_hints,
)

import dotenv
import httpx
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from jupiter.api.headers import build_response_headers
from jupiter.api.webapi_client import WebApiClient
from jupiter.core.config import JupiterGlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.rest.method import RestMethod
from jupiter.framework.service.rest.resource import RestResource
from jupiter.framework.service.rest.service import RestService
from jupiter.framework.service_properties import ServiceProperties
from jupiter_webapi_client import AuthenticatedClient, errors
from jupiter_webapi_client.api.api_key.a_pi_key_exchange import (
    asyncio_detailed as api_key_exchange,
)
from jupiter_webapi_client.models import (
    APIKeyExchangeArgs,
    APIKeyExchangeResult,
    ErrorResponse,
)
from jupiter_webapi_client.types import UNSET, Unset
from jupiter_webapi_client.types import Response as WebApiClientResponse


@dataclass(frozen=True)
class JupiterApiPorts(Ports):
    """The ports for the Jupiter API."""

    webapi_client: WebApiClient


@dataclass(frozen=True)
class JupiterApiProperties(ServiceProperties):
    """The properties for the Jupiter API."""

    host: str
    port: int
    sentry_dsn: str
    webapi_url: str


def build_api_properties() -> JupiterApiProperties:
    """Build the API properties from the environment."""

    def find_up_the_dir_tree(partial_path: Union[str, Path]) -> Path:
        last_here = None
        right_here = Path(os.path.relpath(__file__)).parent
        while True:
            if last_here == right_here:
                raise Exception(f"Critical error - missing config file {partial_path}")
            config_file = right_here / partial_path
            if config_file.exists():
                return config_file
            last_here = right_here
            right_here = right_here.parent

    project_config_path = find_up_the_dir_tree("Config.project")

    dotenv.load_dotenv(dotenv_path=project_config_path, verbose=True)

    host = cast(str, os.getenv("HOST"))
    port = int(cast(str, os.getenv("PORT")))
    sentry_dsn = cast(str, os.getenv("SENTRY_DSN"))
    webapi_server_host = cast(str, os.getenv("WEBAPI_SERVER_HOST"))
    webapi_server_port = int(cast(str, os.getenv("WEBAPI_SERVER_PORT")))
    webapi_url = f"http://{webapi_server_host}:{webapi_server_port}"

    return JupiterApiProperties(
        host=host,
        port=port,
        sentry_dsn=sentry_dsn,
        webapi_url=webapi_url,
    )


class JupiterApiResource(
    RestResource[JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties]
):
    """The Jupiter API resource."""


class JupiterApiMethod(
    RestMethod[JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties]
):
    """The Jupiter API method."""


class _WebApiClientSerializable(Protocol):
    """Protocol for types with from_dict and to_dict."""

    def to_dict(self) -> dict[str, Any]:  # type: ignore[explicit-any]
        """Convert the object to a dictionary."""

    @classmethod
    def from_dict(cls: type[Any], src_dict: Mapping[str, Any]) -> Any:  # type: ignore[explicit-any]
        """Convert a dictionary to an object."""


_ApiArgsT = TypeVar("_ApiArgsT", bound=_WebApiClientSerializable)
_ApiResultT = TypeVar("_ApiResultT", bound=_WebApiClientSerializable)

_CallApiArgsT_contra = TypeVar(
    "_CallApiArgsT_contra", bound=_WebApiClientSerializable, contravariant=True
)
_CallApiResultT = TypeVar(
    "_CallApiResultT", bound=_WebApiClientSerializable, covariant=False
)


class _WebApiClientCallable(Protocol[_CallApiArgsT_contra, _CallApiResultT]):
    """Protocol for callable API functions."""

    def __call__(
        self,
        *,
        client: AuthenticatedClient,
        body: _CallApiArgsT_contra,
    ) -> Awaitable[WebApiClientResponse[ErrorResponse | _CallApiResultT]]: ...


_ApiCallT = TypeVar("_ApiCallT", bound=_WebApiClientCallable[Any, Any])  # type: ignore[explicit-any]


def _extract_types_from_api_call(  # type: ignore[explicit-any, return-value]
    api_call: Any,
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
            if arg is not Unset:
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
                    if arg is not ErrorResponse:
                        result_type = arg
                        break

    return args_type, result_type


class JupiterApiGatewayMethod(
    JupiterApiMethod, Generic[_ApiArgsT, _ApiResultT, _ApiCallT]
):
    """A REST method for the metrics resource."""

    _args: type[_ApiArgsT] | None
    _result: type[_ApiResultT] | None
    _api_call: _ApiCallT  # type: ignore[explicit-any]

    def __init__(  # type: ignore[explicit-any]
        self,
        ports: JupiterApiPorts,
        global_properties: JupiterGlobalProperties,
        service_properties: JupiterApiProperties,
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

    @staticmethod
    def get(  # type: ignore[explicit-any]
        api_call: _ApiCallT,
    ) -> Callable[
        [JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties],
        "JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]",
    ]:
        """Build a GET method."""
        args, result = _extract_types_from_api_call(api_call)

        def build_it(  # type: ignore[explicit-any]
            ports: JupiterApiPorts,
            global_properties: JupiterGlobalProperties,
            service_properties: JupiterApiProperties,
        ) -> JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]:
            return JupiterApiGatewayMethod(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "GET",
            )

        return build_it

    @staticmethod
    def post(  # type: ignore[explicit-any]
        api_call: _ApiCallT,
    ) -> Callable[
        [JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties],
        "JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]",
    ]:
        """Build a POST method."""
        args, result = _extract_types_from_api_call(api_call)

        def build_it(  # type: ignore[explicit-any]
            ports: JupiterApiPorts,
            global_properties: JupiterGlobalProperties,
            service_properties: JupiterApiProperties,
        ) -> JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]:
            return JupiterApiGatewayMethod(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "POST",
            )

        return build_it

    @staticmethod
    def put(  # type: ignore[explicit-any]
        api_call: _ApiCallT,
    ) -> Callable[
        [JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties],
        "JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]",
    ]:
        """Build a PUT method."""
        args, result = _extract_types_from_api_call(api_call)

        def build_it(  # type: ignore[explicit-any]
            ports: JupiterApiPorts,
            global_properties: JupiterGlobalProperties,
            service_properties: JupiterApiProperties,
        ) -> JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]:
            return JupiterApiGatewayMethod(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "PUT",
            )

        return build_it

    @staticmethod
    def delete(  # type: ignore[explicit-any]
        api_call: _ApiCallT,
    ) -> Callable[
        [JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties],
        "JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]",
    ]:
        """Build a DELETE method."""
        args, result = _extract_types_from_api_call(api_call)

        def build_it(  # type: ignore[explicit-any]
            ports: JupiterApiPorts,
            global_properties: JupiterGlobalProperties,
            service_properties: JupiterApiProperties,
        ) -> JupiterApiGatewayMethod[_ApiArgsT, _ApiResultT, _ApiCallT]:
            return JupiterApiGatewayMethod(
                ports,
                global_properties,
                service_properties,
                args,
                result,
                api_call,
                "DELETE",
            )

        return build_it

    async def execute(self, request: Request) -> Response:  # type: ignore[explicit-any]
        """Execute the method."""
        response = await self._do_execute(request)
        for key, value in build_response_headers(self._global_properties).items():
            response.headers[key] = value
        return response

    async def _do_execute(self, request: Request) -> Response:  # type: ignore[explicit-any]
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

        client = self._ports.webapi_client.client

        try:
            resp = await api_key_exchange(
                client=client, body=APIKeyExchangeArgs(api_key_external=api_key)
            )
        except errors.UnexpectedStatus:
            return Response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content="Unexpected status",
            )
        except httpx.TimeoutException:
            return Response(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT, content="Timeout"
            )

        if not resp.status_code.is_success:
            error_resp = cast(ErrorResponse, resp.parsed)
            return Response(
                status_code=status.HTTP_401_UNAUTHORIZED, content=error_resp.reason
            )

        true_resp = cast(APIKeyExchangeResult, resp.parsed)

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

        auth_client = AuthenticatedClient(
            base_url=client._base_url,
            raise_on_unexpected_status=True,
            token=true_resp.auth_token_ext,
        )

        try:
            response = await self._api_call(client=auth_client, body=args or UNSET)
        except errors.UnexpectedStatus:
            return Response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content="Unexpected status",
            )
        except httpx.TimeoutException:
            return Response(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT, content="Timeout"
            )

        if not response.status_code.is_success:
            error_resp = cast(ErrorResponse, response.parsed)
            return Response(status_code=response.status_code, content=error_resp.reason)

        if self._result is None:
            return JSONResponse(content=None)

        if not isinstance(response.parsed, self._result):
            return Response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content="Unexpected response type",
            )

        return JSONResponse(content=response.parsed.to_dict())


class JupiterApiService(
    RestService[JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties]
):
    """The Jupiter API service."""

    @property
    def description(self) -> str:
        """The description of the app."""
        return self._global_properties.description

    @property
    def version(self) -> str:
        """The version of the app."""
        return str(self._global_properties.version)

    @property
    def host(self) -> str:
        """The host of the app."""
        return self._service_properties.host

    @property
    def port(self) -> int:
        """The port of the app."""
        return self._service_properties.port

    @property
    def is_live(self) -> bool:
        """Whether the app is live."""
        return self._global_properties.env.is_live

    def add_headers_to_response(self, response: Response) -> None:
        """Add standard Jupiter headers to the response."""
        for key, value in build_response_headers(self._global_properties).items():
            response.headers[key] = value
