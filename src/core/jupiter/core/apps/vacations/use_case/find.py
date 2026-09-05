"""The command for finding vacations."""

from collections import defaultdict
from typing import cast

from jupiter.core.apps.vacations.root import Vacation
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.locations.sub.link.root import LocationLink
from jupiter.core.common.sub.locations.sub.location.root import Location
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class VacationFindArgs(JupiterFindCrownEntityArgs):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_notes: bool | None
    include_time_event_blocks: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class VacationFindResultEntry(UseCaseResultBase):
    """PersonFindResult object."""

    vacation: Vacation
    tags: list[Tag]
    contacts: list[Contact]
    locations: list[Location]
    note: Note | None
    time_event_block: TimeEventFullDaysBlock | None
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class VacationFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[VacationFindResultEntry]


@readonly_use_case(WorkspaceFeature.VACATIONS)
class VacationFindUseCase(
    JupiterFindCrownEntityUseCase[VacationFindArgs, VacationFindResult]
):
    """The command for finding vacations."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: VacationFindArgs,
    ) -> VacationFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_time_event_blocks = args.include_time_event_blocks or False
        include_tags = args.include_tags or False

        vacations = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Vacation,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )
        if not vacations:
            return VacationFindResult(entries=[])

        vacation_owner_links = [
            EntityLink.std(NamedEntityTag.VACATION.value, vacation.ref_id)
            for vacation in vacations
        ]

        notes_by_vacation_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=vacation_owner_links,
            )
            for note in notes:
                notes_by_vacation_ref_id[note.owner.ref_id] = note

        time_event_blocks_by_vacation_ref_id: defaultdict[
            EntityId, TimeEventFullDaysBlock
        ] = defaultdict(None)
        if include_time_event_blocks:
            time_event_blocks = await uow.get_for(
                TimeEventFullDaysBlock
            ).find_all_generic(
                allow_archived=True,
                owner=vacation_owner_links,
            )
            for time_event_block in time_event_blocks:
                time_event_blocks_by_vacation_ref_id[time_event_block.owner.ref_id] = (
                    time_event_block
                )

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=vacation_owner_links,
            )
            tag_links_by_vacation_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(all_tag_ref_ids)),
                )
                all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            else:
                all_tags_by_ref_id = {}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_vacation_ref_id = {}

        # Load contacts linked to vacations
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            allow_archived=False,
            owner=vacation_owner_links,
        )
        vacation_contacts_by_ref_id = {
            link.owner.ref_id: link.contacts_ref_ids for link in contact_links
        }
        all_vacation_contact_ref_ids = []
        for contact_ref_ids in vacation_contacts_by_ref_id.values():
            all_vacation_contact_ref_ids.extend(contact_ref_ids)
        contacts = []
        if all_vacation_contact_ref_ids:
            contacts = await uow.get_for(Contact).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_vacation_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        location_links = await uow.get_for(LocationLink).find_all_generic(
            allow_archived=False,
            owner=vacation_owner_links,
        )
        vacation_locations_ref_ids = {
            link.owner.ref_id: link.locations_ref_ids for link in location_links
        }
        all_vacation_location_ref_ids = []
        for location_ref_ids in vacation_locations_ref_ids.values():
            all_vacation_location_ref_ids.extend(location_ref_ids)
        locations = []
        if all_vacation_location_ref_ids:
            locations = await uow.get_for(Location).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_vacation_location_ref_ids)),
            )
        locations_by_ref_id = {loc.ref_id: loc for loc in locations}

        owner_ref_ids_by_vacation_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                vacation_owner_links,
            )
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_vacation_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(vacation_owner_links, context.user.ref_id)
        access_status_by_vacation_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        return VacationFindResult(
            entries=[
                VacationFindResultEntry(
                    vacation=vacation,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_vacation_ref_id[
                                vacation.ref_id
                            ].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if vacation.ref_id in tag_links_by_vacation_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in vacation_contacts_by_ref_id.get(
                            vacation.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    locations=[
                        locations_by_ref_id[location_ref_id]
                        for location_ref_id in vacation_locations_ref_ids.get(
                            vacation.ref_id, []
                        )
                        if location_ref_id in locations_by_ref_id
                    ],
                    note=notes_by_vacation_ref_id.get(vacation.ref_id, None),
                    time_event_block=time_event_blocks_by_vacation_ref_id.get(
                        vacation.ref_id, None
                    ),
                    owner=owners_by_ref_id[
                        owner_ref_ids_by_vacation_ref_id[vacation.ref_id]
                    ],
                    access_status=access_status_by_vacation_ref_id[vacation.ref_id],
                )
                for vacation in vacations
            ]
        )
