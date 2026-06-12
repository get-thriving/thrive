"""Guest readonly use case for loading a published todo task by external id."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.todo.root import TodoTask
from jupiter.core.todo.service.load import TodoTaskLoadResult, TodoTaskLoadService
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    use_case_args,
)


@use_case_args
class TodoTaskLoadPublicArgs(UseCaseArgsBase):
    """TodoTaskLoadPublic args."""

    external_id: PublishExternalId


class TodoTaskLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[TodoTaskLoadPublicArgs, TodoTaskLoadResult]
):
    """Load a published todo task and its dependent entities by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: TodoTaskLoadPublicArgs,
    ) -> TodoTaskLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.TODO_TASK.value:
                raise InputValidationError(
                    "The publish entity does not refer to a todo task."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            todo_task = await uow.get_for(TodoTask).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )

            return await TodoTaskLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                todo_task,
                allow_archived=False,
            )
