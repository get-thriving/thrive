"""The jupiter Web RPC API."""

import asyncio
import sys

import aiohttp
import jupiter.core
import jupiter.webapi.config
import jupiter.webapi.exceptions
from jupiter.core.application.crm import CRM
from jupiter.core.application.impl.crm.noop import NoOpCRM
from jupiter.core.application.impl.crm.wix import WixCRM
from jupiter.core.config import JupiterPorts, build_global_properties
from jupiter.core.env import Env
from jupiter.core.search.impl.storage_engine import (
    SqliteSearchStorageEngine,
)
from jupiter.framework.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework.mutation_inovcation.recorders.impl.sqlite import (
    SqliteMutationInvocationStorageEngine,
)
from jupiter.framework.mutation_inovcation.recorders.persistent import (
    PersistentMutationInvocationRecorder,
)
from jupiter.framework.progress_reporter.reporters.websocket import (
    WebsocketProgressReporterFactory,
)
from jupiter.framework.realm.standard import ModuleExplorerRealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection
from jupiter.framework.storage.sqlite.storage_engine import (
    SqliteDomainStorageEngine,
)
from jupiter.framework.telemetry.local.local import LocalTelemetry
from jupiter.framework.telemetry.sentry.sentry import SentryTelemetry
from jupiter.framework.telemetry.telemetry import Telemetry
from jupiter.framework.time_provider import (
    CronRunTimeProvider,
    PerRequestTimeProvider,
)
from jupiter.webapi.config import JupiterWebApiAppForm, build_web_api_properties
from rich import print as rich_print


async def main() -> None:
    """Application main function."""
    global_properties = build_global_properties()
    service_properties = build_web_api_properties()

    telemetry: Telemetry

    if (
        global_properties.env.is_live
        and global_properties.universe.hosting.is_hosted_global
    ):
        telemetry = SentryTelemetry(service_properties.sentry_dsn)
    else:
        telemetry = LocalTelemetry()

    telemetry.prepare()

    request_time_provider = PerRequestTimeProvider()
    cron_run_time_provider = CronRunTimeProvider()

    realm_codec_registry = ModuleExplorerRealmCodecRegistry.build_from_module_root(
        jupiter.core
    )

    sqlite_connection = SqliteConnection(
        SqliteConnection.Config(
            service_properties.sqlite_db_url,
            service_properties.alembic_ini_path,
            service_properties.alembic_migrations_path,
        ),
    )

    aio_session = aiohttp.ClientSession()

    domain_storage_engine = SqliteDomainStorageEngine.build_from_module_root(
        realm_codec_registry, sqlite_connection, jupiter.core
    )
    search_storage_engine = SqliteSearchStorageEngine(
        realm_codec_registry, sqlite_connection
    )
    mutation_invocation_storage_engine = SqliteMutationInvocationStorageEngine(
        realm_codec_registry, sqlite_connection
    )

    crm: CRM
    if (
        global_properties.env == Env.PRODUCTION
        and global_properties.universe.hosting.is_hosted_global
    ):
        crm = WixCRM(
            api_key=service_properties.wix_api_key,
            account_id=service_properties.wix_account_id,
            site_id=service_properties.wix_site_id,
            session=aio_session,
        )
    else:
        crm = NoOpCRM()

    auth_token_stamper = AuthTokenStamper(
        auth_token_secret=service_properties.auth_token_secret,
        time_provider=request_time_provider,
    )

    progress_reporter_factory = WebsocketProgressReporterFactory()

    invocation_recorder = PersistentMutationInvocationRecorder(
        storage_engine=mutation_invocation_storage_engine,
    )

    ports = JupiterPorts(
        domain_storage_engine=domain_storage_engine,
        search_storage_engine=search_storage_engine,
        crm=crm,
    )

    web_app_form = JupiterWebApiAppForm.build_from_module_root(
        ports,
        global_properties,
        service_properties,
        request_time_provider,
        cron_run_time_provider,
        realm_codec_registry,
        invocation_recorder,
        progress_reporter_factory,
        auth_token_stamper,
        jupiter.webapi.config,
        jupiter.core,
        jupiter.webapi.exceptions,
    )

    await sqlite_connection.prepare()
    # await domain_storage_engine.initialize()
    # await search_storage_engine.initialize()
    # await usecase_storage_engine.initialize()

    rich_print("=" * 80)
    rich_print("Starting Jupiter WebAPI:")
    rich_print(f"  Version: {global_properties.version}")
    rich_print(f"  Universe: {global_properties.universe}")
    rich_print(f"  Environment: {global_properties.env}")
    rich_print(f"  Instance: {global_properties.instance}")
    rich_print(f"  Hosting: {global_properties.universe.hosting}")
    rich_print("=" * 80)

    try:
        await web_app_form.run(sys.argv)
    finally:
        try:
            await sqlite_connection.dispose()
        finally:
            pass
        try:
            await aio_session.close()
        finally:
            pass
        try:
            await progress_reporter_factory.unregister_all_websockets()
        finally:
            pass


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
