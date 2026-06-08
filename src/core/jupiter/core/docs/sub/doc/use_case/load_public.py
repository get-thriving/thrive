"""Guest readonly use case for loading a published doc."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.docs.root import DocCollection
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.docs.sub.doc.service.load import DocLoadResult, DocLoadService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocLoadPublicArgs(UseCaseArgsBase):
    """DocLoadPublic args."""

    external_id: PublishExternalId


class DocLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[DocLoadPublicArgs, DocLoadResult]
):
    """Load a published doc by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: DocLoadPublicArgs,
    ) -> DocLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.DOC.value:
                raise InputValidationError(
                    "The publish entity does not refer to a doc."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            doc_collection = await uow.get_for(DocCollection).load_by_parent(
                publish_domain.workspace.ref_id
            )
            doc = await uow.get_for(Doc).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if doc.parent_ref_id != doc_collection.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace doc."
                )

            return await DocLoadService().do_it(
                uow,
                doc,
                allow_archived=False,
                include_publish_entity=False,
            )
