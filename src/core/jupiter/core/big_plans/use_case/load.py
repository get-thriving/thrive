"""Use case for loading big plans."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.stats import BigPlanStats, BigPlanStatsRepository
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class BigPlanLoadArgs(UseCaseArgsBase):
    """BigPlanLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class BigPlanLoadResult(UseCaseResultBase):
    """BigPlanLoadResult."""

    big_plan: BigPlan
    project: Project
    milestones: list[BigPlanMilestone]
    inbox_tasks: list[InboxTask]
    note: Note | None
    stats: BigPlanStats


@readonly_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[BigPlanLoadArgs, BigPlanLoadResult]
):
    """The use case for loading a particular big plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: BigPlanLoadArgs,
    ) -> BigPlanLoadResult:
        """Execute the command's action."""
        workspace = context.workspace

        big_plan = await uow.get_for(BigPlan).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )
        project = await uow.get_for(Project).load_by_id(big_plan.project_ref_id)

        milestones = await uow.get_for(BigPlanMilestone).find_all_generic(
            parent_ref_id=big_plan.ref_id,
            allow_archived=False,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=args.allow_archived,
            source=InboxTaskSource.BIG_PLAN,
            source_entity_ref_id=big_plan.ref_id,
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteDomain.BIG_PLAN,
            big_plan.ref_id,
            allow_archived=args.allow_archived,
        )
        stats = await uow.get(BigPlanStatsRepository).load_by_key_optional(
            big_plan.ref_id
        )
        if stats is None:
            raise Exception("Stats not found")

        return BigPlanLoadResult(
            big_plan=big_plan,
            project=project,
            milestones=milestones,
            inbox_tasks=inbox_tasks,
            note=note,
            stats=stats,
        )
