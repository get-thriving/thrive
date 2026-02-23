"""The API configuration."""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import (
    Any,
    Generic,
    TypeVar,
    Union,
    cast,
)

import dotenv
from fastapi import Response, status
from jupiter.api.headers import build_response_headers
from jupiter.api.webapi_client import WebApiClient
from jupiter.core.config import JupiterGlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.rest.api_gateway_method import (
    RestApiGatewayMethod,
    WebApiClientCallable,
    WebApiClientErrorResponse,
    WebApiClientSerializable,
)
from jupiter.framework.service.rest.method import RestMethod
from jupiter.framework.service.rest.resource import RestResource
from jupiter.framework.service.rest.service import RestService
from jupiter.framework.service_properties import ServiceProperties
from jupiter_webapi_client import AuthenticatedClient
from jupiter_webapi_client.api.api_key.a_pi_key_exchange import (
    asyncio_detailed as api_key_exchange,
)
from jupiter_webapi_client.models import (
    APIKeyExchangeArgs,
    APIKeyExchangeResult,
    ErrorResponse,
)
from pathlib import Path
from jupiter_webapi_client.types import Unset

_ApiArgsT = TypeVar("_ApiArgsT", bound=WebApiClientSerializable)
_ApiResultT = TypeVar("_ApiResultT", bound=WebApiClientSerializable)
_ApiCallT = TypeVar("_ApiCallT", bound=WebApiClientCallable[Any, Any, Any])  # type: ignore[explicit-any]


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
    mount_path: str


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
    mount_path = cast(str, os.getenv("MOUNT_PATH") or "/")

    return JupiterApiProperties(
        host=host,
        port=port,
        sentry_dsn=sentry_dsn,
        webapi_url=webapi_url,
        mount_path=mount_path,
    )


class JupiterApiResource(
    RestResource[JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties]
):
    """The Jupiter API resource."""

    def _build_final_api_path(self, path: str) -> str:
        """Build the final API path."""
        base_path = Path(self._service_properties.mount_path)
        version_segment = f"v{self._global_properties.version.major_version}"
        api_path = Path(path.lstrip("/"))
        return str(base_path / version_segment / api_path)


class JupiterApiMethod(
    RestMethod[JupiterApiPorts, JupiterGlobalProperties, JupiterApiProperties]
):
    """The Jupiter API method."""


class JupiterApiGatewayMethod(
    Generic[_ApiArgsT, _ApiResultT, _ApiCallT],
    RestApiGatewayMethod[  # type: ignore[explicit-any]
        JupiterApiPorts,
        JupiterGlobalProperties,
        JupiterApiProperties,
        AuthenticatedClient,
        Unset,
        ErrorResponse,
        _ApiArgsT,
        _ApiResultT,
        _ApiCallT,
    ],
):
    """The Jupiter API gateway method."""

    def get_authenticated_client(self, token: str) -> AuthenticatedClient:  # type: ignore[explicit-any]
        """Get the authenticated client."""
        return AuthenticatedClient(
            base_url=self._ports.webapi_client.client._base_url,
            raise_on_unexpected_status=True,
            token=token,
        )

    async def _do_key_exchange(self, key: str) -> str | Response:  # type: ignore[explicit-any]
        client = self._ports.webapi_client.client

        resp = await api_key_exchange(
            client=client, body=APIKeyExchangeArgs(api_key_external=key)
        )

        if not resp.status_code.is_success:
            error_resp = cast(WebApiClientErrorResponse, resp.parsed)
            return Response(
                status_code=status.HTTP_401_UNAUTHORIZED, content=error_resp.reason
            )

        true_resp = cast(APIKeyExchangeResult, resp.parsed)

        return true_resp.auth_token_ext


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

    @property
    def healthz_route(self) -> str:
        """The healthz route of the app."""
        path = Path(self._service_properties.mount_path) / "healthz"
        return str(path)

    @property
    def openapi_json_route(self) -> str:
        """The openapi json route of the app."""
        path = Path(self._service_properties.mount_path) / "openapi.json"
        return str(path)

    @property
    def openapi_docs_route(self) -> str:
        """The openapi docs route of the app."""
        path = Path(self._service_properties.mount_path) / "docs"
        return str(path)

    @property
    def openapi_redoc_route(self) -> str:
        """The openapi redoc route of the app."""
        path = Path(self._service_properties.mount_path) / "redoc"
        return str(path)

    def add_headers_to_response(self, response: Response) -> None:
        """Add standard Jupiter headers to the response."""
        for key, value in build_response_headers(self._global_properties).items():
            response.headers[key] = value
