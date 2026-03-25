"""Use case for loading the settings around journals."""

from jupiter.core.app import AppCore
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.generation_approach import (
    JournalGenerationApproach,
)
from jupiter.core.life_plan.sub.aspects.root import Project
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
class JournalLoadSettingsArgs(UseCaseArgsBase):
    """JournalLoadSettings args."""


@use_case_result
class JournalLoadSettingsResult(UseCaseResultBase):
    """JournalLoadSettings results."""

    periods: list[RecurringTaskPeriod]
    generation_approach: JournalGenerationApproach
    generation_in_advance_days: dict[RecurringTaskPeriod, int]
    writing_task_project: Project | None
    writing_task_gen_params: RecurringTaskGenParams | None
    writing_tasks: list[InboxTask]


@readonly_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        JournalLoadSettingsArgs, JournalLoadSettingsResult
    ],
):
    """The command for loading the settings around journals."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: JournalLoadSettingsArgs,
    ) -> JournalLoadSettingsResult:
        """Execute the command's action."""
        workspace = context.workspace

        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            writing_task_project = await uow.get_for(Project).load_by_id(
                journal_collection.writing_task_project_ref_id,
            )
        else:
            writing_task_project = None

        writing_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.JOURNAL,
        )

        return JournalLoadSettingsResult(
            periods=list(journal_collection.periods),
            generation_approach=journal_collection.generation_approach,
            generation_in_advance_days=journal_collection.generation_in_advance_days,
            writing_task_project=writing_task_project,
            writing_task_gen_params=journal_collection.writing_task_gen_params,
            writing_tasks=writing_tasks,
        )
