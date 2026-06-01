"""The CLI entry-point for jupiter."""

import asyncio
import logging
import sys

import jupiter.cli.command
import jupiter.core
from jupiter.cli.config import JupiterCliAppForm, build_cli_properties
from jupiter.core.backend_blend import JupiterCrmBackend
from jupiter.core.config import (
    JupiterPorts,
    build_global_properties,
)
from jupiter.core.crm.crm import CRM, CrmDeploymentContext
from jupiter.core.crm.impl.noop import NoOpCRM
from jupiter.core.crm.impl.sqlite.indexing_storage_engine import (
    SqliteCRMIndexingStorageEngine,
)
from jupiter.core.crm.impl.wix import WixCRM
from jupiter.core.search.impl.sqlite.indexing_storage_engine import (
    SqliteSearchIndexingStorageEngine,
)
from jupiter.core.search.impl.sqlite.storage_engine import SqliteSearchStorageEngine
from jupiter.framework.appform.cli.session_storage import SessionStorage
from jupiter.framework.auth.auth_token_stamper import AuthTokenStamper
from jupiter.framework.concepts.standard import ModuleExplorerConceptRegistry
from jupiter.framework.mutation_inovcation.recorders.impl.sqlite import (
    SqliteMutationInvocationStorageEngine,
)
from jupiter.framework.mutation_inovcation.recorders.persistent import (
    PersistentMutationInvocationRecorder,
)
from jupiter.framework.progress_reporter.reporters.rich_console import (
    RichConsoleProgressReporterFactory,
)
from jupiter.framework.realm.standard import ModuleExplorerRealmCodecRegistry
from jupiter.framework.storage.sqlite.connection import SqliteConnection
from jupiter.framework.storage.sqlite.storage_engine import (
    SqliteDomainStorageEngine,
)
from jupiter.framework.time_provider import TimeProvider
from rich.console import Console

# import coverage


async def main() -> None:
    """Application main function."""
    logging.disable()

    time_provider = TimeProvider()

    global_properties = build_global_properties()
    cli_properties = build_cli_properties()

    realm_codec_registry = ModuleExplorerRealmCodecRegistry.build_from_module_root(
        jupiter.core
    )

    sqlite_connection = SqliteConnection(
        SqliteConnection.Config(
            cli_properties.sqlite_db_url,
            cli_properties.alembic_ini_path,
            cli_properties.alembic_migrations_path,
        ),
    )

    domain_storage_engine = SqliteDomainStorageEngine.build_from_module_root(
        realm_codec_registry, sqlite_connection, jupiter.core
    )
    search_storage_engine = SqliteSearchStorageEngine(
        realm_codec_registry, sqlite_connection
    )
    search_indexing_storage_engine = SqliteSearchIndexingStorageEngine(
        realm_codec_registry, sqlite_connection
    )
    crm_indexing_storage_engine = SqliteCRMIndexingStorageEngine(
        realm_codec_registry, sqlite_connection
    )
    mutation_invocation_storage_engine = SqliteMutationInvocationStorageEngine(
        realm_codec_registry, sqlite_connection
    )

    concept_registry = ModuleExplorerConceptRegistry.build_from_module_root(
        jupiter.core
    )

    deployment = CrmDeploymentContext(
        universe=global_properties.universe,
        env=global_properties.env,
        instance=global_properties.instance,
    )
    crm: CRM
    if global_properties.crm_backend == JupiterCrmBackend.WIX:
        crm = WixCRM(
            api_key="",
            account_id="",
            site_id="",
            deployment=deployment,
        )
    else:
        crm = NoOpCRM(deployment=deployment)

    session_storage = SessionStorage(
        cli_properties.session_info_path, realm_codec_registry
    )

    auth_token_stamper = AuthTokenStamper(
        auth_token_secret=cli_properties.auth_token_secret,
        time_provider=time_provider,
    )

    ports = JupiterPorts(
        domain_storage_engine=domain_storage_engine,
        search_storage_engine=search_storage_engine,
        search_indexing_storage_engine=search_indexing_storage_engine,
        crm_indexing_storage_engine=crm_indexing_storage_engine,
        crm=crm,
    )

    console = Console()

    progress_reporter_factory = RichConsoleProgressReporterFactory(console)

    invocation_recorder = PersistentMutationInvocationRecorder(
        mutation_invocation_storage_engine,
    )

    await sqlite_connection.prepare()

    cli_app_form = JupiterCliAppForm.build_from_module_root(
        ports,
        global_properties,
        cli_properties,
        time_provider,
        realm_codec_registry,
        concept_registry,
        invocation_recorder,
        progress_reporter_factory,
        auth_token_stamper,
        console,
        session_storage,
        jupiter.cli.config,
        jupiter.core,
        jupiter.cli.command,
    )

    try:
        await cli_app_form.run(sys.argv)
    finally:
        await sqlite_connection.dispose()


if __name__ == "__main__":
    asyncio.run(main())
