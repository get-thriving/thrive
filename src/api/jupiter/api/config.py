"""The API configuration."""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Union, cast

import dotenv
from jupiter.api.webapi_client import WebApiClient
from jupiter.core.config import JupiterGlobalProperties
from jupiter.framework.ports import Ports
from jupiter.framework.service.rest.method import RestMethod
from jupiter.framework.service.rest.resource import RestResource
from jupiter.framework.service.rest.service import RestService
from jupiter.framework.service_properties import ServiceProperties


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
