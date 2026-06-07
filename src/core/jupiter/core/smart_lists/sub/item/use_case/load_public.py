"""Guest readonly use case for loading a published smart list item."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.smart_lists.collection import SmartListCollection
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.core.smart_lists.sub.item.service.load import (
    SmartListItemLoadResult,
    SmartListItemLoadService,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class SmartListItemLoadPublicArgs(UseCaseArgsBase):
    """SmartListItemLoadPublic args."""

    external_id: PublishExternalId


class SmartListItemLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[SmartListItemLoadPublicArgs, SmartListItemLoadResult]
):
    """Load a published smart list item by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: SmartListItemLoadPublicArgs,
    ) -> SmartListItemLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.SMART_LIST_ITEM.value:
                raise InputValidationError(
                    "The publish entity does not refer to a smart list item."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            smart_list_collection = await uow.get_for(
                SmartListCollection
            ).load_by_parent(publish_domain.workspace.ref_id)
            item = await uow.get_for(SmartListItem).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            smart_list = await uow.get_for(SmartList).load_by_id(
                item.smart_list.ref_id,
                allow_archived=False,
            )
            if smart_list.parent_ref_id != smart_list_collection.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace smart list item."
                )

            return await SmartListItemLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                item,
                allow_archived=False,
                include_publish_entity=False,
            )
