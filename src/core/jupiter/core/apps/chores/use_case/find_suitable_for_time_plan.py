"""Find chores suitable for adding to a time plan."""

from jupiter.core.app import AppCore
from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.common.sub.inbox_tasks.root import InboxTaskRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterFindCrownEntityArgs,
    JupiterFindCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class ChoreFindSuitableForTimePlanArgs(JupiterFindCrownEntityArgs):
    """Args."""

    time_plan_ref_id: EntityId


@use_case_result_part
class ChoreFindSuitableForTimePlanResultEntry(UseCaseResultBase):
    """A chore with suitability for adding to a time plan."""

    chore: Chore
    aspect: Aspect | None
    has_uncompleted_historical_inbox_tasks: bool
    would_generate_in_time_plan: bool


@use_case_result
class ChoreFindSuitableForTimePlanResult(UseCaseResultBase):
    """The result."""

    entries: list[ChoreFindSuitableForTimePlanResultEntry]


@readonly_use_case(
    WorkspaceFeature.CHORES,
    WorkspaceFeature.TIME_PLANS,
    only_for_component=[AppCore.WEBUI, AppCore.API],
)
class ChoreFindSuitableForTimePlanUseCase(
    JupiterFindCrownEntityUseCase[
        ChoreFindSuitableForTimePlanArgs, ChoreFindSuitableForTimePlanResult
    ]
):
    """Find chores suitable for adding to a time plan."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ChoreFindSuitableForTimePlanArgs,
    ) -> ChoreFindSuitableForTimePlanResult:
        """Execute the command's action."""
        time_plan = await self.load_entity(
            uow,
            context.user.ref_id,
            TimePlan,
            args.time_plan_ref_id,
        )

        if not time_plan.allows_inbox_tasks:
            raise InputValidationError(
                "Chores can only be added to daily or weekly time plans"
            )

        chores = await self.find_all_entities(
            uow,
            context.user.ref_id,
            Chore,
            allow_archived=False,
        )
        if not chores:
            return ChoreFindSuitableForTimePlanResult(entries=[])

        chore_owner_links = [
            EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id) for chore in chores
        ]
        owners_with_uncompleted = await uow.get(
            InboxTaskRepository
        ).find_owner_ref_ids_with_uncompleted_tasks(chore_owner_links)

        if context.workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            aspect_ref_ids = list({chore.aspect_ref_id for chore in chores})
            aspects = (
                await uow.get_for(Aspect).find_all_generic(
                    allow_archived=True,
                    ref_id=aspect_ref_ids,
                )
                if aspect_ref_ids
                else []
            )
            aspect_by_ref_id = {aspect.ref_id: aspect for aspect in aspects}
        else:
            aspect_by_ref_id = None

        return ChoreFindSuitableForTimePlanResult(
            entries=[
                ChoreFindSuitableForTimePlanResultEntry(
                    chore=chore,
                    aspect=(
                        aspect_by_ref_id.get(chore.aspect_ref_id)
                        if aspect_by_ref_id is not None
                        else None
                    ),
                    has_uncompleted_historical_inbox_tasks=(
                        chore.ref_id in owners_with_uncompleted
                    ),
                    would_generate_in_time_plan=chore.would_generate_in_time_plan(
                        time_plan.start_date,
                        time_plan.end_date,
                    ),
                )
                for chore in chores
            ],
        )
