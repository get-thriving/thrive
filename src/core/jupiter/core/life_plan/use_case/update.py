"""The command for updating a life plan."""

from jupiter.core.common.birth_year import BirthYear
from jupiter.core.common.birthday import Birthday
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class LifePlanUpdateArgs(UseCaseArgsBase):
    """Life plan update args."""

    ref_id: EntityId
    birthday: UpdateAction[Birthday]
    birth_year: UpdateAction[BirthYear]


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class LifePlanUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[LifePlanUpdateArgs, None]
):
    """The command for updating a life plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LifePlanUpdateArgs,
    ) -> None:
        """Execute the command."""
        life_plan = await uow.get_for(LifePlan).load_by_id(args.ref_id)
        life_plan = life_plan.update(
            ctx=context.domain_context,
            birthday=args.birthday,
            birth_year=args.birth_year,
        )
        life_plan = await uow.get_for(LifePlan).save(life_plan)
