"""The Jupiter external API."""

import asyncio

from jupiter.api.config import (
    JupiterApiGatewayMethod,
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
from jupiter_webapi_client.api.metrics.metric_find import (
    asyncio_detailed as metric_find,
)
from jupiter_webapi_client.api.smart_lists.smart_list_find import (
    asyncio_detailed as smart_list_find,
)
from jupiter_webapi_client.api.smart_lists.smart_list_load import (
    asyncio_detailed as smart_list_load,
)
from jupiter_webapi_client.models import (
    MetricFindResult,
    SmartListFindArgs,
    SmartListFindResult,
    SmartListLoadArgs,
    SmartListLoadResult,
)
from jupiter_webapi_client.models.metric_find_args import MetricFindArgs
from rich import print as rich_print


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
        JupiterApiResource.build(
            "metrics",
            JupiterApiGatewayMethod.get(MetricFindArgs, MetricFindResult, metric_find),
        ),
        JupiterApiResource.build(
            "smart-lists",
            JupiterApiGatewayMethod.get(
                SmartListFindArgs, SmartListFindResult, smart_list_find
            ),
        ),
        JupiterApiResource.build(
            ":ref_id",
            JupiterApiGatewayMethod.get(
                SmartListLoadArgs, SmartListLoadResult, smart_list_load
            ),
        )
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


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
