"""Garbage collect a workspace."""

from collections.abc import Iterable
from typing import Final

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.service.archive import (
    BigPlanArchiveService,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gc.log import GCLog
from jupiter.core.gc.log_entry import GCLogEntry
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.sync_target import SyncTarget
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.context import MutationContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import (
    DomainStorageEngine,
    DomainUnitOfWork,
)
from jupiter.framework.time_provider import TimeProvider


class GCService:
    """Shared service for performing garbage collection."""

    _time_provider: Final[TimeProvider]
    _domain_storage_engine: Final[DomainStorageEngine]

    def __init__(
        self,
        time_provider: TimeProvider,
        domain_storage_engine: DomainStorageEngine,
    ) -> None:
        """Constructor."""
        self._time_provider = time_provider
        self._domain_storage_engine = domain_storage_engine

    async def do_it(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        workspace: Workspace,
        gc_targets: list[SyncTarget],
    ) -> None:
        """Execute the service's action."""
        async with self._domain_storage_engine.get_unit_of_work() as uow:
            gc_log = await uow.get_for(GCLog).load_by_parent(workspace.ref_id)
            gc_log_entry = GCLogEntry.new_log_entry(
                ctx,
                gc_log_ref_id=gc_log.ref_id,
                gc_targets=gc_targets,
            )
            gc_log_entry = await uow.get_for(GCLogEntry).create(gc_log_entry)

            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
                workspace.ref_id,
            )

        if (
            workspace.is_feature_available(WorkspaceFeature.INBOX_TASKS)
            and SyncTarget.INBOX_TASKS in gc_targets
        ):
            async with progress_reporter.section("Inbox Tasks"):
                async with progress_reporter.section(
                    "Archiving all done inbox tasks",
                ):
                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        inbox_tasks = await uow.get_for(InboxTask).find_all(
                            parent_ref_id=inbox_task_collection.ref_id,
                            allow_archived=False,
                        )
                    gc_log_entry = await self._archive_done_inbox_tasks(
                        ctx,
                        progress_reporter,
                        inbox_tasks,
                        gc_log_entry,
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.BIG_PLANS)
            and SyncTarget.BIG_PLANS in gc_targets
        ):
            async with progress_reporter.section("Big Plans"):
                async with progress_reporter.section(
                    "Archiving all done big plans",
                ):
                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        big_plans = await uow.get_for(BigPlan).find_all(
                            parent_ref_id=big_plan_collection.ref_id,
                            allow_archived=False,
                        )
                gc_log_entry = await self._archive_done_big_plans(
                    ctx,
                    uow,
                    progress_reporter,
                    big_plans,
                    gc_log_entry,
                )

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            gc_log_entry = gc_log_entry.close(ctx)
            gc_log_entry = await uow.get_for(GCLogEntry).save(gc_log_entry)

    async def _archive_done_inbox_tasks(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        inbox_tasks: Iterable[InboxTask],
        gc_log_entry: GCLogEntry,
    ) -> GCLogEntry:
        inbox_task_archive_service = InboxTaskArchiveService()

        for inbox_task in inbox_tasks:
            if not inbox_task.status.is_completed:
                continue
            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await inbox_task_archive_service.do_it(
                    ctx, uow, progress_reporter, inbox_task, JupiterArchivalReason.GC
                )
            gc_log_entry = gc_log_entry.add_entity(
                ctx,
                inbox_task,
            )

        return gc_log_entry

    async def _archive_done_big_plans(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        big_plans: Iterable[BigPlan],
        gc_log_entry: GCLogEntry,
    ) -> GCLogEntry:
        """Archive the done big plans."""
        big_plan_archive_service = BigPlanArchiveService()

        for big_plan in big_plans:
            if not big_plan.status.is_completed:
                continue
            async with self._domain_storage_engine.get_unit_of_work() as uow:
                result = await big_plan_archive_service.do_it(
                    ctx, uow, progress_reporter, big_plan, JupiterArchivalReason.GC
                )

            gc_log_entry = gc_log_entry.add_entity(
                ctx,
                big_plan,
            )
            for archived_inbox_task in result.archived_inbox_tasks:
                gc_log_entry = gc_log_entry.add_entity(
                    ctx,
                    archived_inbox_task,
                )

        return gc_log_entry
