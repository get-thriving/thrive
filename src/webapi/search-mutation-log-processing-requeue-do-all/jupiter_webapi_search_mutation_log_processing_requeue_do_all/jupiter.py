"""The GC do-all WebAPI cron."""

import asyncio
import sys

import aiohttp
import jupiter.core
from jupiter.core.application.crm import CRM
from jupiter.core.application.impl.crm.noop import NoOpCRM
from jupiter.core.application.impl.crm.wix import WixCRM
from jupiter.core.backend_blend import (
    JupiterWebApiCrmBackend,
    JupiterWebApiSearchBackend,
    JupiterWebApiStorageEngine,
    JupiterWebApiTelemetry,
)
from jupiter.core.config import JupiterPorts, build_global_properties
from jupiter.core.search.impl.algolia.storage_engine import (
    AlgoliaSearchStorageEngine,
    AlgoliaSearchStorageEngineConfig,
)
from jupiter.core.search.impl.postgres.indexing_storage_engine import (
    PostgresSearchIndexingStorageEngine,
)
from jupiter.core.search.impl.postgres.storage_engine import PostgresSearchStorageEngine
from jupiter.core.search.impl.sqlite.indexing_storage_engine import (
    SqliteSearchIndexingStorageEngine,
)
from jupiter.core.search.impl.sqlite.storage_engine import SqliteSearchStorageEngine
from jupiter.core.search.indexing_storage_engine import SearchIndexingStorageEngine
from jupiter.core.search.storage_engine import SearchStorageEngine
from jupiter.core.search.use_case.search_mutation_log_processing_requeue_do_all import (
    SearchMutationLogProcessingRequeueDoAllUseCase,
)
from jupiter.framework.concepts.standard import ModuleExplorerConceptRegistry
from jupiter.framework.mutation_inovcation.recorders.impl.postgres import (
    PostgresMutationInvocationStorageEngine,
)
from jupiter.framework.mutation_inovcation.recorders.impl.sqlite import (
    SqliteMutationInvocationStorageEngine,
)
from jupiter.framework.mutation_inovcation.recorders.persistent import (
    MutationInvocationStorageEngine,
    PersistentMutationInvocationRecorder,
)
from jupiter.framework.realm.standard import ModuleExplorerRealmCodecRegistry
from jupiter.framework.storage.postgres.connection import PostgresConnection
from jupiter.framework.storage.postgres.storage_engine import (
    PostgresDomainStorageEngine,
)
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.storage.sqlite.connection import SqliteConnection
from jupiter.framework.storage.sqlite.storage_engine import (
    SqliteDomainStorageEngine,
)
from jupiter.framework.telemetry.local.local import LocalTelemetry
from jupiter.framework.telemetry.sentry.sentry import SentryTelemetry
from jupiter.framework.telemetry.telemetry import Telemetry
from jupiter.framework.time_provider import CronRunTimeProvider
from rich import print as rich_print

import jupiter_webapi_search_mutation_log_processing_requeue_do_all.config
import jupiter_webapi_search_mutation_log_processing_requeue_do_all.exceptions
from jupiter_webapi_search_mutation_log_processing_requeue_do_all.config import (
    JupiterExceptionHandler,
    JupiterWebApiCronForm,
    build_web_api_properties,
)


