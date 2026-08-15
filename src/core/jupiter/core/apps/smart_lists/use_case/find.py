"""The command for finding smart lists."""

from collections import defaultdict
from typing import cast

from jupiter.core.apps.smart_lists.root import SmartList
from jupiter.core.apps.smart_lists.sub.item.root import SmartListItem
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.name import TagName
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_reader import AclCrownEntityReader
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
from jupiter.framework.entity import NoFilter
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
class SmartListFindArgs(JupiterFindCrownEntityArgs):
    """SmartListFind args."""

    allow_archived: bool | None
    include_notes: bool | None
    include_tags: bool | None
    include_items: bool | None
    include_item_notes: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_is_done: bool | None
    filter_tag_names: list[TagName] | None
    filter_tag_ref_id: list[EntityId] | None
    filter_item_ref_id: list[EntityId] | None


@use_case_result_part
class SmartListFindResponseEntry(UseCaseResultBase):
    """A single entry in the LoadAllSmartListsResponse."""

    smart_list: SmartList
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    smart_list_items: list[SmartListItem] | None
    smart_list_item_generic_tags: dict[EntityId, list[Tag]] | None
    smart_list_item_notes: list[Note] | None
    owner: UserLight
    access_status: AccessStatus


@use_case_result
class SmartListFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[SmartListFindResponseEntry]


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListFindUseCase(
    JupiterFindCrownEntityUseCase[SmartListFindArgs, SmartListFindResult]
):
    """The command for finding smart lists."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: SmartListFindArgs,
    ) -> SmartListFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_tags = args.include_tags or False
        include_items = args.include_items or False
        include_item_notes = args.include_item_notes or False

        smart_lists = await self.find_all_entities(
            uow,
            context.user.ref_id,
            SmartList,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )
        if not smart_lists:
            return SmartListFindResult(entries=[])

        smart_list_owner_links = [
            EntityLink.std(NamedEntityTag.SMART_LIST.value, smart_list.ref_id)
            for smart_list in smart_lists
        ]

        all_notes_by_smart_list_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                allow_archived=True,
                owner=smart_list_owner_links,
            )
            for note in notes:
                all_notes_by_smart_list_ref_id[note.owner.ref_id] = note

        if include_tags:
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=smart_list_owner_links,
            )
            tag_links_by_smart_list_ref_id = {
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
            tag_links_by_smart_list_ref_id = {}

        # Load contacts linked to smart lists
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            allow_archived=False,
            owner=[
                EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, sl.ref_id)
                for sl in smart_lists
            ],
        )
        smart_list_contacts_by_ref_id = {
            link.owner.ref_id: link.contacts_ref_ids for link in contact_links
        }
        all_smart_list_contact_ref_ids = []
        for contact_ref_ids in smart_list_contacts_by_ref_id.values():
            all_smart_list_contact_ref_ids.extend(contact_ref_ids)
        contacts = []
        if all_smart_list_contact_ref_ids:
            contacts = await uow.get_for(Contact).find_all_generic(
                allow_archived=False,
                ref_id=list(set(all_smart_list_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        if include_items:
            smart_list_items_by_smart_list_ref_ids = {}
            item_reader = AclCrownEntityReader(uow, context.user.ref_id)
            for smart_list in smart_lists:
                smart_list_items = await uow.get_for(SmartListItem).find_all_generic(
                    parent_ref_id=smart_list.ref_id,
                    allow_archived=allow_archived,
                    ref_id=args.filter_item_ref_id,
                    is_done=(
                        args.filter_is_done
                        if args.filter_is_done is not None
                        else NoFilter()
                    ),
                )
                smart_list_items = await item_reader.retain_accessible_entities(
                    SmartListItem,
                    smart_list_items,
                    allow_archived=allow_archived,
                )
                for smart_list_item in smart_list_items:
                    if (
                        smart_list_item.smart_list.ref_id
                        not in smart_list_items_by_smart_list_ref_ids
                    ):
                        smart_list_items_by_smart_list_ref_ids[
                            smart_list_item.smart_list.ref_id
                        ] = [smart_list_item]
                    else:
                        smart_list_items_by_smart_list_ref_ids[
                            smart_list_item.smart_list.ref_id
                        ].append(smart_list_item)
        else:
            smart_list_items_by_smart_list_ref_ids = None

        all_items = []
        if include_tags and smart_list_items_by_smart_list_ref_ids is not None:
            all_items = [
                it
                for items in smart_list_items_by_smart_list_ref_ids.values()
                for it in items
            ]
            item_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, it.ref_id)
                    for it in all_items
                ],
            )
            item_tag_links_by_item_ref_id = {
                cast(EntityId, tl.owner.ref_id): tl for tl in item_tag_links
            }
            all_item_tag_ref_ids: list[EntityId] = []
            for tl in item_tag_links:
                all_item_tag_ref_ids.extend(tl.ref_ids)
            if all_item_tag_ref_ids:
                all_item_tags = await uow.get_for(Tag).find_all_generic(
                    allow_archived=False,
                    ref_id=list(set(all_item_tag_ref_ids)),
                )
                all_item_tags_by_ref_id = {t.ref_id: t for t in all_item_tags}
            else:
                all_item_tags_by_ref_id = {}
        else:
            all_item_tags_by_ref_id = {}
            item_tag_links_by_item_ref_id = {}

        all_notes_by_smart_list_item_ref_id: defaultdict[EntityId, Note] = defaultdict(
            None
        )
        if include_item_notes:
            if smart_list_items_by_smart_list_ref_ids is not None:
                item_owner_links = [
                    EntityLink.std(NamedEntityTag.SMART_LIST_ITEM.value, it.ref_id)
                    for items in smart_list_items_by_smart_list_ref_ids.values()
                    for it in items
                ]
                all_smart_list_item_notes = (
                    await uow.get_for(Note).find_all_generic(
                        allow_archived=True,
                        owner=item_owner_links,
                    )
                    if item_owner_links
                    else []
                )
            else:
                all_smart_list_item_notes = []
            for note in all_smart_list_item_notes:
                all_notes_by_smart_list_item_ref_id[note.owner.ref_id] = note

        owner_ref_ids_by_smart_list_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(
                uow,
                smart_list_owner_links,
            )
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(set(owner_ref_ids_by_smart_list_ref_id.values()))
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(smart_list_owner_links, context.user.ref_id)
        access_status_by_smart_list_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

        return SmartListFindResult(
            entries=[
                SmartListFindResponseEntry(
                    smart_list=sl,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_smart_list_ref_id[sl.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if sl.ref_id in tag_links_by_smart_list_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in smart_list_contacts_by_ref_id.get(
                            sl.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    note=all_notes_by_smart_list_ref_id.get(sl.ref_id, None),
                    smart_list_items=(
                        smart_list_items_by_smart_list_ref_ids.get(
                            sl.ref_id,
                            [],
                        )
                        if smart_list_items_by_smart_list_ref_ids is not None
                        else None
                    ),
                    smart_list_item_generic_tags=(
                        {
                            it.ref_id: [
                                all_item_tags_by_ref_id[rid]
                                for rid in item_tag_links_by_item_ref_id[
                                    it.ref_id
                                ].ref_ids
                                if rid in all_item_tags_by_ref_id
                            ]
                            for it in all_items
                            if it.ref_id in item_tag_links_by_item_ref_id
                        }
                    ),
                    smart_list_item_notes=(
                        list(all_notes_by_smart_list_item_ref_id.values())
                        if include_item_notes
                        else None
                    ),
                    owner=owners_by_ref_id[
                        owner_ref_ids_by_smart_list_ref_id[sl.ref_id]
                    ],
                    access_status=access_status_by_smart_list_ref_id[sl.ref_id],
                )
                for sl in smart_lists
            ],
        )
