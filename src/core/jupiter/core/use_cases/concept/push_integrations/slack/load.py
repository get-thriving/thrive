"""Use case for loading a particular slack task."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.push_integrations.slack.slack_task import SlackTask
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
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
class SlackTaskLoadArgs(UseCaseArgsBase):
    """SlackTaskLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class SlackTaskLoadResult(UseCaseResultBase):
    """SlackTaskLoadResult."""

    slack_task: SlackTask
    inbox_task: InboxTask | None


@readonly_use_case(WorkspaceFeature.SLACK_TASKS)
class SlackTaskLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[SlackTaskLoadArgs, SlackTaskLoadResult]
):
    """Use case for loading a particular slack task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SlackTaskLoadArgs,
    ) -> SlackTaskLoadResult:
        """Execute the command's action."""
        workspace = context.workspace
        slack_task = await uow.get_for(SlackTask).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        all_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.SLACK_TASK,
            source_entity_ref_id=slack_task.ref_id,
        )
        inbox_task = all_inbox_tasks[0] if len(all_inbox_tasks) > 0 else None

        return SlackTaskLoadResult(slack_task=slack_task, inbox_task=inbox_task)
