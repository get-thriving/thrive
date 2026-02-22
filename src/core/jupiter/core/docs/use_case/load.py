"""Load a particulr doc."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag, TagRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.docs.root import Doc
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class DocLoadArgs(UseCaseArgsBase):
    """DocLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class DocLoadResult(UseCaseResultBase):
    """DocLoad result."""

    doc: Doc
    note: Note
    subdocs: list[Doc]
    tags: list[Tag]


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[DocLoadArgs, DocLoadResult]
):
    """Use case for loading a particular doc."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DocLoadArgs,
    ) -> DocLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        doc = await uow.get_for(Doc).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        note = await uow.get(NoteRepository).load_for_source(
            NoteNamespace.DOC, doc.ref_id, allow_archived=allow_archived
        )
        subdocs = await uow.get_for(Doc).find_all_generic(
            parent_ref_id=doc.doc_collection.ref_id,
            allow_archived=allow_archived,
            parent_doc_ref_id=[doc.ref_id],
        )

        tag_link = await uow.get(
            TagLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=TagNamespace.DOC,
            source_entity_ref_id=doc.ref_id,
        )
        if tag_link is not None:
            tags = await uow.get(TagRepository).find_all_generic(
                parent_ref_id=tag_link.tag_domain.ref_id,
                allow_archived=False,
                ref_id=tag_link.ref_ids,
            )
        else:
            tags = []

        return DocLoadResult(doc, note, subdocs, tags)
