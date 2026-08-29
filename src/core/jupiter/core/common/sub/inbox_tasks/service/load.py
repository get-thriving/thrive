"""Shared service for loading an inbox task and its parent entities."""

from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.habits.root import Habit
from jupiter.core.apps.journals.root import Journal
from jupiter.core.apps.metrics.root import Metric
from jupiter.core.apps.prm.sub.person.root import Person
from jupiter.core.apps.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.apps.projects.root import Project
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.apps.working_mem.collection import WorkingMemCollection
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.inbox_tasks.parent_link_namespace import (
    CHORE,
    EMAIL_TASK,
    HABIT,
    JOURNAL,
    METRIC,
    PERSON_CATCH_UP,
    PERSON_OCCASION,
    PROJECT,
    SLACK_TASK,
    TIME_PLAN,
    TODO_TASK,
    WORKING_MEM_CLEANUP,
    parent_link_namespace_from_entity_link,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseResultBase, use_case_result


@use_case_result
class InboxTaskLoadResult(UseCaseResultBase):
    """InboxTaskLoadResult."""

    inbox_task: InboxTask
    working_mem_collection: WorkingMemCollection | None
    time_plan: TimePlan | None
    habit: Habit | None
    chore: Chore | None
    project: Project | None
    journal: Journal | None
    metric: Metric | None
    person: Person | None
    occasion: Occasion | None
    slack_task: SlackTask | None
    email_task: EmailTask | None
    todo_task: TodoTask | None
    owner: UserLight
    access_status: AccessStatus | None


class InboxTaskLoadService:
    """Shared service for loading an inbox task and its parent entities."""

    async def do_it(
        self,
        uow: DomainUnitOfWork,
        inbox_task: InboxTask,
        *,
        user_ref_id: EntityId | None = None,
        allow_archived: bool = False,
    ) -> InboxTaskLoadResult:
        """Load parents and ownership for an already-authorized inbox task.

        Callers must have already authorized access to the inbox task (via ACL
        on its owner, or via a parent context such as a time plan activity).
        Parent crown entities are loaded without a separate ACL check.
        """
        inbox_task = await uow.get_for(InboxTask).load_by_id(
            inbox_task.ref_id, allow_archived=allow_archived
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

        if owner_pln == PROJECT:
            project = await uow.get_for(Project).load_by_id(
                inbox_task.owner.ref_id, allow_archived=True
            )
        else:
            project = None

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

        owner_ref_ids_by_entity = await OwnerUserRefIdsForEntitiesService().do_it(
            uow, [inbox_task.owner]
        )
        owner_user_ref_id = owner_ref_ids_by_entity.get(
            inbox_task.owner.ref_id, user_ref_id
        )
        if owner_user_ref_id is None:
            raise Exception(
                f"Could not resolve owner user for inbox task {inbox_task.ref_id}"
            )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            [owner_user_ref_id]
        )
        owner = owners[0]
        access_status = (
            await uow.get(AccessStatusRepository).load_optional_for_entity_and_user(
                inbox_task.owner, user_ref_id
            )
            if user_ref_id is not None
            else None
        )

        return InboxTaskLoadResult(
            inbox_task=inbox_task,
            working_mem_collection=working_mem_collection,
            time_plan=time_plan,
            habit=habit,
            chore=chore,
            project=project,
            metric=metric,
            journal=journal,
            person=person,
            occasion=occasion,
            slack_task=slack_task,
            email_task=email_task,
            todo_task=todo_task,
            owner=owner,
            access_status=access_status,
        )
