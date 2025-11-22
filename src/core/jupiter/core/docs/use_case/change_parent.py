"""The command for changing the parent for a doc."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.docs.root import Doc
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocChangeParentArgs(UseCaseArgsBase):
    """DocChangeParent arguments."""

    ref_id: EntityId
    parent_node_ref_id: EntityId | None


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocChangeParentUseCase(
    JupiterTransactionalLoggedInMutationUseCase[DocChangeParentArgs, None]
):
    """The command for changing the parent for a doc ."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: DocChangeParentArgs,
    ) -> None:
        """Execute the command's action."""
        doc = await uow.get_for(Doc).load_by_id(args.ref_id)
        doc = doc.change_parent(
            context.domain_context,
            args.parent_node_ref_id,
        )
        await uow.get_for(Doc).save(doc)
        await progress_reporter.mark_updated(doc)
