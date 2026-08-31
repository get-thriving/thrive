"""The command for finding the persons."""

from collections import defaultdict
from typing import cast

from jupiter.core.apps.prm.sub.person.root import Person
from jupiter.core.apps.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.apps.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
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
from jupiter.framework.errors import InputValidationError
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
class PersonFindArgs(JupiterFindCrownEntityArgs):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_occasions: bool | None
    include_circle_ref_ids: bool | None
    include_notes: bool | None
    include_occasion_time_event_blocks: bool | None
    include_catch_up_inbox_tasks: bool | None
    include_occasion_inbox_tasks: bool | None
    include_tags: bool | None
    filter_person_ref_ids: list[EntityId] | None


@use_case_result_part
class PersonFindResultEntry(UseCaseResultBase):
    """A single person result."""

    person: Person
    contact: Contact
    occasions: list[Occasion]
    circle_ref_ids: list[EntityId]
    tags: list[Tag]
    location: Location | None
    note: Note | None
    occasion_time_event_blocks: list[TimeEventFullDaysBlock] | None
    catch_up_inbox_tasks: list[InboxTask] | None
    occasion_inbox_tasks: list[InboxTask] | None
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class PersonFindResult(UseCaseResultBase):
    """PersonFindResult."""

    entries: list[PersonFindResultEntry]


