"""The PostgreSQL repository for inbox tasks."""

from collections.abc import Iterable
from typing import cast

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.inbox_tasks.parent_link_namespace import (
    parent_link_as_owner_prefix,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NO_FILTER, NoFilter
from jupiter.framework.storage.postgres.repository import (
    PostgresLeafEntityRepository,
)
from sqlalchemy import func, or_, select


class PostgresInboxTaskRepository(
    PostgresLeafEntityRepository[InboxTask], InboxTaskRepository
):
    """The inbox task repository."""

    async def count_all_for_owner(
        self,
        parent_ref_id: EntityId,
        owner: EntityLink | list[EntityLink],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> int:
        """Count all the inbox task for an owner link."""
        owners = owner if isinstance(owner, list) else [owner]
        encoded_owners = [self._realm_codec_registry.db_encode(o) for o in owners]
        query_stmt = select(func.count()).where(
            self._table.c.inbox_task_collection_ref_id == parent_ref_id.as_int(),
            self._table.c.owner.in_(encoded_owners),
        )
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
        results = await self._connection.execute(query_stmt)
        return cast(int, results.scalar_one())

    async def find_all_for_owner_created_desc(
        self,
        parent_ref_id: EntityId,
        owner: EntityLink | list[EntityLink],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        retrieve_offset: int | None = None,
        retrieve_limit: int | None = None,
    ) -> list[InboxTask]:
        """Find all the inbox task for an owner link."""
        if retrieve_offset is None and retrieve_limit is not None:
            raise Exception("Cannot specify a limit without an offset.")
        if retrieve_offset is not None and retrieve_limit is None:
            raise Exception("Cannot specify an offset without a limit.")
        if retrieve_offset is not None and retrieve_offset < 0:
            raise Exception("Offset must be non-negative.")
        if retrieve_limit is not None and retrieve_limit < 1:
            raise Exception("Limit must be positive.")

        owners = owner if isinstance(owner, list) else [owner]
        encoded_owners = [self._realm_codec_registry.db_encode(o) for o in owners]
        query_stmt = select(self._table).where(
            self._table.c.inbox_task_collection_ref_id == parent_ref_id.as_int(),
            self._table.c.owner.in_(encoded_owners),
        )
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
        if retrieve_offset is not None and retrieve_limit is not None:
            query_stmt = query_stmt.offset(retrieve_offset).limit(retrieve_limit)
        query_stmt = query_stmt.order_by(self._table.c.created_time.desc())
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_all_for_parent_link_namespaces(
        self,
        parent_ref_id: EntityId,
        parent_link_namespaces: Iterable[str],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
        filter_status: Iterable[InboxTaskStatus] | NoFilter = NO_FILTER,
    ) -> list[InboxTask]:
        """Find inbox tasks matching any owner prefix ``type:purpose:``."""
        prefixes = [
            parent_link_as_owner_prefix(ns) + "%" for ns in parent_link_namespaces
        ]
        if not prefixes:
            return []
        owner_clause = or_(*[self._table.c.owner.like(p) for p in prefixes])
        query_stmt = select(self._table).where(
            self._table.c.inbox_task_collection_ref_id == parent_ref_id.as_int(),
            owner_clause,
        )
        if filter_ref_ids is not None:
            query_stmt = query_stmt.where(
                self._table.c.ref_id.in_(fi.as_int() for fi in filter_ref_ids),
            )
        if not isinstance(filter_status, NoFilter):
            query_stmt = query_stmt.where(
                self._table.c.status.in_(s.value for s in filter_status),
            )
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
        query_stmt = query_stmt.order_by(self._table.c.created_time.desc())
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_modified_in_range(
        self,
        parent_ref_id: EntityId,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
        filter_parent_link_namespaces: Iterable[str] | None = None,
        filter_last_modified_time_start: ADate | None = None,
        filter_last_modified_time_end: ADate | None = None,
    ) -> list[InboxTask]:
        """Find all the inbox task."""
        query_stmt = select(self._table).where(
            self._table.c.inbox_task_collection_ref_id == parent_ref_id.as_int(),
        )
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
        if filter_ref_ids is not None:
            query_stmt = query_stmt.where(
                self._table.c.ref_id.in_(fi.as_int() for fi in filter_ref_ids),
            )
        if filter_parent_link_namespaces is not None:
            prefixes = [
                parent_link_as_owner_prefix(ns) + "%"
                for ns in filter_parent_link_namespaces
            ]
            if prefixes:
                query_stmt = query_stmt.where(
                    or_(*[self._table.c.owner.like(p) for p in prefixes]),
                )
        if filter_last_modified_time_start is not None:
            query_stmt = query_stmt.where(
                self._table.c.last_modified_time
                >= self._realm_codec_registry.db_encode(
                    filter_last_modified_time_start
                ),
            )
        if filter_last_modified_time_end is not None:
            query_stmt = query_stmt.where(
                self._table.c.last_modified_time
                < self._realm_codec_registry.db_encode(filter_last_modified_time_end),
            )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_completed_in_range(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        filter_start_completed_date: ADate,
        filter_end_completed_date: ADate,
        filter_include_parent_link_namespaces: Iterable[str],
        filter_exclude_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[InboxTask]:
        """Find all completed inbox tasks in a time range."""
        query_stmt = select(self._table).where(
            self._table.c.inbox_task_collection_ref_id == parent_ref_id.as_int(),
        )
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

        start_completed_time = (
            filter_start_completed_date.to_timestamp_at_start_of_day()
        )
        end_completed_time = filter_end_completed_date.to_timestamp_at_end_of_day()

        prefixes = [
            parent_link_as_owner_prefix(ns) + "%"
            for ns in filter_include_parent_link_namespaces
        ]
        query_stmt = (
            query_stmt.where(
                self._table.c.status.in_(
                    s.value for s in InboxTaskStatus.all_completed_statuses()
                )
            )
            .where(or_(*[self._table.c.owner.like(p) for p in prefixes]))
            .where(self._table.c.completed_time.is_not(None))
            .where(self._table.c.completed_time >= start_completed_time.the_ts)
            .where(self._table.c.completed_time <= end_completed_time.the_ts)
        )

        if filter_exclude_ref_ids is not None:
            query_stmt = query_stmt.where(
                self._table.c.ref_id.not_in(
                    fi.as_int() for fi in filter_exclude_ref_ids
                ),
            )

        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]
