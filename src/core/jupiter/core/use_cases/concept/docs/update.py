"""Update a doc use case."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.docs.doc import Doc
from jupiter.core.domain.concept.docs.doc_name import DocName
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocUpdateArgs(UseCaseArgsBase):
    """DocUpdate args."""

    ref_id: EntityId
    name: UpdateAction[DocName]


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
        doc = await uow.get_for(Doc).load_by_id(args.ref_id)
        doc = doc.update(
            ctx=context.domain_context,
            name=args.name,
        )
        doc = await uow.get_for(Doc).save(doc)
        await progress_reporter.mark_updated(doc)
