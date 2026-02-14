"""The API configuration."""

from dataclasses import dataclass
import os
from pathlib import Path
from typing import Union, cast
import dotenv
from jupiter.framework.service.rest.service import RestService
from jupiter.framework.service_properties import ServiceProperties


@dataclass(frozen=True)
class JupiterApiProperties(ServiceProperties):
    """The properties for the Jupiter API."""

    host: str
    port: int

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

    global_config_path = find_up_the_dir_tree("Config.global")
    project_config_path = find_up_the_dir_tree("Config.project")

    dotenv.load_dotenv(dotenv_path=global_config_path, verbose=True)
    dotenv.load_dotenv(dotenv_path=project_config_path, verbose=True)

    host = cast(str, os.getenv("HOST"))
    port = int(cast(str, os.getenv("PORT")))

    return JupiterApiProperties(
        host=host,
        port=port,
    )


class JupiterApiService(RestService[JupiterApiProperties]):
    """The Jupiter API service."""

    @property
    def description(self) -> str:
        """The description of the app."""
        return "Jupiter API"

    @property
    def version(self) -> str:
        """The version of the app."""
        return "1.0.0"