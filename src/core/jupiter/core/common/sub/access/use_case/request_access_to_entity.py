"""Use case for requesting access to a shared entity."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.root import AccessDomainRepository
from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.core.common.sub.access.sub.grant.principal_type import PrincipalType
from jupiter.core.common.sub.access.sub.grant.service.load_user_that_owns_entity import (
    LoadUserThatOwnsEntityService,
)
from jupiter.core.common.sub.access.sub.request.root import (
    AccessRequest,
    AccessRequestRepository,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
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
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class RequestAccessToEntityArgs(UseCaseArgsBase):
    """RequestAccessToEntity args."""

    entity_type: NamedEntityTag
    entity_ref_id: EntityId
    access_level: AccessLevel


@use_case_result
class RequestAccessToEntityResult(UseCaseResultBase):
    """RequestAccessToEntity result."""

    access_request_ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class RequestAccessToEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        RequestAccessToEntityArgs, RequestAccessToEntityResult
    ]
):
    """Use case for requesting access to a shared entity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: RequestAccessToEntityArgs,
    ) -> RequestAccessToEntityResult:
        """Execute the command's action."""
        if not args.access_level.is_invitable:
            raise InputValidationError(
                "Access requests must use reader, commenter, or writer access level"
            )

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

        await uow.get_for(entity_cls).load_by_id(
            args.entity_ref_id,
            allow_archived=False,
        )

        entity_link = EntityLink.std(args.entity_type.value, args.entity_ref_id)
        owner = await LoadUserThatOwnsEntityService().do_it(uow, entity_link)
        if owner.ref_id == context.user.ref_id:
            raise InputValidationError("You already own this entity")

        access_domain = await uow.get(AccessDomainRepository).load_the_access_domain()
        access_request = await uow.get(AccessRequestRepository).upsert(
            AccessRequest.new_access_request(
                context.domain_context,
                access_domain.ref_id,
                entity=entity_link,
                principal=PrincipalType.USER,
                user_ref_id=context.user.ref_id,
                access_level=args.access_level,
            )
        )

        return RequestAccessToEntityResult(
            access_request_ref_id=access_request.ref_id,
        )
