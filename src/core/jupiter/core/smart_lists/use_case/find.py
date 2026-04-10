"""The command for finding smart lists."""

from collections import defaultdict

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.name import TagName
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.smart_lists.collection import (
    SmartListCollection,
)
from jupiter.core.smart_lists.root import SmartList
from jupiter.core.smart_lists.sub.item.root import SmartListItem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class SmartListFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

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


@use_case_result
class SmartListFindResult(UseCaseResultBase):
    """PersonFindResult object."""

    entries: list[SmartListFindResponseEntry]


@readonly_use_case(WorkspaceFeature.SMART_LISTS)
class SmartListFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[SmartListFindArgs, SmartListFindResult]
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

        workspace = context.workspace

        smart_list_collection = await uow.get_for(SmartListCollection).load_by_parent(
            workspace.ref_id,
        )

        smart_lists = await uow.get_for(SmartList).find_all(
            parent_ref_id=smart_list_collection.ref_id,
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        all_notes_by_smart_list_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            all_smart_list_notes = await uow.get(
                NoteRepository
            ).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owners=[
                    EntityLink.std(NamedEntityTag.SMART_LIST.value, rid)
                    for rid in [sl.ref_id for sl in smart_lists]
                ],
            )
            for note in all_smart_list_notes:
                all_notes_by_smart_list_ref_id[note.owner.ref_id] = note

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SMART_LIST,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SMART_LIST,
                source_entity_ref_id=[sl.ref_id for sl in smart_lists],
            )
            tag_links_by_smart_list_ref_id = {
                t.source_entity_ref_id: t for t in tag_links
            }
        else:
            all_tags_by_ref_id = {}
            tag_links_by_smart_list_ref_id = {}

        # Load contacts linked to smart lists
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
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
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=list(set(all_smart_list_contact_ref_ids)),
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        if include_items:
            smart_list_items_by_smart_list_ref_ids = {}
            for smart_list in smart_lists:
                for smart_list_item in await uow.get_for(
                    SmartListItem
                ).find_all_generic(
                    parent_ref_id=smart_list.ref_id,
                    allow_archived=allow_archived,
                    ref_id=args.filter_item_ref_id,
                    is_done=(
                        args.filter_is_done
                        if args.filter_is_done is not None
                        else NoFilter()
                    ),
                ):
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
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_item_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.SMART_LIST_ITEM,
            )
            all_item_tags_by_ref_id = {t.ref_id: t for t in all_item_tags}
            item_tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.SMART_LIST_ITEM,
                source_entity_ref_id=[it.ref_id for it in all_items],
            )
            item_tag_links_by_item_ref_id = {
                tl.source_entity_ref_id: tl for tl in item_tag_links
            }
        else:
            all_item_tags_by_ref_id = {}
            item_tag_links_by_item_ref_id = {}

        all_notes_by_smart_list_item_ref_id: defaultdict[EntityId, Note] = defaultdict(
            None
        )
        if include_item_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            all_smart_list_item_notes = await uow.get(
                NoteRepository
            ).find_all_for_note_collection(
                note_collection_ref_id=note_collection.ref_id,
                allow_archived=True,
                filter_owner_types=[NamedEntityTag.SMART_LIST_ITEM.value],
            )
            for note in all_smart_list_item_notes:
                all_notes_by_smart_list_item_ref_id[note.owner.ref_id] = note

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
                )
                for sl in smart_lists
            ],
        )
