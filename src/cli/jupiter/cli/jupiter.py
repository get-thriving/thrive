"""The CLI entry-point for jupiter."""

import asyncio
import sys

import jupiter.cli.command
import jupiter.cli.config
import jupiter.core.domain
import jupiter.core.impl.repository.sqlite
import jupiter.core.use_cases
from jupiter.cli.config import JupiterCliApp
from jupiter.core.config import (
    JupiterPorts,
    build_global_properties,
)
from jupiter.core.impl.crm.noop import NoOpCRM
from jupiter.core.impl.repository.sqlite.application.search_storage_engine import (
    SqliteSearchStorageEngine,
)
from jupiter.framework_new.app.cli.progress_reporter import (
    RichConsoleProgressReporterFactory,
)
from jupiter.framework_new.app.cli.session_storage import SessionStorage
from jupiter.framework_new.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework_new.impl.storage.sqlite.connection import SqliteConnection
from jupiter.framework_new.impl.storage.sqlite.storage_engine import (
    SqliteDomainStorageEngine,
)
from jupiter.framework_new.mutation_inovcation.recorders.impl.sqlite import (
    SqliteMutationInvocationStorageEngine,
)
from jupiter.framework_new.mutation_inovcation.recorders.persistent import (
    PersistentMutationInvocationRecorder,
)
from jupiter.framework_new.realm.standard import ModuleExplorerRealmCodecRegistry
from jupiter.framework_new.time_provider import TimeProvider
from rich.console import Console

# import coverage


async def main() -> None:
    """Application main function."""
    # logging.disable()

    time_provider = TimeProvider()

    global_properties = build_global_properties()

    realm_codec_registry = ModuleExplorerRealmCodecRegistry.build_from_module_root(
        jupiter.core.domain, jupiter.core.use_cases
    )

    sqlite_connection = SqliteConnection(
        SqliteConnection.Config(
            global_properties.sqlite_db_url,
            global_properties.alembic_ini_path,
            global_properties.alembic_migrations_path,
        ),
    )

    domain_storage_engine = SqliteDomainStorageEngine.build_from_module_root(
        realm_codec_registry,
        sqlite_connection,
        jupiter.core.impl.repository.sqlite,
        jupiter.core.domain,
    )
    search_storage_engine = SqliteSearchStorageEngine(
        realm_codec_registry, sqlite_connection
    )
    mutation_invocation_storage_engine = SqliteMutationInvocationStorageEngine(
        realm_codec_registry, sqlite_connection
    )

    crm = NoOpCRM()

    session_storage = SessionStorage(
        global_properties.session_info_path, realm_codec_registry
    )

    auth_token_stamper = AuthTokenStamper(
        auth_token_secret=global_properties.auth_token_secret,
        time_provider=time_provider,
    )

    ports = JupiterPorts(
        domain_storage_engine=domain_storage_engine,
        search_storage_engine=search_storage_engine,
        crm=crm,
    )

    console = Console()

    progress_reporter_factory = RichConsoleProgressReporterFactory(console)

    invocation_recorder = PersistentMutationInvocationRecorder(
        mutation_invocation_storage_engine,
    )

    await sqlite_connection.prepare()
    await domain_storage_engine.initialize()
    await search_storage_engine.initialize()
    await mutation_invocation_storage_engine.initialize()

    cli_app = JupiterCliApp.build_from_module_root(
        ports,
        global_properties,
        time_provider,
        realm_codec_registry,
        invocation_recorder,
        progress_reporter_factory,
        auth_token_stamper,
        console,
        session_storage,
        jupiter.cli.config,
        jupiter.core.use_cases,
        jupiter.cli.command,
    )

    try:
        await cli_app.run(sys.argv)
    finally:
        await sqlite_connection.dispose()


if __name__ == "__main__":
    asyncio.run(main())
