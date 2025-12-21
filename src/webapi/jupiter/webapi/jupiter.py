"""The jupiter Web RPC API."""

import asyncio
import logging
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
from jupiter.core.hosting import Hosting
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
from jupiter.framework.time_provider import (
    CronRunTimeProvider,
    PerRequestTimeProvider,
)
from jupiter.webapi.config import JupiterWebApiAppForm
from rich import print as rich_print
from rich.console import Console
from rich.logging import RichHandler


async def main() -> None:
    """Application main function."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        handlers=[
            RichHandler(
                console=Console(width=128),
                show_path=False,
                omit_repeated_times=False,
                rich_tracebacks=True,
                markup=True,
                enable_link_path=False,
                log_time_format="%Y-%m-%d %H:%M:%S",
            )
        ],
    )

    request_time_provider = PerRequestTimeProvider()
    cron_run_time_provider = CronRunTimeProvider()

    no_timezone_global_properties = build_global_properties()

    realm_codec_registry = ModuleExplorerRealmCodecRegistry.build_from_module_root(
        jupiter.core
    )

    sqlite_connection = SqliteConnection(
        SqliteConnection.Config(
            no_timezone_global_properties.sqlite_db_url,
            no_timezone_global_properties.alembic_ini_path,
            no_timezone_global_properties.alembic_migrations_path,
        ),
    )

    aio_session = aiohttp.ClientSession()

    global_properties = build_global_properties()

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
        and global_properties.hosting == Hosting.HOSTED_GLOBAL
    ):
        crm = WixCRM(
            api_key=global_properties.wix_api_key,
            account_id=global_properties.wix_account_id,
            site_id=global_properties.wix_site_id,
            session=aio_session,
        )
    else:
        crm = NoOpCRM()

    auth_token_stamper = AuthTokenStamper(
        auth_token_secret=global_properties.auth_token_secret,
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
    rich_print(f"  Environment: {global_properties.env}")
    rich_print(f"  Hosting: {global_properties.hosting}")
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
