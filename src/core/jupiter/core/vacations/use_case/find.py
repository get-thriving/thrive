"""The command for finding vacations."""

from collections import defaultdict
from typing import cast

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
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
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.vacations.root import Vacation
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
)


@use_case_args
class VacationFindArgs(JupiterFindCrownEntityArgs):
    """PersonFindArgs."""

    allow_archived: bool | None
    include_notes: bool | None
    include_time_event_blocks: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class VacationFindResultEntry(UseCaseResultBase):
    """PersonFindResult object."""

    vacation: Vacation
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    time_event_block: TimeEventFullDaysBlock | None


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
        workspace = context.workspace

        vacation_collection = await uow.get_for(VacationCollection).load_by_parent(
            workspace.ref_id,
        )

        accessible_vacation_ref_ids = await self.find_accessible_ref_ids(
            uow, context.user.ref_id, Vacation, allow_archived
        )
        if args.filter_ref_ids is not None:
            accessible_set = set(accessible_vacation_ref_ids)
            accessible_vacation_ref_ids = [
                ref_id for ref_id in args.filter_ref_ids if ref_id in accessible_set
            ]
        if not accessible_vacation_ref_ids:
            return VacationFindResult(entries=[])

        vacations = await uow.get_for(Vacation).find_all(
            parent_ref_id=vacation_collection.ref_id,
            allow_archived=allow_archived,
            filter_ref_ids=accessible_vacation_ref_ids,
        )

        notes_by_vacation_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get(NoteRepository).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.VACATION.value, rid)
                    for rid in [vacation.ref_id for vacation in vacations]
                ],
            )
            for note in notes:
                notes_by_vacation_ref_id[note.owner.ref_id] = note

        time_event_blocks_by_vacation_ref_id: defaultdict[
            EntityId, TimeEventFullDaysBlock
        ] = defaultdict(None)
        if include_time_event_blocks:
            time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
                workspace.ref_id,
            )
            time_event_blocks = await uow.get_for(
                TimeEventFullDaysBlock
            ).find_all_generic(
                parent_ref_id=time_event_domain.ref_id,
                allow_archived=True,
                owner=[
                    EntityLink.std(NamedEntityTag.VACATION.value, v.ref_id)
                    for v in vacations
                ],
            )
            for time_event_block in time_event_blocks:
                time_event_blocks_by_vacation_ref_id[time_event_block.owner.ref_id] = (
                    time_event_block
                )

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.VACATION.value, v.ref_id)
                    for v in vacations
                ],
            )
            tag_links_by_vacation_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in tag_links
            }
            all_tag_ref_ids: list[EntityId] = []
            for tl in tag_links:
                all_tag_ref_ids.extend(tl.ref_ids)
            if all_tag_ref_ids:
                all_tags = await uow.get_for(Tag).find_all_generic(
                    parent_ref_id=tags_domain.ref_id,
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
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=False,
            owner=[
                EntityLink.std(NamedEntityTag.VACATION.value, v.ref_id)
                for v in vacations
            ],
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
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=list(set(all_vacation_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

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
                    note=notes_by_vacation_ref_id.get(vacation.ref_id, None),
                    time_event_block=time_event_blocks_by_vacation_ref_id.get(
                        vacation.ref_id, None
                    ),
                )
                for vacation in vacations
            ]
        )
