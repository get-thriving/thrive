"""Guest readonly use case for loading a published habit."""

from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntityRepository
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.habits.service.load import HabitLoadResult, HabitLoadService
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HabitLoadPublicArgs(UseCaseArgsBase):
    """HabitLoadPublic args."""

    external_id: PublishExternalId
    inbox_task_retrieve_offset: int | None
    include_streak_marks_earliest_date: ADate | None
    include_streak_marks_latest_date: ADate | None


class HabitLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[HabitLoadPublicArgs, HabitLoadResult]
):
    """Load a published habit by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: HabitLoadPublicArgs,
    ) -> HabitLoadResult:
        """Execute the use case."""
        if (
            args.inbox_task_retrieve_offset is not None
            and args.inbox_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid inbox_task_retrieve_offset")
        if (
            args.include_streak_marks_earliest_date is not None
            and args.include_streak_marks_latest_date is not None
            and args.include_streak_marks_earliest_date
            > args.include_streak_marks_latest_date
        ):
            raise InputValidationError(
                "Invalid streak_mark_earliest_date or streak_mark_latest_date"
            )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            if publish_entity.owner.the_type != NamedEntityTag.HABIT.value:
                raise InputValidationError(
                    "The publish entity does not refer to a habit."
                )
            if publish_entity.owner.purpose != "std":
                raise InputValidationError(
                    "The publish entity owner link purpose must be 'std'."
                )

            publish_domain = await uow.get_for(PublishDomain).load_by_id(
                publish_entity.publish_domain.ref_id
            )
            habit_collection = await uow.get_for(HabitCollection).load_by_parent(
                publish_domain.workspace.ref_id
            )
            habit = await uow.get_for(Habit).load_by_id(
                publish_entity.owner.ref_id,
                allow_archived=False,
            )
            if habit.parent_ref_id != habit_collection.ref_id:
                raise InputValidationError(
                    "The publish entity does not refer to a workspace habit."
                )

            return await HabitLoadService(self._time_provider).do_it(
                uow,
                publish_domain.workspace.ref_id,
                habit,
                allow_archived=False,
                inbox_task_retrieve_offset=args.inbox_task_retrieve_offset or 0,
                include_streak_marks_earliest_date=args.include_streak_marks_earliest_date,
                include_streak_marks_latest_date=args.include_streak_marks_latest_date,
                include_publish_entity=False,
            )
