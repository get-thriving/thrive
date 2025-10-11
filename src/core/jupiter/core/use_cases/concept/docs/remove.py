"""The command for removing a doc."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.docs.doc import Doc
from jupiter.core.domain.concept.docs.service.doc_remove_service import (
    DocRemoveService,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocRemoveArgs(UseCaseArgsBase):
    """DocRemove arguments."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[DocRemoveArgs, None]
):
    """The command for removing a doc."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: DocRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        doc = await uow.get_for(Doc).load_by_id(args.ref_id)
        await DocRemoveService().do_it(
            context.domain_context, uow, progress_reporter, doc
        )
