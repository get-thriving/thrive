"""Create a circle."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.circle.name import CircleName
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class CircleCreateArgs(JupiterCreateCrownEntityArgs):
    """Circle create args."""

    name: CircleName


@use_case_result
class CircleCreateResult(UseCaseResultBase):
    """Circle create result."""

    new_circle: Circle


@mutation_use_case(WorkspaceFeature.PRM)
class CircleCreateUseCase(
    JupiterCreateCrownEntityUseCase[CircleCreateArgs, CircleCreateResult]
):
    """The command for creating a circle."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: CircleCreateArgs,
    ) -> CircleCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )

        new_circle = Circle.new_circle(
            ctx=context.domain_context,
            prm_ref_id=prm.ref_id,
            name=args.name,
        )
        new_circle = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_circle,
        )

        return CircleCreateResult(new_circle=new_circle)
