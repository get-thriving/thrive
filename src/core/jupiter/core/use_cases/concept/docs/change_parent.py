"""The command for changing the parent for a doc."""

from jupiter.core.component import AppCore
from jupiter.core.domain.concept.docs.doc import Doc
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.storage_engine import DomainUnitOfWork
from jupiter.core.use_cases.infra.use_cases import (
    AppLoggedInMutationUseCaseContext,
    AppTransactionalLoggedInMutationUseCase,
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocChangeParentArgs(UseCaseArgsBase):
    """DocChangeParent arguments."""

    ref_id: EntityId
    parent_node_ref_id: EntityId | None


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocChangeParentUseCase(
    AppTransactionalLoggedInMutationUseCase[DocChangeParentArgs, None]
):
    """The command for changing the parent for a doc ."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
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
