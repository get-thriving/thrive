"""Load a directory with its docs (notes and tags), and immediate child directories."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.docs.root import DocCollection
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
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
class DirLoadArgs(UseCaseArgsBase):
    """Arguments for loading a directory listing."""

    ref_id: EntityId
    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class DirLoadResultEntry(UseCaseResultBase):
    """One doc in the loaded directory."""

    doc: Doc
    tags: list[Tag]
    note: Note


@use_case_result_part
class DirLoadSubdirEntry(UseCaseResultBase):
    """One subdirectory row (tags only; no note body)."""

    dir: Dir
    tags: list[Tag]


@use_case_result
class DirLoadResult(UseCaseResultBase):
    """Loaded directory, its docs, and immediate child directories."""

    dir: Dir
    entries: list[DirLoadResultEntry]
    subdirs: list[DirLoadSubdirEntry]


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[DirLoadArgs, DirLoadResult]
):
    """Load a directory with docs (notes and tags always included) and child dirs."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DirLoadArgs,
    ) -> DirLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace
        doc_collection = await uow.get_for(DocCollection).load_by_parent(
            workspace.ref_id
        )

        dir_entity = await uow.get_for(Dir).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )
        if dir_entity.doc_collection.ref_id != doc_collection.ref_id:
            raise InputValidationError("Directory is not in this workspace.")

        subdirs_raw = await uow.get_for(Dir).find_all_generic(
            parent_ref_id=doc_collection.ref_id,
            allow_archived=allow_archived,
            parent_dir_ref_id=[dir_entity.ref_id],
        )
        subdirs_sorted = sorted(subdirs_raw, key=lambda d: str(d.name))

        docs = await uow.get_for(Doc).find_all_generic(
            parent_ref_id=doc_collection.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            parent_dir_ref_id=[dir_entity.ref_id],
        )

        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace.ref_id
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

        tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
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

        return DirLoadResult(
            dir=dir_entity,
            entries=entries,
            subdirs=subdir_entries,
        )
