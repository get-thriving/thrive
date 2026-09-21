"""Use case for loading big plan milestones."""

from jupiter.core.apps.big_plans.root import BigPlan
from jupiter.core.apps.big_plans.sub.milestones.root import (
    BigPlanMilestone,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class BigPlanMilestoneLoadArgs(JupiterLoadCrownEntityArgs):
    """BigPlanMilestoneLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class BigPlanMilestoneLoadResult(UseCaseResultBase):
    """BigPlanMilestoneLoadResult."""

    big_plan_milestone: BigPlanMilestone
    time_event_block: TimeEventFullDaysBlock | None


@readonly_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneLoadUseCase(
    JupiterLoadCrownEntityUseCase[BigPlanMilestoneLoadArgs, BigPlanMilestoneLoadResult]
):
    """The use case for loading a particular big plan milestone."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: BigPlanMilestoneLoadArgs,
    ) -> BigPlanMilestoneLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        big_plan_milestone = await uow.get_for(BigPlanMilestone).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        await self.check_entity(
            uow,
            context.user.ref_id,
            BigPlan,
            big_plan_milestone.big_plan.ref_id,
            allow_archived,
        )

        time_event_blocks = await uow.get_for(TimeEventFullDaysBlock).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            owner=EntityLink.std(
                NamedEntityTag.BIG_PLAN_MILESTONE.value, big_plan_milestone.ref_id
            ),
        )

        return BigPlanMilestoneLoadResult(
            big_plan_milestone=big_plan_milestone,
            time_event_block=time_event_blocks[0] if time_event_blocks else None,
        )
