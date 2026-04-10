"""The use case for finding docs."""

from collections import defaultdict

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.docs.collection import DocCollection
from jupiter.core.docs.root import Doc
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
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
class DocFindArgs(UseCaseArgsBase):
    """DocFind args."""

    include_notes: bool | None
    allow_archived: bool | None
    include_subdocs: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class DocFindResultEntry(UseCaseResultBase):
    """A single entry in the load all docs response."""

    doc: Doc
    tags: list[Tag]
    note: Note | None
    subdocs: list[Doc] | None


@use_case_result
class DocFindResult(UseCaseResultBase):
    """The result."""

    entries: list[DocFindResultEntry]


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[DocFindArgs, DocFindResult]
):
    """The use case for finding docs."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DocFindArgs,
    ) -> DocFindResult:
        """Execute the command's action."""
        include_notes = args.include_notes or False
        allow_archived = args.allow_archived or False
        include_subdocs = args.include_subdocs or False
        include_tags = args.include_tags or False
        workspace = context.workspace
        doc_collection = await uow.get_for(DocCollection).load_by_parent(
            workspace.ref_id
        )

        docs = await uow.get_for(Doc).find_all_generic(
            parent_ref_id=doc_collection.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            parent_doc_ref_id=NoFilter(),
        )

        notes_by_doc_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
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
            for n in notes:
                notes_by_doc_ref_id[n.owner.ref_id] = n

        subdocs_by_parent_ref_id = defaultdict(list)
        if include_subdocs:
            subdocs = await uow.get_for(Doc).find_all_generic(
                parent_ref_id=doc_collection.ref_id,
                allow_archived=allow_archived,
                parent_doc_ref_id=[d.ref_id for d in docs],
            )
            for sd in subdocs:
                if sd.parent_doc_ref_id is None:
                    continue
                subdocs_by_parent_ref_id[sd.parent_doc_ref_id].append(sd)

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.DOC,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.DOC,
                source_entity_ref_id=[d.ref_id for d in docs],
            )
            tag_links_by_doc_ref_id = {t.source_entity_ref_id: t for t in tag_links}
        else:
            all_tags_by_ref_id = {}
            tag_links_by_doc_ref_id = {}

        return DocFindResult(
            entries=[
                DocFindResultEntry(
                    doc=doc,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_doc_ref_id[doc.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if doc.ref_id in tag_links_by_doc_ref_id
                        else []
                    ),
                    note=notes_by_doc_ref_id.get(doc.ref_id, None),
                    subdocs=subdocs_by_parent_ref_id.get(doc.ref_id, None),
                )
                for doc in docs
            ]
        )
