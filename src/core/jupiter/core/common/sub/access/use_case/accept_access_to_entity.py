"""Use case for accepting an access request to a shared entity."""

from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
    refresh_domain_specific_access_for_entity,
)
from jupiter.core.common.sub.access.sub.grant.service.grant_rights_to_user import (
    GrantRightsToUserService,
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
class AcceptAccessToEntityArgs(JupiterCreateCrownEntityArgs):
    """AcceptAccessToEntity args."""

    access_request_ref_id: EntityId


@use_case_result
class AcceptAccessToEntityResult(UseCaseResultBase):
    """AcceptAccessToEntity result."""

    access_request_ref_id: EntityId


@mutation_use_case()
class AcceptAccessToEntityUseCase(
    JupiterCreateCrownEntityUseCase[
        AcceptAccessToEntityArgs, AcceptAccessToEntityResult
    ]
):
    """Use case for accepting an access request to a shared entity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: AcceptAccessToEntityArgs,
    ) -> AcceptAccessToEntityResult:
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

        accepted_request = access_request.mark_accepted(context.domain_context)
        await uow.get_for(AccessRequest).save(accepted_request)

        await GrantRightsToUserService(self._concept_registry).do_it(
            context.domain_context,
            uow,
            accepted_request.entity,
            accepted_request.user_ref_id,
            accepted_request.access_level,
        )

        await refresh_domain_specific_access_for_entity(
            context.domain_context,
            uow,
            accepted_request.entity.the_type,
            accepted_request.entity.ref_id,
        )

        return AcceptAccessToEntityResult(
            access_request_ref_id=accepted_request.ref_id,
        )
