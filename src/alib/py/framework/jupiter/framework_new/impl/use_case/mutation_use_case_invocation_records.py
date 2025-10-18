"""SQlite based repository for the invocation record of mutation use cases."""

from typing import Final

from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.impl.storage.sqlite.repository import SqliteRepository
from jupiter.framework_new.mutation_invocation_result import (
    MutationUseCaseInvocationRecord,
)
from jupiter.framework_new.mutation_use_case_invocation_record_repository import (
    MutationUseCaseInvocationRecordRepository,
)
from jupiter.framework_new.realm import RealmCodecRegistry
from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    MetaData,
    String,
    Table,
    delete,
    insert,
)
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteMutationUseCaseInvocationRecordRepository(
    SqliteRepository,
    MutationUseCaseInvocationRecordRepository,
):
    """A SQlite repository for mutation use cases invocation records."""

    _mutation_use_case_invocation_record_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._mutation_use_case_invocation_record_table = Table(
            "use_case_mutation_use_case_invocation_record",
            metadata,
            Column("context_str", String, primary_key=True),
            Column("timestamp", DateTime, primary_key=True),
            Column("name", String, primary_key=True),
            Column("args", JSON, nullable=False),
            Column("result", String, nullable=False),
            Column("error_str", String, nullable=True),
            keep_existing=True,
        )

    async def create(
        self,
        invocation_record: MutationUseCaseInvocationRecord,
    ) -> None:
        """Create a new invocation record."""
        await self._connection.execute(
            insert(self._mutation_use_case_invocation_record_table).values(
                context_str=invocation_record.context_str,
                timestamp=self._realm_codec_registry.db_encode(
                    invocation_record.timestamp
                ),
                name=invocation_record.name,
                args=invocation_record.args,
                result=str(invocation_record.result.value),
                error_str=invocation_record.error_str,
            ),
        )

    async def clear_all(self, workspace_ref_id: EntityId) -> None:
        """Clear all entries in the invocation record."""
        await self._connection.execute(
            delete(self._mutation_use_case_invocation_record_table).where(
                self._mutation_use_case_invocation_record_table.c.workspace_ref_id
                == workspace_ref_id.as_int()
            ),
        )
