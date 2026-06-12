"""Guest readonly use case for loading a published time plan by external id."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.service.load import TimePlanLoadResult, TimePlanLoadService
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanLoadPublicArgs(UseCaseArgsBase):
    """TimePlanLoadPublic args."""

    external_id: PublishExternalId


class TimePlanLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[TimePlanLoadPublicArgs, TimePlanLoadResult]
):
    """Load a published time plan and its dependent entities by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: TimePlanLoadPublicArgs,
    ) -> TimePlanLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.TIME_PLAN.value:
                raise InputValidationError(
                    "The publish entity does not refer to a time plan."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            workspace = await uow.get_for(Workspace).load_by_id(
                publish_domain.workspace.ref_id
            )
            time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
                publish_domain.workspace.ref_id
            )
            time_plan = await uow.get_for(TimePlan).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if time_plan.parent_ref_id != time_plan_domain.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace time plan."
                )

            return await TimePlanLoadService().do_it(
                uow,
                workspace,
                time_plan,
                allow_archived=False,
                include_targets=True,
                include_completed_nontarget=False,
                include_other_time_plans=False,
                include_publish_entity=False,
            )
