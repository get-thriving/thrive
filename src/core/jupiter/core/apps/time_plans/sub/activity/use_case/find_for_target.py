"""The use case for finding the time plan activities for a particular target."""

from jupiter.core.app import AppCore
from jupiter.core.apps.time_plans.domain import TimePlanDomain
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.activity.root import TimePlanActivity
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import AccessStatusRepository
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
class TimePlanActivityFindForTargetArgs(JupiterFindCrownEntityArgs):
    """Args."""

    allow_archived: bool | None
    target: EntityLink


@use_case_result
class TimePlanActivityFindForTargetResultEntry(UseCaseResultBase):
    """Result."""

    time_plan: TimePlan
    time_plan_activity: TimePlanActivity


@use_case_result
class TimePlanActivityFindForTargetResult(UseCaseResultBase):
    """Result."""

    entries: list[TimePlanActivityFindForTargetResultEntry]


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanActivityFindForTargetUseCase(
    JupiterFindCrownEntityUseCase[
        TimePlanActivityFindForTargetArgs, TimePlanActivityFindForTargetResult
    ]
):
    """The command for finding time plan activities for a particular target."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanActivityFindForTargetArgs,
    ) -> TimePlanActivityFindForTargetResult:
        allow_archived = args.allow_archived or False
        workspace = context.workspace
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id
        )

        time_plan_activities = await uow.get_for(TimePlanActivity).find_all_generic(
            parent_ref_id=None,
            allow_archived=allow_archived,
            target=args.target,
        )

        # Check access only for the activities and plans this target touches,
        # rather than loading every access status the user holds for the type.
        accessible_activity_ref_ids = await self._find_readable_ref_ids(
            uow,
            context,
            NamedEntityTag.TIME_PLAN_ACTIVITY,
            [activity.ref_id for activity in time_plan_activities],
        )
        time_plan_activities = [
            activity
            for activity in time_plan_activities
            if activity.ref_id in accessible_activity_ref_ids
        ]

        if len(time_plan_activities) > 0:
            accessible_time_plan_ref_ids = await self._find_readable_ref_ids(
                uow,
                context,
                NamedEntityTag.TIME_PLAN,
                list({activity.time_plan.ref_id for activity in time_plan_activities}),
            )
            time_plans = await uow.get_for(TimePlan).find_all(
                parent_ref_id=time_plan_domain.ref_id,
                allow_archived=True,
                filter_ref_ids=list(accessible_time_plan_ref_ids),
            )
        else:
            time_plans = []

        time_plans_by_ref_id = {time_plan.ref_id: time_plan for time_plan in time_plans}

        return TimePlanActivityFindForTargetResult(
            entries=[
                TimePlanActivityFindForTargetResultEntry(
                    time_plan=time_plans_by_ref_id[activity.time_plan.ref_id],
                    time_plan_activity=activity,
                )
                for activity in time_plan_activities
                if activity.time_plan.ref_id in time_plans_by_ref_id
            ]
        )

    async def _find_readable_ref_ids(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        tag: NamedEntityTag,
        ref_ids: list[EntityId],
    ) -> set[EntityId]:
        statuses = await uow.get(AccessStatusRepository).load_all_for_entities_and_user(
            [EntityLink.std(tag.value, ref_id) for ref_id in ref_ids],
            context.user.ref_id,
        )
        return {
            status.entity.ref_id
            for status in statuses
            if status.access_level.allows(AccessLevel.READER)
        }
