"""The Jupiter external API."""

import asyncio
from typing import cast

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
import httpx
from jupiter_webapi_client.models import APIKeyExchangeResult, ErrorResponse, MetricFindResult
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
from jupiter_webapi_client import AuthenticatedClient, errors
from jupiter_webapi_client.api.api_key.a_pi_key_exchange import (
    asyncio_detailed as api_key_exchange,
)
from jupiter_webapi_client.api.metrics.metric_find import (
    asyncio_detailed as metric_find,
)
from jupiter_webapi_client.models.api_key_exchange_args import APIKeyExchangeArgs
from jupiter_webapi_client.models.metric_find_args import MetricFindArgs
from rich import print as rich_print


class MetricsRestMethod(JupiterApiMethod):
    """A REST method for the metrics resource."""

    async def execute(self, request: Request) -> Response:
        """Execute the method."""
        def extract_bearer_token(auth_header: str | None) -> str | None:
            """Extract bearer token from Authorization header, or None if invalid."""
            if not auth_header:
                return None
            if not auth_header.lower().startswith("bearer "):
                return None
            token = auth_header[7:].strip()
            return token if token else None

        def parse_metric_find_args(params: dict) -> MetricFindArgs | None:
            """Parse query params into MetricFindArgs, or None on error."""
            try:
                return MetricFindArgs.from_dict(params)
            except Exception:
                return None

        auth_header = request.headers.get("authorization")
        api_key = extract_bearer_token(auth_header)
        if api_key is None:
            return Response(status_code=status.HTTP_401_UNAUTHORIZED, content="Missing or invalid Authorization header")

        client = self._ports.webapi_client.client

        try:
            resp = await api_key_exchange(
                client=client, body=APIKeyExchangeArgs(api_key_external=api_key)
            )
        except errors.UnexpectedStatus as e:
            rich_print(f"Unexpected status: {e}")
            return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content="Unexpected status")
        except httpx.TimeoutException as e:
            rich_print(f"HTTP status error: {e}")
            return Response(status_code=status.HTTP_504_GATEWAY_TIMEOUT, content="Timeout")
        except Exception as e:
            rich_print(f"Exception: {e}")
            return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content="Unknown error")

        if not resp.status_code.is_success:
            error_resp = cast(ErrorResponse, resp.parsed)
            return Response(status_code=status.HTTP_401_UNAUTHORIZED, content=error_resp.reason)

        true_resp = cast(APIKeyExchangeResult, resp.parsed)

        query_params = dict(request.query_params)
        args = parse_metric_find_args(query_params)
        if args is None:
            return Response(status_code=status.HTTP_400_BAD_REQUEST, content="Invalid query parameters")

        auth_client = AuthenticatedClient(
            base_url=client._base_url,
            raise_on_unexpected_status=True,
            token=true_resp.auth_token_ext,
        )

        try:
            response = await metric_find(client=auth_client, body=args)
        except errors.UnexpectedStatus as e:
            rich_print(f"Unexpected status: {e}")
            return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content="Unexpected status")
        except httpx.TimeoutException as e:
            rich_print(f"HTTP status error: {e}")
            return Response(status_code=status.HTTP_504_GATEWAY_TIMEOUT, content="Timeout")
        except Exception as e:
            rich_print(f"Exception: {e}")
            return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content="Unknown error")

        if not response.status_code.is_success:
            error_resp = cast(ErrorResponse, response.parsed)
            return Response(status_code=response.status_code, content=error_resp.reason)

        true_response = cast(MetricFindResult, response.parsed)

        return JSONResponse(content=true_response.to_dict())


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