@readonly_use_case(WorkspaceFeature.PRM)
class PersonFindUseCase(
    JupiterFindCrownEntityUseCase[PersonFindArgs, PersonFindResult]
):
    """The command for finding the persons."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PersonFindArgs,
    ) -> PersonFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_occasions = args.include_occasions or False
        include_circle_ref_ids = args.include_circle_ref_ids or False
        include_notes = args.include_notes or False
        include_occasion_time_event_blocks = (
            args.include_occasion_time_event_blocks or False
        )
        include_catch_up_inbox_tasks = args.include_catch_up_inbox_tasks or False
        include_occasion_inbox_tasks = args.include_occasion_inbox_tasks or False
        include_tags = args.include_tags or False

        persons = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Person,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_person_ref_ids,
        )
        if not persons:
            return PersonFindResult(entries=[])

        person_owner_links = [
            EntityLink.std(NamedEntityTag.PERSON.value, p.ref_id) for p in persons
        ]

        contact_links = await uow.get(ContactLinkRepository).find_all_generic(
            allow_archived=True,
            owner=person_owner_links,
        )
        contact_link_by_person_ref_id = {
            link.owner.ref_id: link for link in contact_links
        }
        contact_ref_ids = [
            link.contacts_ref_ids[0]
            for link in contact_links
            if len(link.contacts_ref_ids) > 0
        ]
        contacts = (
            await uow.get_for(Contact).find_all_generic(
                allow_archived=True,
                ref_id=contact_ref_ids,
            )
            if contact_ref_ids
            else []
        )
        contacts_by_ref_id = {contact.ref_id: contact for contact in contacts}

        if include_occasions:
            occasions = await uow.get_for(Occasion).find_all_generic(
                person_ref_id=[p.ref_id for p in persons],
                allow_archived=allow_archived,
            )
            occasions_by_person_ref_id: dict[EntityId, list[Occasion]] = defaultdict(
                list
            )
            for o in occasions:
                occasions_by_person_ref_id[o.person.ref_id].append(o)
        else:
            occasions = []
            occasions_by_person_ref_id = defaultdict(list)

        if include_circle_ref_ids:
            # Circle links live under each person's PRM (owner workspace).
            persons_by_prm_ref_id: dict[EntityId, list[Person]] = defaultdict(list)
            for person in persons:
                persons_by_prm_ref_id[person.parent_ref_id].append(person)

            circle_ref_ids_by_person_ref_id: dict[EntityId, list[EntityId]] = (
                defaultdict(list)
            )
            for prm_ref_id, persons_in_prm in persons_by_prm_ref_id.items():
                person_ref_ids_in_prm = {p.ref_id for p in persons_in_prm}
                all_circle_links = await uow.get_for_record(PersonCircleLink).find_all(
                    prm_ref_id
                )
                for link in all_circle_links:
                    if link.person_ref_id in person_ref_ids_in_prm:
                        circle_ref_ids_by_person_ref_id[link.person_ref_id].append(
                            link.circle_ref_id
                        )
        else:
            circle_ref_ids_by_person_ref_id = defaultdict(list)

        all_notes_by_person_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=person_owner_links,
            )
            for n in notes:
                all_notes_by_person_ref_id[cast(EntityId, n.owner.ref_id)] = n

        if include_occasion_time_event_blocks and len(occasions) > 0:
            occasion_time_event_blocks = await uow.get_for(
                TimeEventFullDaysBlock
            ).find_all_generic(
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.OCCASION.value, o.ref_id)
                    for o in occasions
                ],
            )
        else:
            occasion_time_event_blocks = None

        if include_catch_up_inbox_tasks:
            catch_up_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                allow_archived=True,
                owner=person_owner_links,
            )
        else:
            catch_up_inbox_tasks = None

        if include_occasion_inbox_tasks and len(occasions) > 0:
            birthday_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.OCCASION.value, o.ref_id)
                    for o in occasions
                ],
            )
        else:
            birthday_inbox_tasks = None

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=person_owner_links,
            )
            tag_links_by_person_ref_id = {
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
            tag_links_by_person_ref_id = {}

        location_links = await uow.get_for(LocationLink).find_all_generic(
            allow_archived=False,
            owner=person_owner_links,
        )
        person_location_ref_id = {
            link.owner.ref_id: location_ref_id
            for link in location_links
            if (location_ref_id := link.location_ref_id) is not None
        }
        all_person_location_ref_ids = list(person_location_ref_id.values())
        locations = []
        if all_person_location_ref_ids:
            locations = await uow.get_for(Location).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_person_location_ref_ids)),
            )
        locations_by_ref_id = {loc.ref_id: loc for loc in locations}

        owner_ref_ids_by_person_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                person_owner_links,
            )
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_person_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(person_owner_links, context.user.ref_id)
        access_status_by_person_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        entries: list[PersonFindResultEntry] = []
        for p in persons:
            if p.ref_id not in contact_link_by_person_ref_id:
                raise InputValidationError(
                    f"Person #{p.ref_id} does not have a linked contact"
                )
            contact_link = contact_link_by_person_ref_id[p.ref_id]
            if len(contact_link.contacts_ref_ids) == 0:
                raise InputValidationError(f"Person #{p.ref_id} contact link is empty")
            contact_ref_id = contact_link.contacts_ref_ids[0]
            if contact_ref_id not in contacts_by_ref_id:
                raise InputValidationError(
                    f"Person #{p.ref_id} linked contact could not be loaded"
                )

            entries.append(
                PersonFindResultEntry(
                    person=p,
                    contact=contacts_by_ref_id[contact_ref_id],
                    occasions=occasions_by_person_ref_id.get(p.ref_id, []),
                    circle_ref_ids=circle_ref_ids_by_person_ref_id.get(p.ref_id, []),
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_person_ref_id[p.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if p.ref_id in tag_links_by_person_ref_id
                        else []
                    ),
                    location=(
                        locations_by_ref_id.get(person_location_ref_id[p.ref_id])
                        if p.ref_id in person_location_ref_id
                        else None
                    ),
                    note=all_notes_by_person_ref_id.get(p.ref_id, None),
                    occasion_time_event_blocks=(
                        [
                            it
                            for it in occasion_time_event_blocks
                            if it.owner.ref_id
                            in {o.ref_id for o in occasions_by_person_ref_id[p.ref_id]}
                        ]
                        if occasion_time_event_blocks is not None
                        else None
                    ),
                    catch_up_inbox_tasks=(
                        [
                            it
                            for it in catch_up_inbox_tasks
                            if it.owner.ref_id == p.ref_id
                        ]
                        if catch_up_inbox_tasks is not None
                        else None
                    ),
                    occasion_inbox_tasks=(
                        [
                            it
                            for it in birthday_inbox_tasks
                            if it.owner.ref_id
                            in {o.ref_id for o in occasions_by_person_ref_id[p.ref_id]}
                        ]
                        if birthday_inbox_tasks is not None
                        else None
                    ),
                    owner=owners_by_ref_id[owner_ref_ids_by_person_ref_id[p.ref_id]],
                    access_status=access_status_by_person_ref_id[p.ref_id],
                )
            )

        return PersonFindResult(
            entries=entries,
        )
