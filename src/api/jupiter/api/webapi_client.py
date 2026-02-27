"""The webapi client, as managed by the Jupiter API."""

from jupiter.api.headers import (
    FRONTDOOR_HEADER,
    build_frontdoor_header,
    build_response_headers,
)
from jupiter.core.config import JupiterGlobalProperties
from jupiter.framework.ports import DomainPorts
from jupiter_webapi_client import Client


class WebApiClient(DomainPorts):
    """The webapi client, as managed by the Jupiter API."""

    client: Client

    def __init__(
        self, global_properties: JupiterGlobalProperties, webapi_url: str
    ) -> None:
        """Initialize the ports."""
        headers = build_response_headers(global_properties)
        headers[FRONTDOOR_HEADER] = build_frontdoor_header(global_properties)
        self.client = Client(
            base_url=webapi_url,
            raise_on_unexpected_status=True,
            headers=headers,
        )
