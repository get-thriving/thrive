"""Update a task use case."""

from jupiter.core.app import AppCore
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.tasks.root import Task
from jupiter.core.common.sub.tasks.status import TaskStatus
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TaskUpdateArgs(UseCaseArgsBase):
    """TaskUpdate args."""

    ref_id: EntityId
    name: UpdateAction[EntityName]
    status: UpdateAction[TaskStatus]
    is_key: UpdateAction[bool]
    eisen: UpdateAction[Eisen]
    difficulty: UpdateAction[Difficulty]
    actionable_date: UpdateAction[ADate | None]
    due_date: UpdateAction[ADate | None]
    recurring_timeline: UpdateAction[str | None]
    recurring_repeat_index: UpdateAction[int | None]
    recurring_gen_right_now: UpdateAction[Timestamp | None]


@mutation_use_case(exclude_component=[AppCore.CLI])
class TaskUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TaskUpdateArgs, None]
):
    """Update a task use case."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TaskUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        task = await uow.get_for(Task).load_by_id(args.ref_id)
        task = task.update(
            ctx=context.domain_context,
            name=args.name,
            status=args.status,
            is_key=args.is_key,
            eisen=args.eisen,
            difficulty=args.difficulty,
            actionable_date=args.actionable_date,
            due_date=args.due_date,
            recurring_timeline=args.recurring_timeline,
            recurring_repeat_index=args.recurring_repeat_index,
            recurring_gen_right_now=args.recurring_gen_right_now,
        )
        task = await uow.get_for(Task).save(task)
