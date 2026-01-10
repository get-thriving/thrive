"""Update an occasion."""

from jupiter.core.common.birthday import Birthday
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.person.sub.occasion.kind import OccasionKind
from jupiter.core.prm.sub.person.sub.occasion.name import OccasionName
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class OccasionUpdateArgs(UseCaseArgsBase):
    """OccasionUpdate args."""

    ref_id: EntityId
    name: UpdateAction[OccasionName]
    kind: UpdateAction[OccasionKind]
    date: UpdateAction[Birthday]


@mutation_use_case(WorkspaceFeature.PRM)
class OccasionUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[OccasionUpdateArgs, None]
):
    """The command for updating an occasion."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: OccasionUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        occasion = await uow.get_for(Occasion).load_by_id(args.ref_id)

        occasion = occasion.update(
            ctx=context.domain_context,
            name=args.name,
            kind=args.kind,
            date=args.date,
        )

        await uow.get_for(Occasion).save(occasion)
        await progress_reporter.mark_updated(occasion)

