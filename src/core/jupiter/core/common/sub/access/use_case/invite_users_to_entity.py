"""Use case for inviting users to a shared entity."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.root import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.core.common.sub.access.sub.grant.service.grant_rights_to_user import (
    GrantRightsToUserService,
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
class InviteUsersToEntityArgs(JupiterCreateCrownEntityArgs):
    """InviteUsersToEntity args."""

    entity_type: NamedEntityTag
    entity_ref_id: EntityId
    user_ref_ids: set[EntityId]
    access_level: AccessLevel


@use_case_result
class InviteUsersToEntityResult(UseCaseResultBase):
    """InviteUsersToEntity result."""

    invited_user_ref_ids: list[EntityId]


@mutation_use_case()
class InviteUsersToEntityUseCase(
    JupiterCreateCrownEntityUseCase[InviteUsersToEntityArgs, InviteUsersToEntityResult]
):
    """Use case for inviting users to a shared entity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: InviteUsersToEntityArgs,
    ) -> InviteUsersToEntityResult:
        """Execute the command's action."""
        if len(args.user_ref_ids) == 0:
            raise InputValidationError("You must specify at least one user to invite")

        if not args.access_level.is_invitable:
            raise InputValidationError(
                "Invites must use reader, commenter, or writer access level"
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

        await self.check_can_share(
            uow,
            context.user.ref_id,
            entity_cls,
            args.entity_ref_id,
            allow_archived=False,
        )

        entity_link = EntityLink.std(args.entity_type.value, args.entity_ref_id)
        grant_service = GrantRightsToUserService(self._concept_registry)
        invited_user_ref_ids: list[EntityId] = []

        for user_ref_id in args.user_ref_ids:
            if user_ref_id == context.user.ref_id:
                continue

            await grant_service.do_it(
                context.domain_context,
                uow,
                entity_link,
                user_ref_id,
                args.access_level,
            )
            invited_user_ref_ids.append(user_ref_id)

        return InviteUsersToEntityResult(
            invited_user_ref_ids=invited_user_ref_ids,
        )
