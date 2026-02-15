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
from jupiter_webapi_client.api.smart_lists.smart_list_archive import (
    asyncio_detailed as smart_list_archive,
)
from jupiter_webapi_client.api.smart_lists.smart_list_create import (
    asyncio_detailed as smart_list_create,
)
from jupiter_webapi_client.api.smart_lists.smart_list_find import (
    asyncio_detailed as smart_list_find,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_create import (
    asyncio_detailed as smart_list_item_create,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_load import (
    asyncio_detailed as smart_list_item_load,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_remove import (
    asyncio_detailed as smart_list_item_remove,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_update import (
    asyncio_detailed as smart_list_item_update,
)
from jupiter_webapi_client.api.smart_lists.smart_list_load import (
    asyncio_detailed as smart_list_load,
)
from jupiter_webapi_client.api.smart_lists.smart_list_remove import (
    asyncio_detailed as smart_list_remove,
)
from jupiter_webapi_client.api.smart_lists.smart_list_update import (
    asyncio_detailed as smart_list_update,
)
from jupiter_webapi_client.models import (
    MetricFindResult,
    SmartListArchiveArgs,
    SmartListCreateArgs,
    SmartListCreateResult,
    SmartListFindArgs,
    SmartListFindResult,
    SmartListItemCreateArgs,
    SmartListItemCreateResult,
    SmartListItemLoadArgs,
    SmartListItemLoadResult,
    SmartListItemRemoveArgs,
    SmartListItemUpdateArgs,
    SmartListLoadArgs,
    SmartListLoadResult,
    SmartListUpdateArgs,
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
        # Smart Lists
        JupiterApiResource.build(
            "smart-lists",
            JupiterApiGatewayMethod.post(
                SmartListCreateArgs, SmartListCreateResult, smart_list_create
            ),
            JupiterApiGatewayMethod.get(
                SmartListFindArgs, SmartListFindResult, smart_list_find
            ),
            JupiterApiResource.build(
                ":ref_id",
                JupiterApiGatewayMethod.get(
                    SmartListLoadArgs, SmartListLoadResult, smart_list_load
                ),
                JupiterApiGatewayMethod.put(
                    SmartListUpdateArgs, None, smart_list_update
                ),
                JupiterApiGatewayMethod.delete(
                    SmartListArchiveArgs, None, smart_list_archive
                ),
                JupiterApiResource.build(
                    "remove",
                    JupiterApiGatewayMethod.delete(
                        SmartListItemRemoveArgs, None, smart_list_remove
                    ),
                ),
                JupiterApiResource.build(
                    "items",
                    JupiterApiGatewayMethod.post(
                        SmartListItemCreateArgs,
                        SmartListItemCreateResult,
                        smart_list_item_create,
                    ),
                    JupiterApiResource.build(
                        ":ref_id",
                        JupiterApiGatewayMethod.get(
                            SmartListItemLoadArgs,
                            SmartListItemLoadResult,
                            smart_list_item_load,
                        ),
                        JupiterApiGatewayMethod.put(
                            SmartListItemUpdateArgs, None, smart_list_item_update
                        ),
                        JupiterApiGatewayMethod.delete(
                            SmartListItemRemoveArgs, None, smart_list_item_remove
                        ),
                        JupiterApiResource.build(
                            "remove",
                            JupiterApiGatewayMethod.delete(
                                SmartListItemRemoveArgs, None, smart_list_item_remove
                            ),
                        ),
                    ),
                ),
            ),
        ),
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
