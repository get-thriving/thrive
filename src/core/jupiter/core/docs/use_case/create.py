"""Use case for creating a doc."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.docs.collection import DocCollection
from jupiter.core.docs.idempotency_key import DocIdempotencyKey
from jupiter.core.docs.name import DocName
from jupiter.core.docs.root import Doc, DocRepository
from jupiter.core.domainx.core.notes.note import Note, NoteRepository
from jupiter.core.domainx.core.notes.note_collection import NoteCollection
from jupiter.core.domainx.core.notes.note_content_block import OneOfNoteContentBlock
from jupiter.core.domainx.core.notes.note_domain import NoteDomain
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class DocCreateArgs(UseCaseArgsBase):
    """DocCreate args."""

    idempotency_key: DocIdempotencyKey
    name: DocName
    content: list[OneOfNoteContentBlock]
    parent_doc_ref_id: EntityId | None


@use_case_result
class DocCreateResult(UseCaseResultBase):
    """DocCreate result."""

    new_doc: Doc
    new_note: Note


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[DocCreateArgs, DocCreateResult]
):
    """Use case for creating a doc."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DocCreateArgs,
    ) -> DocCreateResult:
        """Execute the command's action."""
        workspace = context.workspace
        doc_collection = await uow.get_for(DocCollection).load_by_parent(
            workspace.ref_id
        )
        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace.ref_id
        )

        doc = Doc.new_doc(
            ctx=context.domain_context,
            doc_collection_ref_id=doc_collection.ref_id,
            parent_doc_ref_id=args.parent_doc_ref_id,
            idempotency_key=args.idempotency_key,
            name=args.name,
        )
        doc, newly_created = await uow.get(DocRepository).create_if_not_exists(doc)

        if newly_created:
            await progress_reporter.mark_created(doc)
        else:
            await progress_reporter.mark_updated(doc)

        if newly_created:
            note = Note.new_note(
                ctx=context.domain_context,
                note_collection_ref_id=note_collection.ref_id,
                domain=NoteDomain.DOC,
                source_entity_ref_id=doc.ref_id,
                content=args.content,
            )
            note = await uow.get_for(Note).create(note)
        else:
            note = await uow.get(NoteRepository).load_for_source(
                NoteDomain.DOC,
                doc.ref_id,
            )
            note = note.update(
                ctx=context.domain_context,
                content=UpdateAction.change_to(args.content),
            )
            note = await uow.get_for(Note).save(note)

        return DocCreateResult(new_doc=doc, new_note=note)
