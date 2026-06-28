"""The command for finding a email task."""

from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.email.task_collection import (
    EmailTaskCollection,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class EmailTaskFindArgs(JupiterFindCrownEntityArgs):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_inbox_task: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class EmailTaskFindResultEntry(UseCaseResultBase):
    """A single email task result."""

    email_task: EmailTask
    inbox_task: InboxTask | None


@use_case_result
class EmailTaskFindResult(UseCaseResultBase):
    """PersonFindResult."""

    entries: list[EmailTaskFindResultEntry]


@readonly_use_case(WorkspaceFeature.EMAIL_TASKS)
class EmailTaskFindUseCase(
    JupiterFindCrownEntityUseCase[EmailTaskFindArgs, EmailTaskFindResult]
):
    """The command for finding a email task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: EmailTaskFindArgs,
    ) -> EmailTaskFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_inbox_task = args.include_inbox_task or False

        workspace = context.workspace

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        push_integration_group = await uow.get_for(PushIntegrationGroup).load_by_parent(
            workspace.ref_id,
        )
        email_task_collection = await uow.get_for(EmailTaskCollection).load_by_parent(
            push_integration_group.ref_id,
        )

        accessible_email_task_ref_ids = await self.find_accessible_ref_ids(
            uow, context.user.ref_id, EmailTask, allow_archived
        )
        if args.filter_ref_ids is not None:
            accessible_set = set(accessible_email_task_ref_ids)
            accessible_email_task_ref_ids = [
                ref_id for ref_id in args.filter_ref_ids if ref_id in accessible_set
            ]
        if not accessible_email_task_ref_ids:
            return EmailTaskFindResult(entries=[])

        email_tasks = await uow.get_for(EmailTask).find_all(
            parent_ref_id=email_task_collection.ref_id,
            allow_archived=allow_archived,
            filter_ref_ids=accessible_email_task_ref_ids,
        )

        if include_inbox_task:
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.EMAIL_TASK.value, st.ref_id)
                    for st in email_tasks
                ],
            )
            inbox_tasks_by_email_task_ref_id = {
                it.owner.ref_id: it for it in inbox_tasks
            }
        else:
            inbox_tasks_by_email_task_ref_id = None

        return EmailTaskFindResult(
            entries=[
                EmailTaskFindResultEntry(
                    email_task=st,
                    inbox_task=(
                        inbox_tasks_by_email_task_ref_id.get(st.ref_id, None)
                        if inbox_tasks_by_email_task_ref_id
                        else None
                    ),
                )
                for st in email_tasks
            ],
        )
