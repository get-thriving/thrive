"""SQLite implementation of gamification task scores classes."""

from typing import Final, Mapping, cast

from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.gamification.impl.score_period_pk_storage import (
    db_encode_score_period_best_row,
    db_encode_score_stats_row,
    mapping_for_decode_score_period_best,
    mapping_for_decode_score_stats,
    optional_period_pk_match,
)
from jupiter.core.gamification.score_log import (
    ScoreLog,
    ScoreLogRepository,
)
from jupiter.core.gamification.score_log_entry import (
    ScoreLogEntry,
    ScoreLogEntryRepository,
)
from jupiter.core.gamification.score_period_best import (
    ScorePeriodBest,
    ScorePeriodBestRepository,
)
from jupiter.core.gamification.score_stats import (
    ScoreStats,
    ScoreStatsRepository,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmThing
from jupiter.framework.storage.repository import (
    RecordAlreadyExistsError,
    RecordNotFoundError,
)
from jupiter.framework.storage.sqlite.repository import (
    SqliteLeafEntityRepository,
    SqliteRecordRepository,
    SqliteTrunkEntityRepository,
)
from jupiter.framework.storage.sqlite.row import RowType
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    String,
    Table,
    and_,
    delete,
    insert,
    or_,
    select,
    update,
)
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteScoreLogRepository(
    SqliteTrunkEntityRepository[ScoreLog], ScoreLogRepository
):
    """The score log repository."""

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
            table_name="gamification_score_log",
        )


class SqliteScoreLogEntryRepository(
    SqliteLeafEntityRepository[ScoreLogEntry], ScoreLogEntryRepository
):
    """Sqlite implementation of the score log entry repository."""

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
            table_name="gamification_score_log_entry",
        )


