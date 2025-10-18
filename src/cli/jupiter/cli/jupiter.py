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
    JupiterComponentProperties,
    JupiterGuestSession,
    JupiterPorts,
    build_global_properties,
)
from jupiter.core.domain.app import (
    AppCore,
    AppDistribution,
    AppPlatform,
    AppShell,
)
from jupiter.core.impl.crm.noop import NoOpCRM
from jupiter.core.impl.repository.sqlite.application.search_storage_engine import (
    SqliteSearchStorageEngine,
)
from jupiter.core.use_cases.load_top_level_info import (
    LoadTopLevelInfoArgs,
    LoadTopLevelInfoUseCase,
)
from jupiter.framework_new.app.cli.progress_reporter import (
    RichConsoleProgressReporterFactory,
)
from jupiter.framework_new.app.cli.session_storage import SessionStorage
from jupiter.framework_new.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework_new.impl.realms import ModuleExplorerRealmCodecRegistry
from jupiter.framework_new.impl.storage.sqlite.connection import SqliteConnection
from jupiter.framework_new.impl.storage.sqlite.storage_engine import (
    SqliteDomainStorageEngine,
)
from jupiter.framework_new.impl.use_case.storage_engine import (
    SqliteUseCaseStorageEngine,
)
from jupiter.framework_new.persistent_mutation_use_case_recoder import (
    PersistentMutationUseCaseInvocationRecorder,
)
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
    usecase_storage_engine = SqliteUseCaseStorageEngine(
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

    invocation_recorder = PersistentMutationUseCaseInvocationRecorder(
        usecase_storage_engine,
    )

    ports = JupiterPorts(
        domain_storage_engine=domain_storage_engine,
        search_storage_engine=search_storage_engine,
        crm=crm,
    )

    console = Console()

    progress_reporter_factory = RichConsoleProgressReporterFactory(console)

    load_top_level_info_use_case = LoadTopLevelInfoUseCase(
        global_properties=global_properties,
        time_provider=time_provider,
        realm_codec_registry=realm_codec_registry,
        auth_token_stamper=auth_token_stamper,
        ports=ports,
    )

    await sqlite_connection.prepare()
    await domain_storage_engine.initialize()
    await search_storage_engine.initialize()
    await usecase_storage_engine.initialize()

    session_info = session_storage.load_optional()
    guest_session = JupiterGuestSession(
        component_properties=JupiterComponentProperties.for_app(
            core=AppCore.CLI,
            the_shell=AppShell.CLI,
            platform=AppPlatform.DESKTOP_MACOS,
            distribution=AppDistribution.MAC_WEB,
            version=global_properties.version,
        ),
        auth_token_ext=session_info.auth_token_ext if session_info else None,
    )
    _, top_level_info = await load_top_level_info_use_case.execute(
        guest_session, LoadTopLevelInfoArgs()
    )

    cli_app = JupiterCliApp.build_from_module_root(
        ports,
        global_properties,
        time_provider,
        realm_codec_registry,
        invocation_recorder,
        progress_reporter_factory,
        auth_token_stamper,
        usecase_storage_engine,
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
