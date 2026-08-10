"""Find entities shared with the current user, and entities they have shared."""

from collections import defaultdict
from typing import Final

from jupiter.core.app import AppCore
from jupiter.core.common.entity_summary import EntitySummary
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.core.common.sub.access.sub.grant.root import (
    AccessGrant,
    AccessGrantRepository,
)
from jupiter.core.common.sub.access.sub.invite.root import (
    AccessInvite,
    AccessInviteRepository,
)
from jupiter.core.common.sub.access.sub.request.root import (
    AccessRequest,
    AccessRequestRepository,
)
from jupiter.core.common.sub.access.sub.request.status import AccessRequestStatus
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
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
from jupiter.framework.entity import CrownEntity, LeafSupportEntity
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)

# Cascade-only types are not useful collaboration entry points.
_COLLABORATION_ENTITY_TYPES: Final[frozenset[str]] = frozenset(
    ALLOWED_SHARED_ACCESS_OWNER_TYPES
    - {
        NamedEntityTag.TIME_PLAN_ACTIVITY.value,
        NamedEntityTag.SMART_LIST_ITEM.value,
        NamedEntityTag.METRIC_ENTRY.value,
    }
)


@use_case_args
class FindCollaborationsArgs(UseCaseArgsBase):
    """FindCollaborations args."""

    allow_archived: bool | None


@use_case_result_part
class CollaborationEntry(UseCaseResultBase):
    """One shared entity and the other person involved in the grant."""

    entity: EntitySummary
    access_grant: AccessGrant
    # Shared with you: the owner. Shared by you: the invitee.
    subject: UserLight


@use_case_result_part
class CollaborationRequestEntry(UseCaseResultBase):
    """One access request involving the current user."""

    entity: EntitySummary
    access_request: AccessRequest
    # Incoming: the requester. Outgoing: the entity owner.
    subject: UserLight


@use_case_result_part
class CollaborationInviteEntry(UseCaseResultBase):
    """One unacknowledged access invite for the current user."""

    entity: EntitySummary
    access_invite: AccessInvite
    access_grant: AccessGrant
    # The owner who invited you.
    subject: UserLight


@use_case_result
class FindCollaborationsResult(UseCaseResultBase):
    """Collaboration lists for the current user."""

    invites: list[CollaborationInviteEntry]
    shared_with_me: list[CollaborationEntry]
    shared_by_me: list[CollaborationEntry]
    incoming_requests: list[CollaborationRequestEntry]
    outgoing_requests: list[CollaborationRequestEntry]
    users: list[UserLight]