class SqliteScoreStatsRepository(
    SqliteRecordRepository[
        ScoreStats, tuple[EntityId, RecurringTaskPeriod | None, str]
    ],
    ScoreStatsRepository,
):
    """Sqlite implementation of the score stats repository."""

    _score_stats_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._score_stats_table = Table(
            "gamification_score_stats",
            metadata,
            Column("created_time", DateTime, nullable=False),
            Column("last_modified_time", DateTime, nullable=False),
            Column(
                "score_log_ref_id",
                Integer,
                ForeignKey("gamification_score_log.ref_id"),
                nullable=False,
            ),
            Column("period", String, nullable=True),
            Column("timeline", String, nullable=False),
            Column("total_score", Integer, nullable=False),
            Column("inbox_task_cnt", Integer, nullable=False),
            Column("big_plan_cnt", Integer, nullable=False),
            keep_existing=True,
        )

    async def create(self, record: ScoreStats) -> ScoreStats:
        """Create a score stats."""
        try:
            await self._connection.execute(
                insert(self._score_stats_table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            db_encode_score_stats_row(
                                self._realm_codec_registry, record
                            ),
                        )
                    ),
                ),
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                f"Score stats for score log {record.score_log.ref_id}:{record.period}:{record.timeline} already exists",
            ) from err
        return record

    async def save(self, record: ScoreStats) -> ScoreStats:
        """Save a score stats."""
        result = await self._connection.execute(
            update(self._score_stats_table)
            .where(
                self._score_stats_table.c.score_log_ref_id == record.score_log.as_int()
            )
            .where(
                optional_period_pk_match(
                    self._score_stats_table.c.period, record.period
                )
            )
            .where(self._score_stats_table.c.timeline == record.timeline)
            .values(
                **(
                    cast(
                        Mapping[str, RealmThing],
                        db_encode_score_stats_row(self._realm_codec_registry, record),
                    )
                )
            ),
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The score stats {record.score_log.ref_id}:{record.period}:{record.timeline} does not exist"
            )
        return record

    async def remove(
        self, key: tuple[EntityId, RecurringTaskPeriod | None, str]
    ) -> None:
        """Remove a score stats."""
        result = await self._connection.execute(
            delete(self._score_stats_table)
            .where(self._score_stats_table.c.score_log_ref_id == key[0].as_int())
            .where(optional_period_pk_match(self._score_stats_table.c.period, key[1]))
            .where(self._score_stats_table.c.timeline == key[2])
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The score stats {key[0]}:{key[1]}:{key[2]} does not exist"
            )

    async def load_by_key_optional(
        self, key: tuple[EntityId, RecurringTaskPeriod | None, str]
    ) -> ScoreStats | None:
        """Load a score stats by it's unique key."""
        result = (
            await self._connection.execute(
                select(self._score_stats_table)
                .where(self._score_stats_table.c.score_log_ref_id == key[0].as_int())
                .where(
                    optional_period_pk_match(self._score_stats_table.c.period, key[1])
                )
                .where(self._score_stats_table.c.timeline == key[2])
            )
        ).first()
        if result is None:
            return None
        return self._row_to_entity(result)

    async def find_all(self, prefix: EntityId | list[EntityId]) -> list[ScoreStats]:
        """Find all score stats for a score log."""
        result = await self._connection.execute(
            select(self._score_stats_table).where(
                self._score_stats_table.c.score_log_ref_id.in_(
                    [prefix.as_int()]
                    if isinstance(prefix, EntityId)
                    else [p.as_int() for p in prefix]
                )
            )
        )
        return [self._row_to_entity(row) for row in result]

    async def find_all_in_timerange(
        self,
        score_log_ref_id: EntityId,
        period: RecurringTaskPeriod,
        start_date: ADate,
        end_date: ADate,
    ) -> list[ScoreStats]:
        """Find all score stats in a given time range."""
        result = await self._connection.execute(
            select(self._score_stats_table)
            .where(
                self._score_stats_table.c.score_log_ref_id == score_log_ref_id.as_int()
            )
            .where(self._score_stats_table.c.period == period.value)
            .where(
                self._score_stats_table.c.created_time
                >= self._realm_codec_registry.db_encode(start_date)
            )
            .where(
                self._score_stats_table.c.created_time
                <= self._realm_codec_registry.db_encode(
                    end_date.to_timestamp_at_end_of_day()
                )
            )
        )

        return [self._row_to_entity(row) for row in result]

    async def find_all_for_keys(
        self, keys: list[tuple[EntityId, RecurringTaskPeriod | None, str]]
    ) -> list[ScoreStats]:
        """Find all score stats matching the given natural keys, in one query."""
        if not keys:
            return []
        conditions = [
            and_(
                self._score_stats_table.c.score_log_ref_id == score_log_ref_id.as_int(),
                optional_period_pk_match(self._score_stats_table.c.period, period),
                self._score_stats_table.c.timeline == timeline,
            )
            for score_log_ref_id, period, timeline in keys
        ]
        result = await self._connection.execute(
            select(self._score_stats_table).where(or_(*conditions))
        )
        return [self._row_to_entity(row) for row in result]

    async def upsert_all(self, records: list[ScoreStats]) -> None:
        """Upsert a batch of score stats in a single statement."""
        if not records:
            return
        rows = [
            db_encode_score_stats_row(self._realm_codec_registry, record)
            for record in records
        ]
        insert_stmt = sqlite_insert(self._score_stats_table).values(rows)
        upsert_stmt = insert_stmt.on_conflict_do_update(
            index_elements=["score_log_ref_id", "period", "timeline"],
            set_={
                "total_score": insert_stmt.excluded.total_score,
                "inbox_task_cnt": insert_stmt.excluded.inbox_task_cnt,
                "big_plan_cnt": insert_stmt.excluded.big_plan_cnt,
                "last_modified_time": insert_stmt.excluded.last_modified_time,
            },
        )
        await self._connection.execute(upsert_stmt)

    def _row_to_entity(self, row: RowType) -> ScoreStats:
        return self._realm_codec_registry.db_decode(
            ScoreStats,
            cast(
                Mapping[str, RealmThing],
                mapping_for_decode_score_stats(row._mapping),
            ),
        )


