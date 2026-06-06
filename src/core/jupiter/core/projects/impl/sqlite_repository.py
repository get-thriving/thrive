"""The SQLite repository for projects."""

from collections.abc import Iterable
from sqlite3 import IntegrityError
from typing import Final, Mapping, cast

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.projects.root import Project, ProjectRepository
from jupiter.core.projects.stats import ProjectStats, ProjectStatsRepository
from jupiter.core.projects.status import ProjectStatus
from jupiter.core.projects.sub.milestones.root import (
    ProjectMilestone,
    ProjectMilestoneAlreadyExistsForDateError,
    ProjectMilestoneRepository,
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
)
from jupiter.framework.storage.sqlite.row import RowType
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
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteProjectRepository(SqliteLeafEntityRepository[Project], ProjectRepository):
    """The project repository."""

    async def find_completed_in_range(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | JupiterArchivalReason | list[JupiterArchivalReason],
        filter_start_completed_date: ADate,
        filter_end_completed_date: ADate,
        filter_exclude_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[Project]:
        """Find all completed projects in a time range."""
        query_stmt = select(self._table).where(
            self._table.c.project_collection_ref_id == parent_ref_id.as_int(),
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

        query_stmt = (
            query_stmt.where(
                self._table.c.status.in_(
                    s.value for s in ProjectStatus.all_completed_statuses()
                )
            )
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


class SqliteProjectStatsRepository(
    SqliteRecordRepository[ProjectStats, EntityId], ProjectStatsRepository
):
    """The project stats repository."""

    _project_stats_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._project_stats_table = Table(
            "project_stats",
            metadata,
            Column(
                "project_ref_id",
                Integer,
                ForeignKey("project.ref_id"),
                nullable=False,
            ),
            Column("all_inbox_tasks_cnt", Integer, nullable=False),
            Column("completed_inbox_tasks_cnt", Integer, nullable=False),
            Column("created_time", DateTime, nullable=False),
            Column("last_modified_time", DateTime, nullable=False),
            keep_existing=True,
        )

    async def create(self, record: ProjectStats) -> ProjectStats:
        """Create a new project stats."""
        try:
            await self._connection.execute(
                insert(self._project_stats_table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            self._realm_codec_registry.db_encode(record),
                        )
                    ),
                ),
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                f"Project stats for project {record.project.ref_id} already exists",
            ) from err
        return record

    async def save(self, record: ProjectStats) -> ProjectStats:
        """Save a project stats."""
        result = await self._connection.execute(
            update(self._project_stats_table)
            .where(
                self._project_stats_table.c.project_ref_id == record.project.as_int()
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
                f"The project stats {record.project.ref_id} does not exist"
            )
        return record

    async def remove(self, key: EntityId) -> None:
        """Remove a project stats."""
        result = await self._connection.execute(
            delete(self._project_stats_table).where(
                self._project_stats_table.c.project_ref_id == key.as_int()
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The project stats for project {key} does not exist"
            )

    async def load_by_key_optional(self, key: EntityId) -> ProjectStats | None:
        """Load a project stats by it's unique key."""
        result = await self._connection.execute(
            select(self._project_stats_table).where(
                self._project_stats_table.c.project_ref_id == key.as_int()
            )
        )
        result_x = result.first()
        if result_x is None:
            return None
        return self._row_to_entity(result_x)

    async def find_all(self, prefix: EntityId | list[EntityId]) -> list[ProjectStats]:
        """Find all project stats for a project."""
        result = await self._connection.execute(
            select(self._project_stats_table).where(
                self._project_stats_table.c.project_ref_id.in_(
                    [prefix.as_int()]
                    if isinstance(prefix, EntityId)
                    else [p.as_int() for p in prefix]
                )
            )
        )
        results = result.fetchall()
        return [self._row_to_entity(row) for row in results]

    async def mark_add_inbox_task(self, project_ref_id: EntityId) -> None:
        """Mark that a new inbox task has been added to the project."""
        result = await self._connection.execute(
            update(self._project_stats_table)
            .where(
                self._project_stats_table.c.project_ref_id == project_ref_id.as_int()
            )
            .values(
                all_inbox_tasks_cnt=self._project_stats_table.c.all_inbox_tasks_cnt + 1
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The project stats {project_ref_id} does not exist"
            )

    async def mark_remove_inbox_task(
        self, project_ref_id: EntityId, is_completed: bool
    ) -> None:
        """Mark that an inbox task has been removed from the project."""
        query_stmt = (
            update(self._project_stats_table)
            .where(
                self._project_stats_table.c.project_ref_id == project_ref_id.as_int()
            )
            .where(self._project_stats_table.c.all_inbox_tasks_cnt > 0)
        )
        if is_completed:
            query_stmt = query_stmt.values(
                completed_inbox_tasks_cnt=self._project_stats_table.c.completed_inbox_tasks_cnt
                - 1,
                all_inbox_tasks_cnt=self._project_stats_table.c.all_inbox_tasks_cnt
                - 1,
            )
        else:
            query_stmt = query_stmt.values(
                all_inbox_tasks_cnt=self._project_stats_table.c.all_inbox_tasks_cnt - 1
            )
        result = await self._connection.execute(query_stmt)
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The project stats {project_ref_id} does not exist or has no tasks to remove"
            )

    async def mark_inbox_task_done(self, project_ref_id: EntityId) -> None:
        """Mark that an inbox task has been done on the project."""
        result = await self._connection.execute(
            update(self._project_stats_table)
            .where(
                self._project_stats_table.c.project_ref_id == project_ref_id.as_int()
            )
            .where(
                self._project_stats_table.c.completed_inbox_tasks_cnt
                < self._project_stats_table.c.all_inbox_tasks_cnt
            )
            .values(
                completed_inbox_tasks_cnt=self._project_stats_table.c.completed_inbox_tasks_cnt
                + 1
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The project stats {project_ref_id} does not exist"
            )

    async def mark_inbox_task_undone(self, project_ref_id: EntityId) -> None:
        """Mark that an inbox task has been undone on the project."""
        result = await self._connection.execute(
            update(self._project_stats_table)
            .where(
                self._project_stats_table.c.project_ref_id == project_ref_id.as_int()
            )
            .where(self._project_stats_table.c.completed_inbox_tasks_cnt > 0)
            .values(
                completed_inbox_tasks_cnt=self._project_stats_table.c.completed_inbox_tasks_cnt
                - 1
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"The project stats {project_ref_id} does not exist"
            )

    def _row_to_entity(self, row: RowType) -> ProjectStats:
        return self._realm_codec_registry.db_decode(
            ProjectStats, cast(Mapping[str, RealmThing], row._mapping)
        )


class SqliteProjectMilestoneRepository(
    SqliteLeafEntityRepository[ProjectMilestone], ProjectMilestoneRepository
):
    """The project milestone repository."""

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
            already_exists_err_cls=ProjectMilestoneAlreadyExistsForDateError,
        )
