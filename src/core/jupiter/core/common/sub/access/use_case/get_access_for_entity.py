"""Use case for loading access statuses and grants for an entity."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.root import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
    AccessGrant,
    AccessGrantRepository,
)
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptNotFoundError
from jupiter.framework.entity import CrownEntity
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class GetAccessForEntityArgs(UseCaseArgsBase):
    """GetAccessForEntity args."""

    entity_type: NamedEntityTag
    entity_ref_id: EntityId


@use_case_result_part
class GetAccessForEntityEntry(UseCaseResultBase):
    """A single access status and grant for an entity."""

    access_status: AccessStatus
    access_grant: AccessGrant


@use_case_result
class GetAccessForEntityResult(UseCaseResultBase):
    """GetAccessForEntity result."""

    entries: list[GetAccessForEntityEntry]
    users: list[UserLight]


@readonly_use_case()
class GetAccessForEntityUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        GetAccessForEntityArgs, GetAccessForEntityResult
    ]
):
    """Use case for loading access statuses and grants for an entity."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: GetAccessForEntityArgs,
    ) -> GetAccessForEntityResult:
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

        await CheckForAclService().do_it(
            uow,
            entity_cls,
            args.entity_ref_id,
            context.user.ref_id,
            AccessLevel.READER,
            allow_archived=True,
        )

        entity_link = EntityLink.std(args.entity_type.value, args.entity_ref_id)
        statuses = await uow.get(AccessStatusRepository).find_all_for_entity(
            entity_link,
        )

        grant_ref_ids = list({status.access_grant_ref_id for status in statuses})
        grants_by_ref_id: dict[EntityId, AccessGrant] = {}
        grant_repository = uow.get(AccessGrantRepository)
        for grant_ref_id in grant_ref_ids:
            grants_by_ref_id[grant_ref_id] = await grant_repository.load_by_id(
                grant_ref_id,
            )

        entries = [
            GetAccessForEntityEntry(
                access_status=status,
                access_grant=grants_by_ref_id[status.access_grant_ref_id],
            )
            for status in statuses
            if status.access_grant_ref_id in grants_by_ref_id
        ]
        entries.sort(
            key=lambda entry: (
                -entry.access_status.access_level.allows(AccessLevel.OWNER),
                entry.access_status.user_ref_id.as_int(),
            )
        )

        user_ref_ids = list({status.user_ref_id for status in statuses})
        users = await uow.get(UserRepository).find_all_light_by_ref_ids(user_ref_ids)

        return GetAccessForEntityResult(
            entries=entries,
            users=users,
        )
