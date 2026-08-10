"""Use case for updating an access grant on a shared entity."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
    refresh_domain_specific_access_for_entity,
)
from jupiter.core.common.sub.access.sub.grant.root import (
    AccessGrant,
)
from jupiter.core.common.sub.access.sub.grant.service.update_grant_for_entity import (
    UpdateGrantForEntityService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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
class UpdateGrantForEntityArgs(JupiterCreateCrownEntityArgs):
    """UpdateGrantForEntity args."""

    entity_type: NamedEntityTag
    entity_ref_id: EntityId
    access_grant_ref_id: EntityId
    access_level: AccessLevel


@use_case_result
class UpdateGrantForEntityResult(UseCaseResultBase):
    """UpdateGrantForEntity result."""

    access_grant_ref_id: EntityId
    access_level: AccessLevel


@mutation_use_case()
class UpdateGrantForEntityUseCase(
    JupiterCreateCrownEntityUseCase[
        UpdateGrantForEntityArgs, UpdateGrantForEntityResult
    ]
):
    """Use case for updating an access grant on a shared entity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: UpdateGrantForEntityArgs,
    ) -> UpdateGrantForEntityResult:
        """Execute the command's action."""
        if args.entity_type.value not in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
            raise InputValidationError(
                f"Entity type {args.entity_type.value} does not support shared access"
            )

        try:
            entity_cls = self._concept_registry.get_entity_by_name(
                args.entity_type.value,
            )
        except ConceptNotFoundError as err:
            raise InputValidationError(
                f"Unknown entity type {args.entity_type.value!r}"
            ) from err

        if not issubclass(entity_cls, CrownEntity):
            raise InputValidationError(
                f"Entity type {args.entity_type.value} is not a crown entity"
            )

        await self.check_can_share(
            uow,
            context.user.ref_id,
            entity_cls,
            args.entity_ref_id,
            allow_archived=False,
        )

        entity_link = EntityLink.std(args.entity_type.value, args.entity_ref_id)
        grant = await uow.get_for(AccessGrant).load_by_id(
            args.access_grant_ref_id,
            allow_archived=False,
        )
        if grant.entity != entity_link:
            raise InputValidationError("Access grant does not belong to this entity")

        await UpdateGrantForEntityService(self._concept_registry).do_it(
            context.domain_context,
            uow,
            context.user.ref_id,
            args.access_grant_ref_id,
            args.access_level,
        )

        await refresh_domain_specific_access_for_entity(
            context.domain_context,
            uow,
            args.entity_type.value,
            args.entity_ref_id,
        )

        return UpdateGrantForEntityResult(
            access_grant_ref_id=args.access_grant_ref_id,
            access_level=args.access_level,
        )
