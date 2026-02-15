"""The webapi client, as managed by the Jupiter API."""

from jupiter.framework.ports import DomainPorts
from jupiter_webapi_client import Client


class WebApiClient(DomainPorts):
    """The webapi client, as managed by the Jupiter API."""

    client: Client

    def __init__(self, webapi_url: str) -> None:
        """Initialize the ports."""
        self.client = Client(base_url=webapi_url)
