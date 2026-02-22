"""The command for finding a slack task."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.push_integrations.sub.slack.task_collection import (
    SlackTaskCollection,
)
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
    use_case_result_part,
)


@use_case_args
class SlackTaskFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_inbox_tasks: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class SlackTaskFindResultEntry(UseCaseResultBase):
    """A single slack task result."""

    slack_task: SlackTask
    inbox_task: InboxTask | None


@use_case_result
class SlackTaskFindResult(UseCaseResultBase):
    """PersonFindResult."""

    generation_project: Project
    entries: list[SlackTaskFindResultEntry]


@readonly_use_case(WorkspaceFeature.SLACK_TASKS)
class SlackTaskFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[SlackTaskFindArgs, SlackTaskFindResult]
):
    """The command for finding a slack task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SlackTaskFindArgs,
    ) -> SlackTaskFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_inbox_tasks = args.include_inbox_tasks or False

        workspace = context.workspace

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )

        slack_tasks = await uow.get_for(SlackTask).find_all(
            parent_ref_id=slack_task_collection.ref_id,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        generation_project = await uow.get_for(Project).load_by_id(
            slack_task_collection.generation_project_ref_id,
        )

        if include_inbox_tasks:
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source=[InboxTaskSource.SLACK_TASK],
                source_entity_ref_id=[st.ref_id for st in slack_tasks],
            )
            inbox_tasks_by_slack_task_ref_id = {
                it.source_entity_ref_id_for_sure: it for it in inbox_tasks
            }
        else:
            inbox_tasks_by_slack_task_ref_id = None

        return SlackTaskFindResult(
            generation_project=generation_project,
            entries=[
                SlackTaskFindResultEntry(
                    slack_task=st,
                    inbox_task=(
                        inbox_tasks_by_slack_task_ref_id.get(st.ref_id, None)
                        if inbox_tasks_by_slack_task_ref_id
                        else None
                    ),
                )
                for st in slack_tasks
            ],
        )
