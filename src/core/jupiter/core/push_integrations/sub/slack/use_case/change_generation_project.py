"""Update the slack tasks generation project."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.projects.root import Project
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.push_integrations.sub.slack.task_collection import (
    SlackTaskCollection,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SlackTaskChangeGenerationProjectArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    generation_project_ref_id: EntityId


@mutation_use_case([WorkspaceFeature.SLACK_TASKS, WorkspaceFeature.PROJECTS])
class SlackTaskChangeGenerationProjectUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        SlackTaskChangeGenerationProjectArgs, None
    ],
):
    """The command for updating the generation up project for slack tasks."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: SlackTaskChangeGenerationProjectArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )
        old_generation_project_ref_id = slack_task_collection.generation_project_ref_id

        await uow.get_for(Project).load_by_id(
            args.generation_project_ref_id,
        )

        slack_tasks = await uow.get_for(SlackTask).find_all(
            parent_ref_id=slack_task_collection.ref_id,
            allow_archived=False,
        )
        slack_tasks_by_ref_id = {st.ref_id: st for st in slack_tasks}

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        all_generated_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=[InboxTaskSource.SLACK_TASK],
            source_entity_ref_id=[m.ref_id for m in slack_tasks],
        )

        if (
            old_generation_project_ref_id != args.generation_project_ref_id
            and len(slack_tasks) > 0
        ):
            updated_generated_inbox_tasks = []

            for inbox_task in all_generated_inbox_tasks:
                slack_task = slack_tasks_by_ref_id[
                    inbox_task.source_entity_ref_id_for_sure
                ]
                update_inbox_task = inbox_task.update_link_to_slack_task(
                    ctx=context.domain_context,
                    project_ref_id=args.generation_project_ref_id,
                    user=slack_task.user,
                    channel=slack_task.channel,
                    message=slack_task.message,
                    generation_extra_info=slack_task.generation_extra_info,
                )

                await uow.get_for(InboxTask).save(
                    update_inbox_task,
                )
                await progress_reporter.mark_updated(update_inbox_task)

                updated_generated_inbox_tasks.append(update_inbox_task)

        slack_task_collection = slack_task_collection.change_generation_project(
            ctx=context.domain_context,
            generation_project_ref_id=args.generation_project_ref_id,
        )

        await uow.get_for(SlackTaskCollection).save(slack_task_collection)
