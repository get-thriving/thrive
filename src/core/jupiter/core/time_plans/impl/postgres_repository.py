"""The PostgreSQL based time plans repository."""

from typing import Final, Mapping, cast

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.time_plans.life_plan_links import (
    TimePlanAspectLink,
    TimePlanAspectLinkRepository,
    TimePlanChapterLink,
    TimePlanChapterLinkRepository,
    TimePlanGoalLink,
    TimePlanGoalLinkRepository,
)
from jupiter.core.time_plans.root import (
    TimePlan,
    TimePlanExistsForDatePeriodCombinationError,
    TimePlanRepository,
)
from jupiter.core.time_plans.sub.activity.root import (
    TimePlanActivity,
    TimePlanActivityRespository,
    TimePlanAlreadyAssociatedWithTargetError,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmThing
from jupiter.framework.storage.postgres.repository import (
    PostgresLeafEntityRepository,
    PostgresRecordRepository,
)
from jupiter.framework.storage.postgres.row import RowType
from jupiter.framework.storage.repository import (
    RecordAlreadyExistsError,
    RecordNotFoundError,
)
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    Table,
    delete,
    insert,
    select,
    update,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncConnection


class PostgresTimePlanRepository(
    PostgresLeafEntityRepository[TimePlan], TimePlanRepository
):
    """A repository for time plans."""

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(
            realm_codec_registry,
            connection,
            metadata,
            already_exists_err_cls=TimePlanExistsForDatePeriodCombinationError,
        )

    async def find_all_in_range(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        filter_periods: list[RecurringTaskPeriod],
        filter_start_date: ADate,
        filter_end_date: ADate,
    ) -> list[TimePlan]:
        """Find all time plans in a range."""
        if len(filter_periods) == 0:
            return []

        query_stmt = self._table.select().where(
            self._table.c.time_plan_domain_ref_id == parent_ref_id.as_int(),
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

        query_stmt = query_stmt.where(
            self._table.c.period.in_([p.value for p in filter_periods])
        )
        query_stmt = query_stmt.where(
            self._table.c.right_now >= filter_start_date.the_date
        )
        query_stmt = query_stmt.where(
            self._table.c.right_now <= filter_end_date.the_date
        )

        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_higher(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        period: RecurringTaskPeriod,
        right_now: ADate,
    ) -> TimePlan | None:
        """Find the higher time plan to a given right now at a certain period."""
        for higher_period in period.all_higher_periods:
            query_stmt = self._table.select().where(
                self._table.c.time_plan_domain_ref_id == parent_ref_id.as_int(),
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

            higher_schedule = schedules.get_schedule(
                higher_period,
                EntityName("Test"),
                right_now.to_timestamp_at_end_of_day(),
            )

            query_stmt = (
                query_stmt.where(self._table.c.period == higher_period.value)
                .where(self._table.c.timeline == higher_schedule.timeline)
                .order_by(self._table.c.right_now.desc())
                .limit(1)
            )

            result_rows = await self._connection.execute(query_stmt)
            results = [self._row_to_entity(row) for row in result_rows]
            if len(results) == 0:
                continue
            return results[0]

        return None

    async def find_previous(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        period: RecurringTaskPeriod,
        right_now: ADate,
    ) -> TimePlan | None:
        """Find the previous time plan to a given right now at a certain period."""
        query_stmt = self._table.select().where(
            self._table.c.time_plan_domain_ref_id == parent_ref_id.as_int(),
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

        query_stmt = (
            query_stmt.where(self._table.c.period == period.value)
            .where(self._table.c.right_now < right_now.the_date)
            .order_by(self._table.c.right_now.desc())
            .limit(1)
        )

        result_rows = await self._connection.execute(query_stmt)
        results = [self._row_to_entity(row) for row in result_rows]
        if len(results) == 0:
            return None
        return results[0]


class PostgresTimePlanActivityRepository(
    PostgresLeafEntityRepository[TimePlanActivity], TimePlanActivityRespository
):
    """A repository for time plan activities."""

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(
            realm_codec_registry,
            connection,
            metadata,
            already_exists_err_cls=TimePlanAlreadyAssociatedWithTargetError,
        )

    async def find_all_with_target(
        self,
        target: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> list[EntityId]:
        """Find all time plan activities with a target."""
        query_stmt = self._table.select().where(
            self._table.c.target == str(target),
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

        return [self._row_to_entity(row).parent_ref_id for row in results]


class PostgresTimePlanChapterLinkRepository(
    PostgresRecordRepository[TimePlanChapterLink, tuple[EntityId, EntityId]],
    TimePlanChapterLinkRepository,
):
    """A PostgreSQL repository for time plan chapter links."""

    _time_plan_chapter_link_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._time_plan_chapter_link_table = Table(
            "time_plan_chapter_link",
            metadata,
            Column(
                "time_plan_ref_id",
                Integer,
                ForeignKey("time_plan.ref_id"),
                nullable=False,
            ),
            Column(
                "chapter_ref_id",
                Integer,
                ForeignKey("chapter.ref_id"),
                nullable=False,
            ),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            keep_existing=True,
        )

    async def create(self, record: TimePlanChapterLink) -> TimePlanChapterLink:
        """Create a new time plan chapter link."""
        try:
            await self._connection.execute(
                insert(self._time_plan_chapter_link_table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            self._realm_codec_registry.db_encode(record),
                        )
                    )
                )
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                f"Time plan chapter link for time plan {record.time_plan.ref_id} and chapter {record.chapter_ref_id} already exists",
            ) from err
        return record

    async def save(self, record: TimePlanChapterLink) -> TimePlanChapterLink:
        """Save a time plan chapter link."""
        result = await self._connection.execute(
            update(self._time_plan_chapter_link_table)
            .where(
                self._time_plan_chapter_link_table.c.time_plan_ref_id
                == record.time_plan.as_int()
            )
            .where(
                self._time_plan_chapter_link_table.c.chapter_ref_id
                == record.chapter_ref_id.as_int()
            )
            .values(
                **(
                    cast(
                        Mapping[str, RealmThing],
                        self._realm_codec_registry.db_encode(record),
                    )
                )
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Time plan chapter link for time plan {record.time_plan.ref_id} and chapter {record.chapter_ref_id} does not exist",
            )
        return record

    async def remove(self, key: tuple[EntityId, EntityId]) -> None:
        """Remove a time plan chapter link."""
        result = await self._connection.execute(
            delete(self._time_plan_chapter_link_table)
            .where(
                self._time_plan_chapter_link_table.c.time_plan_ref_id == key[0].as_int()
            )
            .where(
                self._time_plan_chapter_link_table.c.chapter_ref_id == key[1].as_int()
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Time plan chapter link for time plan {key[0]} and chapter {key[1]} does not exist",
            )

    async def load_by_key_optional(
        self, key: tuple[EntityId, EntityId]
    ) -> TimePlanChapterLink | None:
        """Load a time plan chapter link by its unique key."""
        result = await self._connection.execute(
            select(self._time_plan_chapter_link_table)
            .where(
                self._time_plan_chapter_link_table.c.time_plan_ref_id == key[0].as_int()
            )
            .where(
                self._time_plan_chapter_link_table.c.chapter_ref_id == key[1].as_int()
            )
        )
        row = result.first()
        if row is None:
            return None
        return self._row_to_entity(row)

    async def find_all(
        self, parent_ref_id: EntityId | list[EntityId]
    ) -> list[TimePlanChapterLink]:
        """Find all time plan chapter links for one or more time plans."""
        parent_ref_ids = (
            [parent_ref_id.as_int()]
            if isinstance(parent_ref_id, EntityId)
            else [p.as_int() for p in parent_ref_id]
        )
        result = await self._connection.execute(
            select(self._time_plan_chapter_link_table).where(
                self._time_plan_chapter_link_table.c.time_plan_ref_id.in_(
                    parent_ref_ids
                )
            )
        )
        results = result.fetchall()
        return [self._row_to_entity(row) for row in results]

    async def remove_all_for_time_plan(self, time_plan_ref_id: EntityId) -> None:
        """Remove all links for a particular time plan."""
        await self._connection.execute(
            delete(self._time_plan_chapter_link_table).where(
                self._time_plan_chapter_link_table.c.time_plan_ref_id
                == time_plan_ref_id.as_int()
            )
        )

    async def remove_all_for_chapter(self, chapter_ref_id: EntityId) -> None:
        """Remove all links for a particular chapter."""
        await self._connection.execute(
            delete(self._time_plan_chapter_link_table).where(
                self._time_plan_chapter_link_table.c.chapter_ref_id
                == chapter_ref_id.as_int()
            )
        )

    def _row_to_entity(self, row: RowType) -> TimePlanChapterLink:
        return self._realm_codec_registry.db_decode(
            TimePlanChapterLink, cast(Mapping[str, RealmThing], row._mapping)
        )


class PostgresTimePlanAspectLinkRepository(
    PostgresRecordRepository[TimePlanAspectLink, tuple[EntityId, EntityId]],
    TimePlanAspectLinkRepository,
):
    """A PostgreSQL repository for time plan aspect links."""

    _time_plan_aspect_link_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._time_plan_aspect_link_table = Table(
            "time_plan_aspect_link",
            metadata,
            Column(
                "time_plan_ref_id",
                Integer,
                ForeignKey("time_plan.ref_id"),
                nullable=False,
            ),
            Column(
                "aspect_ref_id",
                Integer,
                ForeignKey("aspect.ref_id"),
                nullable=False,
            ),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            keep_existing=True,
        )

    async def create(self, record: TimePlanAspectLink) -> TimePlanAspectLink:
        """Create a new time plan aspect link."""
        try:
            await self._connection.execute(
                insert(self._time_plan_aspect_link_table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            self._realm_codec_registry.db_encode(record),
                        )
                    )
                )
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                f"Time plan aspect link for time plan {record.time_plan.ref_id} and aspect {record.aspect_ref_id} already exists",
            ) from err
        return record

    async def save(self, record: TimePlanAspectLink) -> TimePlanAspectLink:
        """Save a time plan aspect link."""
        result = await self._connection.execute(
            update(self._time_plan_aspect_link_table)
            .where(
                self._time_plan_aspect_link_table.c.time_plan_ref_id
                == record.time_plan.as_int()
            )
            .where(
                self._time_plan_aspect_link_table.c.aspect_ref_id
                == record.aspect_ref_id.as_int()
            )
            .values(
                **(
                    cast(
                        Mapping[str, RealmThing],
                        self._realm_codec_registry.db_encode(record),
                    )
                )
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Time plan aspect link for time plan {record.time_plan.ref_id} and aspect {record.aspect_ref_id} does not exist",
            )
        return record

    async def remove(self, key: tuple[EntityId, EntityId]) -> None:
        """Remove a time plan aspect link."""
        result = await self._connection.execute(
            delete(self._time_plan_aspect_link_table)
            .where(
                self._time_plan_aspect_link_table.c.time_plan_ref_id == key[0].as_int()
            )
            .where(self._time_plan_aspect_link_table.c.aspect_ref_id == key[1].as_int())
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Time plan aspect link for time plan {key[0]} and aspect {key[1]} does not exist",
            )

    async def load_by_key_optional(
        self, key: tuple[EntityId, EntityId]
    ) -> TimePlanAspectLink | None:
        """Load a time plan aspect link by its unique key."""
        result = await self._connection.execute(
            select(self._time_plan_aspect_link_table)
            .where(
                self._time_plan_aspect_link_table.c.time_plan_ref_id == key[0].as_int()
            )
            .where(self._time_plan_aspect_link_table.c.aspect_ref_id == key[1].as_int())
        )
        row = result.first()
        if row is None:
            return None
        return self._row_to_entity(row)

    async def find_all(
        self, parent_ref_id: EntityId | list[EntityId]
    ) -> list[TimePlanAspectLink]:
        """Find all time plan aspect links for one or more time plans."""
        parent_ref_ids = (
            [parent_ref_id.as_int()]
            if isinstance(parent_ref_id, EntityId)
            else [p.as_int() for p in parent_ref_id]
        )
        result = await self._connection.execute(
            select(self._time_plan_aspect_link_table).where(
                self._time_plan_aspect_link_table.c.time_plan_ref_id.in_(parent_ref_ids)
            )
        )
        results = result.fetchall()
        return [self._row_to_entity(row) for row in results]

    async def remove_all_for_time_plan(self, time_plan_ref_id: EntityId) -> None:
        """Remove all links for a particular time plan."""
        await self._connection.execute(
            delete(self._time_plan_aspect_link_table).where(
                self._time_plan_aspect_link_table.c.time_plan_ref_id
                == time_plan_ref_id.as_int()
            )
        )

    async def remove_all_for_aspect(self, aspect_ref_id: EntityId) -> None:
        """Remove all links for a particular aspect."""
        await self._connection.execute(
            delete(self._time_plan_aspect_link_table).where(
                self._time_plan_aspect_link_table.c.aspect_ref_id
                == aspect_ref_id.as_int()
            )
        )

    def _row_to_entity(self, row: RowType) -> TimePlanAspectLink:
        return self._realm_codec_registry.db_decode(
            TimePlanAspectLink, cast(Mapping[str, RealmThing], row._mapping)
        )


class PostgresTimePlanGoalLinkRepository(
    PostgresRecordRepository[TimePlanGoalLink, tuple[EntityId, EntityId]],
    TimePlanGoalLinkRepository,
):
    """A PostgreSQL repository for time plan goal links."""

    _time_plan_goal_link_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._time_plan_goal_link_table = Table(
            "time_plan_goal_link",
            metadata,
            Column(
                "time_plan_ref_id",
                Integer,
                ForeignKey("time_plan.ref_id"),
                nullable=False,
            ),
            Column(
                "goal_ref_id",
                Integer,
                ForeignKey("goal.ref_id"),
                nullable=False,
            ),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            keep_existing=True,
        )

    async def create(self, record: TimePlanGoalLink) -> TimePlanGoalLink:
        """Create a new time plan goal link."""
        try:
            await self._connection.execute(
                insert(self._time_plan_goal_link_table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            self._realm_codec_registry.db_encode(record),
                        )
                    )
                )
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                f"Time plan goal link for time plan {record.time_plan.ref_id} and goal {record.goal_ref_id} already exists",
            ) from err
        return record

    async def save(self, record: TimePlanGoalLink) -> TimePlanGoalLink:
        """Save a time plan goal link."""
        result = await self._connection.execute(
            update(self._time_plan_goal_link_table)
            .where(
                self._time_plan_goal_link_table.c.time_plan_ref_id
                == record.time_plan.as_int()
            )
            .where(
                self._time_plan_goal_link_table.c.goal_ref_id
                == record.goal_ref_id.as_int()
            )
            .values(
                **(
                    cast(
                        Mapping[str, RealmThing],
                        self._realm_codec_registry.db_encode(record),
                    )
                )
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Time plan goal link for time plan {record.time_plan.ref_id} and goal {record.goal_ref_id} does not exist",
            )
        return record

    async def remove(self, key: tuple[EntityId, EntityId]) -> None:
        """Remove a time plan goal link."""
        result = await self._connection.execute(
            delete(self._time_plan_goal_link_table)
            .where(
                self._time_plan_goal_link_table.c.time_plan_ref_id == key[0].as_int()
            )
            .where(self._time_plan_goal_link_table.c.goal_ref_id == key[1].as_int())
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Time plan goal link for time plan {key[0]} and goal {key[1]} does not exist",
            )

    async def load_by_key_optional(
        self, key: tuple[EntityId, EntityId]
    ) -> TimePlanGoalLink | None:
        """Load a time plan goal link by its unique key."""
        result = await self._connection.execute(
            select(self._time_plan_goal_link_table)
            .where(
                self._time_plan_goal_link_table.c.time_plan_ref_id == key[0].as_int()
            )
            .where(self._time_plan_goal_link_table.c.goal_ref_id == key[1].as_int())
        )
        row = result.first()
        if row is None:
            return None
        return self._row_to_entity(row)

    async def find_all(
        self, parent_ref_id: EntityId | list[EntityId]
    ) -> list[TimePlanGoalLink]:
        """Find all time plan goal links for one or more time plans."""
        parent_ref_ids = (
            [parent_ref_id.as_int()]
            if isinstance(parent_ref_id, EntityId)
            else [p.as_int() for p in parent_ref_id]
        )
        result = await self._connection.execute(
            select(self._time_plan_goal_link_table).where(
                self._time_plan_goal_link_table.c.time_plan_ref_id.in_(parent_ref_ids)
            )
        )
        results = result.fetchall()
        return [self._row_to_entity(row) for row in results]

    async def remove_all_for_time_plan(self, time_plan_ref_id: EntityId) -> None:
        """Remove all links for a particular time plan."""
        await self._connection.execute(
            delete(self._time_plan_goal_link_table).where(
                self._time_plan_goal_link_table.c.time_plan_ref_id
                == time_plan_ref_id.as_int()
            )
        )

    async def remove_all_for_goal(self, goal_ref_id: EntityId) -> None:
        """Remove all links for a particular goal."""
        await self._connection.execute(
            delete(self._time_plan_goal_link_table).where(
                self._time_plan_goal_link_table.c.goal_ref_id == goal_ref_id.as_int()
            )
        )

    def _row_to_entity(self, row: RowType) -> TimePlanGoalLink:
        return self._realm_codec_registry.db_decode(
            TimePlanGoalLink, cast(Mapping[str, RealmThing], row._mapping)
        )
