"""Load settings for working mems use case."""

from jupiter.core.app import AppCore
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.working_mem.collection import (
    WorkingMemCollection,
)
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
class WorkingMemLoadSettingsArgs(UseCaseArgsBase):
    """WorkingMemLoadSettings args."""


@use_case_result
class WorkingMemLoadSettingsResult(UseCaseResultBase):
    """WorkingMemLoadSettings results."""

    generation_period: RecurringTaskPeriod
    cleanup_project: Project
    clean_up_inbox_tasks: list[InboxTask]


@readonly_use_case(WorkspaceFeature.WORKING_MEM, exclude_component=[AppCore.CLI])
class WorkingMemLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        WorkingMemLoadSettingsArgs, WorkingMemLoadSettingsResult
    ],
):
    """The command for loading the settings around workingmem."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: WorkingMemLoadSettingsArgs,
    ) -> WorkingMemLoadSettingsResult:
        """Execute the command's action."""
        workspace = context.workspace

        working_mem_collection = await uow.get_for(WorkingMemCollection).load_by_parent(
            workspace.ref_id,
        )
        catch_up_project = await uow.get_for(Project).load_by_id(
            working_mem_collection.cleanup_project_ref_id,
        )

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        clean_up_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.WORKING_MEM_CLEANUP,
            source_entity_ref_id=working_mem_collection.ref_id,
        )

        return WorkingMemLoadSettingsResult(
            generation_period=working_mem_collection.generation_period,
            cleanup_project=catch_up_project,
            clean_up_inbox_tasks=clean_up_inbox_tasks,
        )
