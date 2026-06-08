"""Guest readonly use case for loading a published chore."""

from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.chores.service.load import ChoreLoadResult, ChoreLoadService
from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ChoreLoadPublicArgs(UseCaseArgsBase):
    """ChoreLoadPublic args."""

    external_id: PublishExternalId
    inbox_task_retrieve_offset: int | None


class ChoreLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[ChoreLoadPublicArgs, ChoreLoadResult]
):
    """Load a published chore by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: ChoreLoadPublicArgs,
    ) -> ChoreLoadResult:
        """Execute the use case."""
        if (
            args.inbox_task_retrieve_offset is not None
            and args.inbox_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.CHORE.value:
                raise InputValidationError(
                    "The publish entity does not refer to a chore."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
                publish_domain.workspace.ref_id
            )
            chore = await uow.get_for(Chore).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if chore.parent_ref_id != chore_collection.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace chore."
                )

            return await ChoreLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                chore,
                allow_archived=False,
                inbox_task_retrieve_offset=args.inbox_task_retrieve_offset or 0,
                include_publish_entity=False,
            )
