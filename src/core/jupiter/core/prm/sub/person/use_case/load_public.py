"""Guest readonly use case for loading a published person."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.service.load import PersonLoadResult, PersonLoadService
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class PersonLoadPublicArgs(UseCaseArgsBase):
    """PersonLoadPublic args."""

    external_id: PublishExternalId


class PersonLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[PersonLoadPublicArgs, PersonLoadResult]
):
    """Load a published person by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: PersonLoadPublicArgs,
    ) -> PersonLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.PERSON.value:
                raise InputValidationError(
                    "The publish entity does not refer to a person."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            prm = await uow.get_for(PRM).load_by_parent(publish_domain.workspace.ref_id)
            person = await uow.get_for(Person).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if person.parent_ref_id != prm.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace person."
                )

            return await PersonLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                person,
                allow_archived=False,
                include_inbox_tasks=False,
                include_occasion_time_events=False,
                include_publish_entity=False,
            )
