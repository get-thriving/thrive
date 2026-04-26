"""The use case for loading a partcular inbox task."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.inbox_tasks.parent_link_namespace import (
    BIG_PLAN,
    CHORE,
    EMAIL_TASK,
    HABIT,
    JOURNAL,
    METRIC,
    PERSON_CATCH_UP,
    PERSON_OCCASION,
    SLACK_TASK,
    TIME_PLAN,
    TODO_TASK,
    WORKING_MEM_CLEANUP,
    parent_link_namespace_from_entity_link,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.habits.root import Habit
from jupiter.core.journals.root import Journal
from jupiter.core.metrics.root import Metric
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.todo.root import TodoTask
from jupiter.core.working_mem.collection import WorkingMemCollection
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class InboxTaskLoadArgs(UseCaseArgsBase):
    """InboxTaskLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class InboxTaskLoadResult(UseCaseResultBase):
    """InboxTaskLoadResult."""

    inbox_task: InboxTask
    working_mem_collection: WorkingMemCollection | None
    time_plan: TimePlan | None
    habit: Habit | None
    chore: Chore | None
    big_plan: BigPlan | None
    journal: Journal | None
    metric: Metric | None
    person: Person | None
    occasion: Occasion | None
    slack_task: SlackTask | None
    email_task: EmailTask | None
    todo_task: TodoTask | None


class InboxTaskLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[InboxTaskLoadArgs, InboxTaskLoadResult]
):
    """The use case for loading a particular inbox task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: InboxTaskLoadArgs,
    ) -> InboxTaskLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        inbox_task = await uow.get_for(InboxTask).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        owner_pln = parent_link_namespace_from_entity_link(inbox_task.owner)

        if owner_pln == WORKING_MEM_CLEANUP:
            working_mem_collection = await uow.get_for(WorkingMemCollection).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            working_mem_collection = None

        if owner_pln == TIME_PLAN:
            time_plan = await uow.get_for(TimePlan).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            time_plan = None

        if owner_pln == HABIT:
            habit = await uow.get_for(Habit).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            habit = None

        if owner_pln == CHORE:
            chore = await uow.get_for(Chore).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            chore = None

        if owner_pln == BIG_PLAN:
            big_plan = await uow.get_for(BigPlan).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            big_plan = None

        if owner_pln == JOURNAL:
            journal = await uow.get_for(Journal).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            journal = None

        if owner_pln == METRIC:
            metric = await uow.get_for(Metric).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            metric = None

        if owner_pln == PERSON_OCCASION:
            occasion = await uow.get_for(Occasion).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
            person = await uow.get_for(Person).load_by_id(
                occasion.person.ref_id, allow_archived=True
            )
        elif owner_pln == PERSON_CATCH_UP:
            person = await uow.get_for(Person).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
            occasion = None
        else:
            person = None
            occasion = None

        if owner_pln == SLACK_TASK:
            slack_task = await uow.get_for(SlackTask).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            slack_task = None

        if owner_pln == EMAIL_TASK:
            email_task = await uow.get_for(EmailTask).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            email_task = None

        if owner_pln == TODO_TASK:
            todo_task = await uow.get_for(TodoTask).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            todo_task = None

        return InboxTaskLoadResult(
            inbox_task=inbox_task,
            working_mem_collection=working_mem_collection,
            time_plan=time_plan,
            habit=habit,
            chore=chore,
            big_plan=big_plan,
            metric=metric,
            journal=journal,
            person=person,
            occasion=occasion,
            slack_task=slack_task,
            email_task=email_task,
            todo_task=todo_task,
        )
