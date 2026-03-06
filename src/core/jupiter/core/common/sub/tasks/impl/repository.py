"""Sqlite implementation of the tasks repository."""

from typing import cast

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.status import TaskStatus
from jupiter.core.common.sub.tasks.root import (
    Task,
    TaskRepository,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import EntityNotFoundError
from jupiter.framework.storage.sqlite.repository import (
    SqliteLeafEntityRepository,
)
from sqlalchemy import (
    func,
    select,
)


class SqliteTaskRepository(SqliteLeafEntityRepository[Task], TaskRepository):
    """A repository of tasks."""

    def _apply_allow_archived(
        self,
        query_stmt: object,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
    ) -> object:
        """Apply the archival filter to a query."""
        if isinstance(allow_archived, bool):
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        elif isinstance(allow_archived, JupiterArchivalReason):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (self._table.c.archival_reason == str(allow_archived.value))
            )
        elif isinstance(allow_archived, list):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (
                    self._table.c.archival_reason.in_(
                        [str(reason.value) for reason in allow_archived]
                    )
                )
            )
        return query_stmt

    async def load_for_source(
        self,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> Task:
        """Retrieve a task via its source entity."""
        query_stmt = (
            select(self._table)
            .where(self._table.c.namespace == namespace.value)
            .where(self._table.c.source_entity_ref_id == source_entity_ref_id.as_int())
        )
        query_stmt = self._apply_allow_archived(query_stmt, allow_archived)
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise EntityNotFoundError(
                f"Task in namespace {namespace.value} with source {source_entity_ref_id!s} does not exist"
            )
        return self._row_to_entity(result)

    async def load_optional_for_source(
        self,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> Task | None:
        """Retrieve a task via its source entity."""
        query_stmt = (
            select(self._table)
            .where(self._table.c.namespace == namespace.value)
            .where(self._table.c.source_entity_ref_id == source_entity_ref_id.as_int())
        )
        query_stmt = self._apply_allow_archived(query_stmt, allow_archived)
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_entity(result)

    async def count_all_for_source(
        self,
        parent_ref_id: EntityId,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId | list[EntityId],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> int:
        """Count all tasks for a source."""
        source_entity_ref_ids = (
            source_entity_ref_id
            if isinstance(source_entity_ref_id, list)
            else [source_entity_ref_id]
        )
        query_stmt = select(func.count()).where(
            self._table.c.task_domain_ref_id == parent_ref_id.as_int(),
            self._table.c.namespace == namespace.value,
            self._table.c.source_entity_ref_id.in_(
                [ref_id.as_int() for ref_id in source_entity_ref_ids]
            ),
        )
        query_stmt = self._apply_allow_archived(query_stmt, allow_archived)
        results = await self._connection.execute(query_stmt)
        return cast(int, results.scalar_one())

    async def find_all_for_source_created_desc(
        self,
        parent_ref_id: EntityId,
        namespace: TaskNamespace,
        source_entity_ref_id: EntityId | list[EntityId],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        retrieve_offset: int | None = None,
        retrieve_limit: int | None = None,
    ) -> list[Task]:
        """Find all tasks for a source ordered by created time descending."""
        if retrieve_offset is None and retrieve_limit is not None:
            raise Exception("Cannot specify a limit without an offset.")
        if retrieve_offset is not None and retrieve_limit is None:
            raise Exception("Cannot specify an offset without a limit.")
        if retrieve_offset is not None and retrieve_offset < 0:
            raise Exception("Offset must be non-negative.")
        if retrieve_limit is not None and retrieve_limit < 1:
            raise Exception("Limit must be positive.")

        source_entity_ref_ids = (
            source_entity_ref_id
            if isinstance(source_entity_ref_id, list)
            else [source_entity_ref_id]
        )
        query_stmt = select(self._table).where(
            self._table.c.task_domain_ref_id == parent_ref_id.as_int(),
            self._table.c.namespace == namespace.value,
            self._table.c.source_entity_ref_id.in_(
                [ref_id.as_int() for ref_id in source_entity_ref_ids]
            ),
        )
        query_stmt = self._apply_allow_archived(query_stmt, allow_archived)
        if retrieve_offset is not None and retrieve_limit is not None:
            query_stmt = query_stmt.offset(retrieve_offset).limit(retrieve_limit)
        query_stmt = query_stmt.order_by(self._table.c.created_time.desc())
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_completed_in_range(
        self,
        parent_ref_id: EntityId,
        namespace: TaskNamespace,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        filter_start_completed_date: ADate,
        filter_end_completed_date: ADate,
        filter_source_entity_ref_ids: list[EntityId] | None = None,
    ) -> list[Task]:
        """Find completed tasks in a time range for a namespace."""
        start_completed_time = (
            filter_start_completed_date.to_timestamp_at_start_of_day()
        )
        end_completed_time = filter_end_completed_date.to_timestamp_at_end_of_day()

        query_stmt = select(self._table).where(
            self._table.c.task_domain_ref_id == parent_ref_id.as_int(),
            self._table.c.namespace == namespace.value,
            self._table.c.status.in_(
                s.value for s in TaskStatus.all_completed_statuses()
            ),
            self._table.c.completed_time.is_not(None),
            self._table.c.completed_time >= start_completed_time.the_ts,
            self._table.c.completed_time <= end_completed_time.the_ts,
        )
        query_stmt = self._apply_allow_archived(query_stmt, allow_archived)
        if filter_source_entity_ref_ids is not None:
            query_stmt = query_stmt.where(
                self._table.c.source_entity_ref_id.in_(
                    ref_id.as_int() for ref_id in filter_source_entity_ref_ids
                )
            )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]
