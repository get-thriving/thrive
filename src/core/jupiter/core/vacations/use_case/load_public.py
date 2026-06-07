"""Guest readonly use case for loading a published vacation by external id."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.vacations.root import Vacation
from jupiter.core.vacations.service.load import VacationLoadResult, VacationLoadService
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    use_case_args,
)


@use_case_args
class VacationLoadPublicArgs(UseCaseArgsBase):
    """VacationLoadPublic args."""

    external_id: PublishExternalId


class VacationLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[VacationLoadPublicArgs, VacationLoadResult]
):
    """Load a published vacation and its dependent entities by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: VacationLoadPublicArgs,
    ) -> VacationLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.VACATION.value:
                raise InputValidationError(
                    "The publish entity does not refer to a vacation."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            vacation_collection = await uow.get_for(VacationCollection).load_by_parent(
                publish_domain.workspace.ref_id
            )
            vacation = await uow.get_for(Vacation).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if vacation.parent_ref_id != vacation_collection.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace vacation."
                )

            return await VacationLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                vacation,
                allow_archived=False,
            )