@readonly_use_case(exclude_component=[AppCore.CLI])
class FindCollaborationsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        FindCollaborationsArgs, FindCollaborationsResult
    ]
):
    """List direct shares involving the current user, newest first."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: FindCollaborationsArgs,
    ) -> FindCollaborationsResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        user_ref_id = context.user.ref_id
        grant_repository = uow.get(AccessGrantRepository)
        request_repository = uow.get(AccessRequestRepository)
        invite_repository = uow.get(AccessInviteRepository)

        my_grants = await grant_repository.find_all_for_user(
            user_ref_id,
            allow_archived=False,
        )

        shared_with_me_grants = [
            grant
            for grant in my_grants
            if grant.access_level != AccessLevel.OWNER
            and grant.access_level.is_invitable
            and grant.entity.the_type in _COLLABORATION_ENTITY_TYPES
        ]

        invite_candidate_grant_ref_ids = [
            grant.ref_id for grant in shared_with_me_grants
        ]
        my_invites = await invite_repository.find_all_for_grants(
            invite_candidate_grant_ref_ids,
            allow_archived=False,
        )
        grants_by_ref_id = {grant.ref_id: grant for grant in shared_with_me_grants}
        invite_entities = [
            invite
            for invite in my_invites
            if invite.access_grant_ref_id in grants_by_ref_id
        ]

        owned_entity_links = [
            grant.entity
            for grant in my_grants
            if grant.access_level == AccessLevel.OWNER
            and grant.entity.the_type in _COLLABORATION_ENTITY_TYPES
        ]
        grants_on_owned = await grant_repository.find_all_for_entities(
            owned_entity_links,
            allow_archived=False,
        )
        shared_by_me_grants = [
            grant
            for grant in grants_on_owned
            if grant.access_level != AccessLevel.OWNER
            and grant.access_level.is_invitable
            and grant.user_ref_id != user_ref_id
        ]

        requests_on_owned = await request_repository.find_all_for_entities(
            owned_entity_links,
            allow_archived=False,
        )
        incoming_request_entities = [
            request
            for request in requests_on_owned
            if request.status == AccessRequestStatus.REQUESTED
            and request.entity.the_type in _COLLABORATION_ENTITY_TYPES
            and request.user_ref_id != user_ref_id
        ]

        my_requests = await request_repository.find_all_for_user(
            user_ref_id,
            allow_archived=False,
        )
        outgoing_request_entities = [
            request
            for request in my_requests
            if request.status == AccessRequestStatus.REQUESTED
            and request.entity.the_type in _COLLABORATION_ENTITY_TYPES
        ]

        all_entity_links = list(
            {
                link: None
                for link in (
                    [
                        grants_by_ref_id[invite.access_grant_ref_id].entity
                        for invite in invite_entities
                    ]
                    + [grant.entity for grant in shared_with_me_grants]
                    + [grant.entity for grant in shared_by_me_grants]
                    + [request.entity for request in incoming_request_entities]
                    + [request.entity for request in outgoing_request_entities]
                )
            }.keys()
        )
        summaries_by_link = await self._load_entity_summaries(
            uow,
            all_entity_links,
            allow_archived=allow_archived,
        )

        owner_ref_ids_by_entity_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                [grant.entity for grant in shared_with_me_grants]
                + [
                    grants_by_ref_id[invite.access_grant_ref_id].entity
                    for invite in invite_entities
                ]
                + [request.entity for request in outgoing_request_entities],
            )
        )

        subject_user_ref_ids: set[EntityId] = set()
        for grant in shared_with_me_grants:
            owner_ref_id = owner_ref_ids_by_entity_ref_id.get(grant.entity.ref_id)
            if owner_ref_id is not None:
                subject_user_ref_ids.add(owner_ref_id)
        for invite in invite_entities:
            grant = grants_by_ref_id[invite.access_grant_ref_id]
            owner_ref_id = owner_ref_ids_by_entity_ref_id.get(grant.entity.ref_id)
            if owner_ref_id is not None:
                subject_user_ref_ids.add(owner_ref_id)
        for grant in shared_by_me_grants:
            subject_user_ref_ids.add(grant.user_ref_id)
        for request in incoming_request_entities:
            subject_user_ref_ids.add(request.user_ref_id)
        for request in outgoing_request_entities:
            owner_ref_id = owner_ref_ids_by_entity_ref_id.get(request.entity.ref_id)
            if owner_ref_id is not None:
                subject_user_ref_ids.add(owner_ref_id)

        users = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(subject_user_ref_ids)
        )
        users_by_ref_id = {user.ref_id: user for user in users}

        invites: list[CollaborationInviteEntry] = []
        for invite in invite_entities:
            grant = grants_by_ref_id[invite.access_grant_ref_id]
            summary = summaries_by_link.get(grant.entity)
            owner_ref_id = owner_ref_ids_by_entity_ref_id.get(grant.entity.ref_id)
            if summary is None or owner_ref_id is None:
                continue
            subject = users_by_ref_id.get(owner_ref_id)
            if subject is None:
                continue
            invites.append(
                CollaborationInviteEntry(
                    entity=summary,
                    access_invite=invite,
                    access_grant=grant,
                    subject=subject,
                )
            )

        shared_with_me: list[CollaborationEntry] = []
        for grant in shared_with_me_grants:
            summary = summaries_by_link.get(grant.entity)
            owner_ref_id = owner_ref_ids_by_entity_ref_id.get(grant.entity.ref_id)
            if summary is None or owner_ref_id is None:
                continue
            subject = users_by_ref_id.get(owner_ref_id)
            if subject is None:
                continue
            shared_with_me.append(
                CollaborationEntry(
                    entity=summary,
                    access_grant=grant,
                    subject=subject,
                )
            )

        shared_by_me: list[CollaborationEntry] = []
        for grant in shared_by_me_grants:
            summary = summaries_by_link.get(grant.entity)
            subject = users_by_ref_id.get(grant.user_ref_id)
            if summary is None or subject is None:
                continue
            shared_by_me.append(
                CollaborationEntry(
                    entity=summary,
                    access_grant=grant,
                    subject=subject,
                )
            )

        incoming_requests: list[CollaborationRequestEntry] = []
        for request in incoming_request_entities:
            summary = summaries_by_link.get(request.entity)
            subject = users_by_ref_id.get(request.user_ref_id)
            if summary is None or subject is None:
                continue
            incoming_requests.append(
                CollaborationRequestEntry(
                    entity=summary,
                    access_request=request,
                    subject=subject,
                )
            )

        outgoing_requests: list[CollaborationRequestEntry] = []
        for request in outgoing_request_entities:
            summary = summaries_by_link.get(request.entity)
            owner_ref_id = owner_ref_ids_by_entity_ref_id.get(request.entity.ref_id)
            if summary is None or owner_ref_id is None:
                continue
            subject = users_by_ref_id.get(owner_ref_id)
            if subject is None:
                continue
            outgoing_requests.append(
                CollaborationRequestEntry(
                    entity=summary,
                    access_request=request,
                    subject=subject,
                )
            )

        invites.sort(
            key=lambda entry: entry.access_invite.last_modified_time,
            reverse=True,
        )
        shared_with_me.sort(
            key=lambda entry: entry.access_grant.last_modified_time,
            reverse=True,
        )
        shared_by_me.sort(
            key=lambda entry: entry.access_grant.last_modified_time,
            reverse=True,
        )
        incoming_requests.sort(
            key=lambda entry: entry.access_request.last_modified_time,
            reverse=True,
        )
        outgoing_requests.sort(
            key=lambda entry: entry.access_request.last_modified_time,
            reverse=True,
        )

        return FindCollaborationsResult(
            invites=invites,
            shared_with_me=shared_with_me,
            shared_by_me=shared_by_me,
            incoming_requests=incoming_requests,
            outgoing_requests=outgoing_requests,
            users=sorted(users, key=lambda user: str(user.name)),
        )

    async def _load_entity_summaries(
        self,
        uow: DomainUnitOfWork,
        entity_links: list[EntityLink],
        allow_archived: bool,
    ) -> dict[EntityLink, EntitySummary]:
        """Load crown entity summaries keyed by entity link."""
        if not entity_links:
            return {}

        ref_ids_by_type: dict[str, list[EntityId]] = defaultdict(list)
        for link in entity_links:
            ref_ids_by_type[link.the_type].append(link.ref_id)

        summaries: dict[EntityLink, EntitySummary] = {}
        for entity_type_name, ref_ids in ref_ids_by_type.items():
            try:
                entity_cls = self._concept_registry.get_entity_by_name(
                    entity_type_name,
                )
            except ConceptNotFoundError:
                continue
            if not issubclass(entity_cls, CrownEntity) or issubclass(
                entity_cls, LeafSupportEntity
            ):
                continue

            entities = await uow.get_for(entity_cls).find_all_generic(
                parent_ref_id=None,
                allow_archived=allow_archived,
                ref_id=list(set(ref_ids)),
            )
            for entity in entities:
                link = EntityLink.std(entity_type_name, entity.ref_id)
                summaries[link] = EntitySummary.from_entity(entity)

        return summaries