async def main() -> None:
    """Application main function."""
    global_properties = build_global_properties()
    service_properties = build_web_api_properties()

    realm_codec_registry = ModuleExplorerRealmCodecRegistry.build_from_module_root(
        jupiter.core
    )
    concept_registry = ModuleExplorerConceptRegistry.build_from_module_root(
        jupiter.core
    )
    cron_run_time_provider = CronRunTimeProvider()

    aio_session = aiohttp.ClientSession()

    sqlite_connection = SqliteConnection(
        SqliteConnection.Config(
            service_properties.sqlite_db_url,
            service_properties.alembic_ini_path,
            service_properties.alembic_migrations_path,
        ),
    )

    postgres_connection = PostgresConnection(
        PostgresConnection.Config(
            service_properties.postgres_db_url,
            service_properties.alembic_ini_path,
            service_properties.alembic_migrations_path,
        ),
    )

    telemetry: Telemetry
    if service_properties.telemetry == JupiterWebApiTelemetry.SENTRY:
        telemetry = SentryTelemetry(service_properties.sentry_dsn)
    else:
        telemetry = LocalTelemetry()

    telemetry.prepare()

    mutation_invocation_storage_engine: MutationInvocationStorageEngine
    if service_properties.storage_engine == JupiterWebApiStorageEngine.SQLITE:
        mutation_invocation_storage_engine = SqliteMutationInvocationStorageEngine(
            realm_codec_registry, sqlite_connection
        )
    else:
        mutation_invocation_storage_engine = PostgresMutationInvocationStorageEngine(
            realm_codec_registry, postgres_connection
        )

    invocation_recorder = PersistentMutationInvocationRecorder(
        storage_engine=mutation_invocation_storage_engine,
    )

    domain_storage_engine: DomainStorageEngine
    if service_properties.storage_engine == JupiterWebApiStorageEngine.SQLITE:
        domain_storage_engine = SqliteDomainStorageEngine.build_from_module_root(
            realm_codec_registry, sqlite_connection, jupiter.core
        )
    else:
        domain_storage_engine = PostgresDomainStorageEngine.build_from_module_root(
            realm_codec_registry, postgres_connection, jupiter.core
        )

    search_storage_engine: SearchStorageEngine
    if service_properties.search_backend == JupiterWebApiSearchBackend.ALGOLIA:
        search_storage_engine = AlgoliaSearchStorageEngine(
            realm_codec_registry,
            AlgoliaSearchStorageEngineConfig(
                app_id=service_properties.algolia_app_id,
                write_api_key=service_properties.algolia_write_api_key,
                universe=global_properties.universe,
                env=global_properties.env,
                instance=global_properties.instance,
            ),
        )
    elif service_properties.storage_engine == JupiterWebApiStorageEngine.SQLITE:
        search_storage_engine = SqliteSearchStorageEngine(
            realm_codec_registry, sqlite_connection
        )
    else:
        search_storage_engine = PostgresSearchStorageEngine(
            realm_codec_registry, postgres_connection
        )

    search_indexing_storage_engine: SearchIndexingStorageEngine
    if service_properties.storage_engine == JupiterWebApiStorageEngine.SQLITE:
        search_indexing_storage_engine = SqliteSearchIndexingStorageEngine(
            realm_codec_registry, sqlite_connection
        )
    else:
        search_indexing_storage_engine = PostgresSearchIndexingStorageEngine(
            realm_codec_registry, postgres_connection
        )

    crm: CRM
    if service_properties.crm_backend == JupiterWebApiCrmBackend.WIX:
        crm = WixCRM(
            api_key=service_properties.wix_api_key,
            account_id=service_properties.wix_account_id,
            site_id=service_properties.wix_site_id,
            session=aio_session,
        )
    else:
        crm = NoOpCRM()

    ports = JupiterPorts(
        domain_storage_engine=domain_storage_engine,
        search_storage_engine=search_storage_engine,
        search_indexing_storage_engine=search_indexing_storage_engine,
        crm=crm,
    )

    cron_app_form = JupiterWebApiCronForm.build_from_module_root(
        ports,
        global_properties,
        service_properties,
        cron_run_time_provider,
        realm_codec_registry,
        concept_registry,
        invocation_recorder,
        SearchMutationLogProcessingRequeueDoAllUseCase,
        JupiterExceptionHandler,
        service_properties.execution_mode,
        jupiter_webapi_search_mutation_log_processing_requeue_do_all.exceptions,
    )

    if service_properties.storage_engine == JupiterWebApiStorageEngine.SQLITE:
        await sqlite_connection.prepare()
    else:
        await postgres_connection.prepare()

    rich_print("=" * 80)
    rich_print(
        "Starting Jupiter WebAPI cron (Search mutation log processing requeue do-all):"
    )
    rich_print(f"  Version: {global_properties.version}")
    rich_print(f"  Universe: {global_properties.universe}")
    rich_print(f"  Environment: {global_properties.env}")
    rich_print(f"  Instance: {global_properties.instance}")
    rich_print(f"  Hosting: {global_properties.universe.hosting}")
    rich_print(f"  Execution mode: {service_properties.execution_mode.value}")
    rich_print("-" * 80)
    rich_print("Component Classes:")
    rich_print(f"  Telemetry: {telemetry.__class__.__name__}")
    rich_print(
        "  Mutation Invocation Storage Engine: "
        f"{mutation_invocation_storage_engine.__class__.__name__}"
    )
    rich_print(f"  Invocation Recorder: {invocation_recorder.__class__.__name__}")
    rich_print(f"  Domain Storage Engine: {domain_storage_engine.__class__.__name__}")
    rich_print(f"  Search Storage Engine: {search_storage_engine.__class__.__name__}")
    rich_print(f"  CRM: {crm.__class__.__name__}")
    rich_print("=" * 80)

    try:
        await cron_app_form.run(sys.argv)
    finally:
        if service_properties.storage_engine == JupiterWebApiStorageEngine.SQLITE:
            try:
                await sqlite_connection.dispose()
            finally:
                pass
        elif service_properties.storage_engine == JupiterWebApiStorageEngine.POSTGRES:
            try:
                await postgres_connection.dispose()
            finally:
                pass
        try:
            await aio_session.close()
        finally:
            pass


def sync_main() -> None:
    """Run the main function synchronously."""
    asyncio.run(main())


if __name__ == "__main__":
    sync_main()
