"""PostgreSQL variant — see `repository.py` for SQLite."""


from typing import cast

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
    TimeEventFullDaysBlockRepository,
    TimeEventFullDaysBlockStats,
    TimeEventFullDaysBlockStatsPerGroup,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
    TimeEventInDayBlockRepository,
    TimeEventInDayBlockStats,
    TimeEventInDayBlockStatsPerGroup,
)
from jupiter.framework.base.adate import ADate, ADateDatabaseDecoder
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import EntityNotFoundError
from jupiter.framework.storage.postgres.repository import (
    PostgresLeafEntityRepository,
)
from sqlalchemy import func, select
from sqlalchemy.sql import and_, or_

_ADATE_DECODER = ADateDatabaseDecoder()


class PostgresTimeEventInDayBlockRepository(
    PostgresLeafEntityRepository[TimeEventInDayBlock], TimeEventInDayBlockRepository
):
    """A repository of time events in day blocks."""

    async def load_for_owner(
        self,
        owner: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> TimeEventInDayBlock:
        """Retrieve a time event in day block via its owner link."""
        encoded_owner = self._realm_codec_registry.db_encode(owner)
        query_stmt = select(self._table).where(self._table.c.owner == encoded_owner)
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
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise EntityNotFoundError(
                f"Time event in day block with owner {owner!s} does not exist"
            )
        return self._row_to_entity(result)

    async def find_all_between(
        self, parent_ref_id: EntityId, start_date: ADate, end_date: ADate
    ) -> list[TimeEventInDayBlock]:
        """Find all time events in day blocks between two dates."""
        query_stmt = (
            select(self._table)
            .where(self._table.c.archived.is_(False))
            .where(self._table.c.time_event_domain_ref_id == parent_ref_id.as_int())
            .where(self._table.c.start_date >= start_date.the_date)
            .where(self._table.c.start_date <= end_date.the_date)
        )
        result = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in result]

    async def stats_for_all_between(
        self, parent_ref_id: EntityId, start_date: ADate, end_date: ADate
    ) -> TimeEventInDayBlockStats:
        """Calculate stats for all time events in day blocks between two dates."""
        query_stmt = (
            select(
                self._table.c.start_date,
                self._table.c.owner,
                func.count().label("count"),
            )
            .group_by(self._table.c.start_date, self._table.c.owner)
            .where(self._table.c.archived.is_(False))
            .where(self._table.c.time_event_domain_ref_id == parent_ref_id.as_int())
            .where(self._table.c.start_date >= start_date.the_date)
            .where(self._table.c.start_date <= end_date.the_date)
        )

        result = await self._connection.execute(query_stmt)
        per_groups = []
        for row in result:
            owner = self._realm_codec_registry.db_decode(EntityLink, row.owner)
            per_groups.append(
                TimeEventInDayBlockStatsPerGroup(
                    date=_ADATE_DECODER.decode(row.start_date),
                    entity_tag=owner.the_type,
                    cnt=cast(int, row.count),
                )
            )
        return TimeEventInDayBlockStats(per_groups=per_groups)


class PostgresTimeEventFullDaysBlockRepository(
    PostgresLeafEntityRepository[TimeEventFullDaysBlock], TimeEventFullDaysBlockRepository
):
    """A repository of time events in full day blocks."""

    async def load_for_owner(
        self,
        owner: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> TimeEventFullDaysBlock:
        """Retrieve a time event in full day block via its owner link."""
        encoded_owner = self._realm_codec_registry.db_encode(owner)
        query_stmt = select(self._table).where(self._table.c.owner == encoded_owner)
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
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise EntityNotFoundError(
                f"Time event in full day block with owner {owner!s} does not exist"
            )
        return self._row_to_entity(result)

    async def find_for_owner(
        self,
        owner: EntityLink | list[EntityLink],
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> list[TimeEventFullDaysBlock]:
        """Retrieve time events in full day blocks for the given owner link(s)."""
        owners = owner if isinstance(owner, list) else [owner]
        encoded = [self._realm_codec_registry.db_encode(o) for o in owners]
        query_stmt = select(self._table).where(self._table.c.owner.in_(encoded))
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
        result = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in result]

    async def find_all_between(
        self, parent_ref_id: EntityId, start_date: ADate, end_date: ADate
    ) -> list[TimeEventFullDaysBlock]:
        """Find all time events in full day blocks between two dates."""
        query_stmt = (
            select(self._table)
            .where(self._table.c.archived.is_(False))
            .where(self._table.c.time_event_domain_ref_id == parent_ref_id.as_int())
            .where(
                or_(
                    # Start date is in range
                    and_(
                        self._table.c.start_date >= start_date.the_date,
                        self._table.c.start_date <= end_date.the_date,
                    ),
                    # End date is in range
                    and_(
                        self._table.c.end_date >= start_date.the_date,
                        self._table.c.end_date <= end_date.the_date,
                    ),
                    # Start and end date span the range
                    and_(
                        self._table.c.start_date <= start_date.the_date,
                        self._table.c.end_date >= end_date.the_date,
                    ),
                )
            )
        )
        result = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in result]

    async def stats_for_all_between(
        self, parent_ref_id: EntityId, start_date: ADate, end_date: ADate
    ) -> TimeEventFullDaysBlockStats:
        """Calculate stats for all time events in full day blocks in a date range."""
        query_stmt = (
            select(
                self._table.c.start_date,
                self._table.c.owner,
                func.count().label("count"),
            )
            .group_by(self._table.c.start_date, self._table.c.owner)
            .where(self._table.c.archived.is_(False))
            .where(self._table.c.time_event_domain_ref_id == parent_ref_id.as_int())
            .where(
                or_(
                    and_(
                        self._table.c.start_date >= start_date.the_date,
                        self._table.c.start_date <= end_date.the_date,
                    ),
                    and_(
                        self._table.c.end_date >= start_date.the_date,
                        self._table.c.end_date <= end_date.the_date,
                    ),
                    and_(
                        self._table.c.start_date <= start_date.the_date,
                        self._table.c.end_date >= end_date.the_date,
                    ),
                )
            )
        )

        result = await self._connection.execute(query_stmt)
        per_groups = []
        for row in result:
            owner = self._realm_codec_registry.db_decode(EntityLink, row.owner)
            per_groups.append(
                TimeEventFullDaysBlockStatsPerGroup(
                    date=_ADATE_DECODER.decode(row.start_date),
                    entity_tag=owner.the_type,
                    cnt=cast(int, row.count),
                )
            )
        return TimeEventFullDaysBlockStats(per_groups=per_groups)
