"""Use case for rejecting an access request to a shared entity."""

from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.core.common.sub.access.sub.request.root import AccessRequest
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.concepts.registry import ConceptNotFoundError
from jupiter.framework.entity import CrownEntity
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class RejectAccessToEntityArgs(JupiterCreateCrownEntityArgs):
    """RejectAccessToEntity args."""

    access_request_ref_id: EntityId


@use_case_result
class RejectAccessToEntityResult(UseCaseResultBase):
    """RejectAccessToEntity result."""

    access_request_ref_id: EntityId


@mutation_use_case()
class RejectAccessToEntityUseCase(
    JupiterCreateCrownEntityUseCase[
        RejectAccessToEntityArgs, RejectAccessToEntityResult
    ]
):
    """Use case for rejecting an access request to a shared entity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: RejectAccessToEntityArgs,
    ) -> RejectAccessToEntityResult:
        """Execute the command's action."""
        access_request = await uow.get_for(AccessRequest).load_by_id(
            args.access_request_ref_id,
            allow_archived=False,
        )

        if access_request.entity.the_type not in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
            raise InputValidationError(
                f"Entity type {access_request.entity.the_type} does not support shared access"
            )

        try:
            entity_cls = self._concept_registry.get_entity_by_name(
                access_request.entity.the_type,
            )
        except ConceptNotFoundError as err:
            raise InputValidationError(
                f"Unknown entity type {access_request.entity.the_type!r}"
            ) from err

        if not issubclass(entity_cls, CrownEntity):
            raise InputValidationError(
                f"Entity type {access_request.entity.the_type} is not a crown entity"
            )

        await self.check_can_share(
            uow,
            context.user.ref_id,
            entity_cls,
            access_request.entity.ref_id,
            allow_archived=False,
        )

        rejected_request = access_request.mark_rejected(context.domain_context)
        await uow.get_for(AccessRequest).save(rejected_request)

        return RejectAccessToEntityResult(
            access_request_ref_id=rejected_request.ref_id,
        )
