"""Shared service for loading a directory listing."""

from typing import cast

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.dir.use_case.load import (
    DirLoadResult,
    DirLoadResultEntry,
    DirLoadSubdirEntry,
)
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork


class DirLoadService:
    """Shared service for loading a directory and its immediate children."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        doc_collection_ref_id: EntityId,
        dir_entity: Dir,
        *,
        allow_archived: bool = False,
        filter_ref_ids: list[EntityId] | None = None,
        include_publish_entity: bool = True,
    ) -> DirLoadResult:
        """Load a directory with docs, child dirs, and optional publish entity."""
        dir_entity = await uow.get_for(Dir).load_by_id(
            dir_entity.ref_id,
            allow_archived=allow_archived,
        )
        if dir_entity.doc_collection.ref_id != doc_collection_ref_id:
            raise InputValidationError("Directory is not in this workspace.")

        subdirs_raw = await uow.get_for(Dir).find_all_generic(
            parent_ref_id=doc_collection_ref_id,
            allow_archived=allow_archived,
            parent_dir_ref_id=[dir_entity.ref_id],
        )
        subdirs_sorted = sorted(subdirs_raw, key=lambda d: str(d.name))

        docs = await uow.get_for(Doc).find_all_generic(
            parent_ref_id=doc_collection_ref_id,
            allow_archived=allow_archived,
            ref_id=filter_ref_ids or NoFilter(),
            parent_dir_ref_id=[dir_entity.ref_id],
        )

        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace_ref_id
        )
        notes = await uow.get(NoteRepository).find_all_for_note_collection(
            note_collection_ref_id=note_collection.ref_id,
            allow_archived=True,
            filter_owners=[
                EntityLink.std(NamedEntityTag.DOC.value, rid)
                for rid in [d.ref_id for d in docs]
            ],
        )
        notes_by_doc_ref_id: dict[EntityId, Note] = {}
        for n in notes:
            notes_by_doc_ref_id[n.owner.ref_id] = n

        tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace_ref_id)
        doc_tag_links = await uow.get(TagLinkRepository).find_all_generic(
            parent_ref_id=tags_domain.ref_id,
            allow_archived=False,
            owner=[EntityLink.std(NamedEntityTag.DOC.value, d.ref_id) for d in docs],
        )
        doc_tag_links_by_doc_ref_id = {
            cast(EntityId, tl.owner.ref_id): tl for tl in doc_tag_links
        }
        dir_tag_links = (
            await uow.get(TagLinkRepository).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                owner=[
                    EntityLink.std(NamedEntityTag.DIR.value, sd.ref_id)
                    for sd in subdirs_sorted
                ],
            )
            if subdirs_sorted
            else []
        )
        dir_tag_links_by_dir_ref_id = {
            cast(EntityId, tl.owner.ref_id): tl for tl in dir_tag_links
        }
        all_tag_ref_ids: list[EntityId] = []
        for tl in doc_tag_links:
            all_tag_ref_ids.extend(tl.ref_ids)
        for tl in dir_tag_links:
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

        entries: list[DirLoadResultEntry] = []
        for doc in docs:
            note = notes_by_doc_ref_id.get(doc.ref_id)
            if note is None:
                raise InputValidationError(
                    f"Doc {doc.ref_id} has no associated note.",
                )
            entries.append(
                DirLoadResultEntry(
                    doc=doc,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in doc_tag_links_by_doc_ref_id[doc.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if doc.ref_id in doc_tag_links_by_doc_ref_id
                        else []
                    ),
                    note=note,
                )
            )

        subdir_entries = [
            DirLoadSubdirEntry(
                dir=sd,
                tags=(
                    [
                        all_tags_by_ref_id[rid]
                        for rid in dir_tag_links_by_dir_ref_id[sd.ref_id].ref_ids
                        if rid in all_tags_by_ref_id
                    ]
                    if sd.ref_id in dir_tag_links_by_dir_ref_id
                    else []
                ),
            )
            for sd in subdirs_sorted
        ]

        publish_entity = None
        if include_publish_entity:
            publish_entity = await uow.get(
                PublishEntityRepository
            ).load_optional_for_owner(
                EntityLink.std(NamedEntityTag.DIR.value, dir_entity.ref_id),
                allow_archived=allow_archived,
            )

        return DirLoadResult(
            dir=dir_entity,
            entries=entries,
            subdirs=subdir_entries,
            publish_entity=publish_entity,
        )
