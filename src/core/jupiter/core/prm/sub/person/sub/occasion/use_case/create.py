"""The command for creating an occasion."""

from jupiter.core.common.birthday import Birthday
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.kind import OccasionKind
from jupiter.core.prm.sub.person.sub.occasion.name import OccasionName
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class OccasionCreateArgs(JupiterCreateCrownEntityArgs):
    """OccasionCreate args."""

    person_ref_id: EntityId
    kind: OccasionKind
    name: OccasionName
    date: Birthday


@use_case_result
class OccasionCreateResult(UseCaseResultBase):
    """OccasionCreate result."""

    new_occasion: Occasion


@mutation_use_case(WorkspaceFeature.PRM)
class OccasionCreateUseCase(
    JupiterCreateCrownEntityUseCase[OccasionCreateArgs, OccasionCreateResult]
):
    """The command for creating an occasion."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: OccasionCreateArgs,
    ) -> OccasionCreateResult:
        """Execute the command's action."""
        await self.check_entity(uow, context.user.ref_id, Person, args.person_ref_id)

        new_occasion = Occasion.new_occasion(
            ctx=context.domain_context,
            person_ref_id=args.person_ref_id,
            kind=args.kind,
            name=args.name,
            date=args.date,
        )
        new_occasion = await uow.get_for(Occasion).create(new_occasion)
        await progress_reporter.mark_created(new_occasion)

        return OccasionCreateResult(new_occasion=new_occasion)
