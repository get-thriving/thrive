"""A use case for regenerating tasks associated with habits."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.habits.root import Habit
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class HabitRegenArgs(JupiterUpdateCrownEntityArgs):
    """The arguments for the habit regen use case."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitRegenUseCase(JupiterUpdateCrownEntityUseCase[HabitRegenArgs, None]):
    """A use case for regenerating tasks associated with habits."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitRegenArgs,
    ) -> None:
        """Perform the mutation."""
        await self.check_entity(uow, context.user.ref_id, Habit, args.ref_id)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitRegenArgs,
        result: None,
    ) -> None:
        """Execute the command's post-mutation work."""
        await GenService(self._ports.domain_storage_engine).do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=True,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.HABITS],
            period=None,
            filter_habit_ref_ids=[args.ref_id],
        )