class SqliteScorePeriodBestRepository(
    SqliteRecordRepository[
        ScorePeriodBest,
        tuple[EntityId, RecurringTaskPeriod | None, str, RecurringTaskPeriod],
    ],
    ScorePeriodBestRepository,
):
    """Sqlite implementation of the score period best repository."""

    _score_period_best_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._score_period_best_table = Table(
            "gamification_score_period_best",
            metadata,
            Column("created_time", DateTime, nullable=False),
            Column("last_modified_time", DateTime, nullable=False),
            Column(
                "score_log_ref_id",
                Integer,
                ForeignKey("gamification_score_log.ref_id"),
                nullable=False,
            ),
            Column("period", String, nullable=True),
            Column("timeline", String, nullable=False),
            Column("sub_period", String, nullable=False),
            Column("total_score", Integer, nullable=False),
            Column("inbox_task_cnt", Integer, nullable=False),
            Column("big_plan_cnt", Integer, nullable=False),
            keep_existing=True,
        )

    async def create(self, record: ScorePeriodBest) -> ScorePeriodBest:
        """Create a score period best."""
        try:
            await self._connection.execute(
                insert(self._score_period_best_table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            db_encode_score_period_best_row(
                                self._realm_codec_registry, record
                            ),
                        )
                    ),
                ),
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                f"Score period best for score log {record.score_log}:{record.period}:{record.timeline}:{record.sub_period} already exists",
            ) from err
        return record

    async def save(self, record: ScorePeriodBest) -> ScorePeriodBest:
        """Save a score period best."""
        result = await self._connection.execute(
            update(self._score_period_best_table)
            .where(
                self._score_period_best_table.c.score_log_ref_id
                == record.score_log.as_int()
            )
            .where(
                optional_period_pk_match(
                    self._score_period_best_table.c.period, record.period
                )
            )
            .where(self._score_period_best_table.c.timeline == record.timeline)
            .where(
                self._score_period_best_table.c.sub_period == record.sub_period.value
            )
            .values(
                **(
                    cast(
                        Mapping[str, RealmThing],
                        db_encode_score_period_best_row(
                            self._realm_codec_registry, record
                        ),
                    )
                ),
            ),
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The score period best {record.score_log}:{record.period}:{record.timeline}:{record.sub_period} does not exist"
            )
        return record

    async def remove(
        self, key: tuple[EntityId, RecurringTaskPeriod | None, str, RecurringTaskPeriod]
    ) -> None:
        """Remove a score period best."""
        result = await self._connection.execute(
            delete(self._score_period_best_table)
            .where(self._score_period_best_table.c.score_log_ref_id == key[0].as_int())
            .where(
                optional_period_pk_match(self._score_period_best_table.c.period, key[1])
            )
            .where(self._score_period_best_table.c.timeline == key[2])
            .where(self._score_period_best_table.c.sub_period == key[3].value)
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The score period best {key[0]}:{key[1]}:{key[2]}:{key[3]} does not exist"
            )

    async def load_by_key_optional(
        self, key: tuple[EntityId, RecurringTaskPeriod | None, str, RecurringTaskPeriod]
    ) -> ScorePeriodBest | None:
        """Load a score period best by it's unique key."""
        result = (
            await self._connection.execute(
                select(self._score_period_best_table)
                .where(
                    self._score_period_best_table.c.score_log_ref_id == key[0].as_int()
                )
                .where(
                    optional_period_pk_match(
                        self._score_period_best_table.c.period, key[1]
                    )
                )
                .where(self._score_period_best_table.c.timeline == key[2])
                .where(self._score_period_best_table.c.sub_period == key[3].value)
            )
        ).first()
        if result is None:
            return None
        return self._row_to_entity(result)

    async def find_all(
        self, prefix: EntityId | list[EntityId]
    ) -> list[ScorePeriodBest]:
        """Find all score period best for a score log."""
        result = await self._connection.execute(
            select(self._score_period_best_table).where(
                self._score_period_best_table.c.score_log_ref_id.in_(
                    [prefix.as_int()]
                    if isinstance(prefix, EntityId)
                    else [p.as_int() for p in prefix]
                )
            )
        )
        return [self._row_to_entity(row) for row in result]

    async def find_all_for_keys(
        self,
        keys: list[
            tuple[EntityId, RecurringTaskPeriod | None, str, RecurringTaskPeriod]
        ],
    ) -> list[ScorePeriodBest]:
        """Find all score period bests matching the given natural keys, in one query."""
        if not keys:
            return []
        conditions = [
            and_(
                self._score_period_best_table.c.score_log_ref_id
                == score_log_ref_id.as_int(),
                optional_period_pk_match(
                    self._score_period_best_table.c.period, period
                ),
                self._score_period_best_table.c.timeline == timeline,
                self._score_period_best_table.c.sub_period == sub_period.value,
            )
            for score_log_ref_id, period, timeline, sub_period in keys
        ]
        result = await self._connection.execute(
            select(self._score_period_best_table).where(or_(*conditions))
        )
        return [self._row_to_entity(row) for row in result]

    async def upsert_all(self, records: list[ScorePeriodBest]) -> None:
        """Upsert a batch of score period bests in a single statement."""
        if not records:
            return
        rows = [
            db_encode_score_period_best_row(self._realm_codec_registry, record)
            for record in records
        ]
        insert_stmt = sqlite_insert(self._score_period_best_table).values(rows)
        upsert_stmt = insert_stmt.on_conflict_do_update(
            index_elements=["score_log_ref_id", "period", "timeline", "sub_period"],
            set_={
                "total_score": insert_stmt.excluded.total_score,
                "inbox_task_cnt": insert_stmt.excluded.inbox_task_cnt,
                "big_plan_cnt": insert_stmt.excluded.big_plan_cnt,
                "last_modified_time": insert_stmt.excluded.last_modified_time,
            },
        )
        await self._connection.execute(upsert_stmt)

    def _row_to_entity(self, row: RowType) -> ScorePeriodBest:
        return self._realm_codec_registry.db_decode(
            ScorePeriodBest,
            cast(
                Mapping[str, RealmThing],
                mapping_for_decode_score_period_best(row._mapping),
            ),
        )
