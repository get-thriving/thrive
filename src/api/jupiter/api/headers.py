"""Standard Jupiter response headers."""

from typing import Final

from jupiter.core.config import JupiterGlobalProperties

UNIVERSE_HEADER: Final[str] = "X-Jupiter-Universe"
ENV_HEADER: Final[str] = "X-Jupiter-Env"
INSTANCE_HEADER: Final[str] = "X-Jupiter-Instance"
HOSTING_HEADER: Final[str] = "X-Jupiter-Hosting"
VERSION_HEADER: Final[str] = "X-Jupiter-Version"


def build_response_headers(
    global_properties: JupiterGlobalProperties,
) -> dict[str, str]:
    """Build the standard Jupiter response headers from global properties."""
    return {
        UNIVERSE_HEADER: str(global_properties.universe),
        ENV_HEADER: global_properties.env.value,
        INSTANCE_HEADER: str(global_properties.instance),
        HOSTING_HEADER: global_properties.universe.hosting.value,
        VERSION_HEADER: str(global_properties.version),
    }
