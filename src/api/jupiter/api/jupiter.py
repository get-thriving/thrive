"""The Jupiter external API."""

import asyncio

from fastapi import Request, Response
from jupiter.api.config import (
    JupiterApiMethod,
    JupiterApiPorts,
    JupiterApiResource,
    JupiterApiService,
    build_api_properties,
)
from jupiter.api.webapi_client import WebApiClient
from jupiter.core.config import build_global_properties
from jupiter.framework.telemetry.local.local import LocalTelemetry
from jupiter.framework.telemetry.sentry.sentry import SentryTelemetry
from jupiter.framework.telemetry.telemetry import Telemetry
from jupiter_webapi_client.api.api_key.a_pi_key_exchange import (
    asyncio as api_key_exchange,
)
from jupiter_webapi_client.models.api_key_exchange_args import APIKeyExchangeArgs
from rich import print as rich_print


class MetricsRestMethod(JupiterApiMethod):
    """A REST method for the metrics resource."""

    async def execute(self, request: Request) -> Response:
        """Execute the method."""
        API_KEY = "ak_local_2.9c9ed24bbbb1e81253b70906fe3c7265"
        client = self._ports.webapi_client.client

        resp = await api_key_exchange(
            client=client, body=APIKeyExchangeArgs(api_key_external=API_KEY)
        )

        rich_print(resp)
        return Response(content="Hello, world!")


async def main() -> None:
    """Application main function."""
    global_properties = build_global_properties()
    service_properties = build_api_properties()

    telemetry: Telemetry

    if (
        global_properties.env.is_live
        and global_properties.universe.hosting.is_hosted_global
    ):
        telemetry = SentryTelemetry(service_properties.sentry_dsn)
    else:
        telemetry = LocalTelemetry()

    telemetry.prepare()

    webapi_client = WebApiClient(service_properties.webapi_url)

    ports = JupiterApiPorts(
        webapi_client=webapi_client,
    )

    api_service = JupiterApiService.build(
        ports,
        global_properties,
        service_properties,
        JupiterApiResource.build("metrics", MetricsRestMethod.build("GET")),
    )

    rich_print("=" * 80)
    rich_print("Starting Jupiter WebAPI:")
    rich_print(f"  Version: {global_properties.version}")
    rich_print(f"  Universe: {global_properties.universe}")
    rich_print(f"  Environment: {global_properties.env}")
    rich_print(f"  Instance: {global_properties.instance}")
    rich_print(f"  Hosting: {global_properties.universe.hosting}")
    rich_print("=" * 80)

    await api_service.run()

    # app = JupiterRestAPIAppForm(
    #     APIVersion(
    #         "v1",
    #         APIResource(
    #             "inbox-tasks",
    #             APIPostMethod(
    #                 inbox_task_create_async
    #                 InboxTaskCreateArgs,
    #                 InboxTaskCreateResult,
    #             ),
    #             APIGetMethod(
    #                 inbox_task_find_async,
    #                 InboxTaskCreateArgs,
    #                 InboxTaskCreateResult
    #             ),
    #             APIResource(
    #                 ":refId",
    #                 APIGetMethod(
    #                     inbox_task_get_async,
    #                     InboxTaskCreateArgs,
    #                     InboxTaskCreateResult
    #                 )
    #             )
    #         )
    #     )
    # )


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
