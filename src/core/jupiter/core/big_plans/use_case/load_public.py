"""Guest readonly use case for loading a published big plan."""

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.service.load import BigPlanLoadResult, BigPlanLoadService
from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class BigPlanLoadPublicArgs(UseCaseArgsBase):
    """BigPlanLoadPublic args."""

    external_id: PublishExternalId
    inbox_task_retrieve_offset: int | None


class BigPlanLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[BigPlanLoadPublicArgs, BigPlanLoadResult]
):
    """Load a published big plan by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: BigPlanLoadPublicArgs,
    ) -> BigPlanLoadResult:
        """Execute the use case."""
        if (
            args.inbox_task_retrieve_offset is not None
            and args.inbox_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.BIG_PLAN.value:
                raise InputValidationError(
                    "The publish entity does not refer to a big plan."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
                publish_domain.workspace.ref_id
            )
            big_plan = await uow.get_for(BigPlan).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if big_plan.big_plan_collection.ref_id != big_plan_collection.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace big plan."
                )

            return await BigPlanLoadService().do_it(
                uow,
                publish_domain.workspace.ref_id,
                big_plan,
                allow_archived=False,
                inbox_task_retrieve_offset=args.inbox_task_retrieve_offset or 0,
                paginate_inbox_tasks=True,
                include_publish_entity=False,
            )
