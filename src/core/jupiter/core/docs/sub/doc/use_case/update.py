"""Update a doc use case."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.docs.root import DocCollection
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.name import DocName
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocUpdateArgs(UseCaseArgsBase):
    """DocUpdate args."""

    ref_id: EntityId
    name: UpdateAction[DocName]
    parent_dir_ref_id: UpdateAction[EntityId]


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[DocUpdateArgs, None]
):
    """Update a doc use case."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DocUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        doc_collection = await uow.get_for(DocCollection).load_by_parent(
            workspace.ref_id
        )

        doc = await uow.get_for(Doc).load_by_id(args.ref_id)
        if doc.doc_collection.ref_id != doc_collection.ref_id:
            raise InputValidationError("Doc is not in this workspace.")

        if args.parent_dir_ref_id.should_change:
            parent_dir = await uow.get_for(Dir).load_by_id(
                args.parent_dir_ref_id.just_the_value,
            )
            if parent_dir.doc_collection.ref_id != doc_collection.ref_id:
                raise InputValidationError("Directory is not in this workspace.")

        doc = doc.update(
            ctx=context.domain_context,
            name=args.name,
            parent_dir_ref_id=args.parent_dir_ref_id,
        )
        doc = await uow.get_for(Doc).save(doc)
        await progress_reporter.mark_updated(doc)
