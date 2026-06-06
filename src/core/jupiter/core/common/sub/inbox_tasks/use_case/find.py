"""The command for finding a inbox task."""

from jupiter.core.projects.collection import ProjectCollection
from jupiter.core.projects.root import Project
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.parent_link_namespace import (
    PROJECT,
    TODO_TASK,
    parent_link_namespace_allows_user_field_edits,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.root import Journal
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.root import Metric
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.sub.occasion.root import Occasion
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.email.task import EmailTask
from jupiter.core.push_integrations.sub.email.task_collection import (
    EmailTaskCollection,
)
from jupiter.core.push_integrations.sub.slack.task import SlackTask
from jupiter.core.push_integrations.sub.slack.task_collection import (
    SlackTaskCollection,
)
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.todo.root import TodoTask
from jupiter.core.working_mem.collection import (
    WorkingMemCollection,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import NoFilter
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class InboxTaskFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool | None
    filter_just_workable: bool | None
    filter_just_user: bool | None
    filter_just_generated: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_namespace: list[str] | None
    filter_source_entity_ref_ids: list[EntityId] | None


@use_case_result_part
class InboxTaskFindResultEntry(UseCaseResultBase):
    """A single entry in the load all inbox tasks response."""

    inbox_task: InboxTask
    working_mem_collection: WorkingMemCollection | None
    time_plan: TimePlan | None
    habit: Habit | None
    chore: Chore | None
    project: Project | None
    journal: Journal | None
    metric: Metric | None
    person: Person | None
    contact: Contact | None
    occasion: Occasion | None
    slack_task: SlackTask | None
    email_task: EmailTask | None
    todo_task: TodoTask | None


@use_case_result
class InboxTaskFindResult(UseCaseResultBase):
    """PersonFindResult."""

    entries: list[InboxTaskFindResultEntry]


def _owner_type_from_parent_link_namespace(pln: str) -> str:
    """``TodoTask:std`` -> ``TodoTask``."""
    return pln.rsplit(":", 1)[0]


class InboxTaskFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[InboxTaskFindArgs, InboxTaskFindResult]
):
    """The command for finding a inbox task."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: InboxTaskFindArgs,
    ) -> InboxTaskFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace

        if args.filter_just_user and args.filter_just_generated:
            raise InputValidationError(
                "Cannot filter for both user tasks and generated tasks at the same time"
            )

        filter_namespace_list = (
            args.filter_namespace
            if args.filter_namespace is not None
            else workspace.infer_sources_for_enabled_features()
        )
        if args.filter_just_user:
            filter_namespace_list = self._filter_namespaces_for_user_tasks(
                filter_namespace_list,
            )
        elif args.filter_just_generated:
            filter_namespace_list = self._filter_namespaces_for_generated_tasks(
                filter_namespace_list,
            )

        big_diff = list(
            set(filter_namespace_list).difference(
                set(
                    workspace.infer_sources_for_enabled_features(
                        filter_namespace_list,
                    ),
                ),
            )
        )
        if len(big_diff) > 0:
            raise UnavailableForContextError(
                f"Sources {','.join(big_diff)} are not supported in this workspace"
            )

        filter_plns = filter_namespace_list

        filter_status: list[InboxTaskStatus] | NoFilter = (
            InboxTaskStatus.all_workable_statuses()
            if args.filter_just_workable
            else NoFilter()
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        working_mem_collection = await uow.get_for(WorkingMemCollection).load_by_parent(
            workspace.ref_id
        )
        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id,
        )
        habit_collection = await uow.get_for(HabitCollection).load_by_parent(
            workspace.ref_id,
        )
        chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
            workspace.ref_id,
        )
        project_collection = await uow.get_for(ProjectCollection).load_by_parent(
            workspace.ref_id,
        )
        journal_collection = await uow.get_for(JournalCollection).load_by_parent(
            workspace.ref_id,
        )
        metric_collection = await uow.get_for(MetricCollection).load_by_parent(
            workspace.ref_id,
        )
        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )
        push_integrations_group = await uow.get_for(
            PushIntegrationGroup
        ).load_by_parent(
            workspace.ref_id,
        )
        slack_task_collection = await uow.get_for(SlackTaskCollection).load_by_parent(
            push_integrations_group.ref_id,
        )
        email_task_collection = await uow.get_for(EmailTaskCollection).load_by_parent(
            push_integrations_group.ref_id,
        )

        inbox_task_repo = uow.get(InboxTaskRepository)
        if args.filter_source_entity_ref_ids:
            owner_links: list[EntityLink] = []
            for pln in filter_plns:
                tt = _owner_type_from_parent_link_namespace(pln)
                for rid in args.filter_source_entity_ref_ids:
                    owner_links.append(EntityLink.std(tt, rid))
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=allow_archived,
                ref_id=args.filter_ref_ids or NoFilter(),
                status=filter_status,
                owner=owner_links,
            )
        else:
            inbox_tasks = await inbox_task_repo.find_all_for_parent_link_namespaces(
                parent_ref_id=inbox_task_collection.ref_id,
                parent_link_namespaces=filter_plns,
                allow_archived=allow_archived,
                filter_ref_ids=args.filter_ref_ids,
                filter_status=filter_status,
            )

        time_plans = await uow.get_for(TimePlan).find_all(
            parent_ref_id=time_plan_domain.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.TIME_PLAN.value
            ],
        )
        time_plans_by_ref_id = {tp.ref_id: tp for tp in time_plans}

        habits = await uow.get_for(Habit).find_all(
            parent_ref_id=habit_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.HABIT.value
            ],
        )
        habits_by_ref_id = {rt.ref_id: rt for rt in habits}

        chores = await uow.get_for(Chore).find_all(
            parent_ref_id=chore_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.CHORE.value
            ],
        )
        chores_by_ref_id = {rt.ref_id: rt for rt in chores}

        projects = await uow.get_for(Project).find_all(
            parent_ref_id=project_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.PROJECT.value
            ],
        )
        projects_by_ref_id = {bp.ref_id: bp for bp in projects}

        journals = await uow.get_for(Journal).find_all(
            parent_ref_id=journal_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.JOURNAL.value
            ],
        )
        journals_by_ref_id = {j.ref_id: j for j in journals}

        metrics = await uow.get_for(Metric).find_all(
            parent_ref_id=metric_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.METRIC.value
            ],
        )
        metrics_by_ref_id = {m.ref_id: m for m in metrics}

        occasions = await uow.get_for(Occasion).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.OCCASION.value
            ],
        )
        occasions_by_ref_id = {o.ref_id: o for o in occasions}

        persons = await uow.get_for(Person).find_all(
            parent_ref_id=prm.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.PERSON.value
            ]
            + [o.person.ref_id for o in occasions],
        )
        persons_by_ref_id = {p.ref_id: p for p in persons}

        # Load contacts for persons
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id,
        )
        contact_links = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=False,
        )
        contact_ref_id_by_person_ref_id = {
            link.owner.ref_id: link.contacts_ref_ids[0]
            for link in contact_links
            if link.owner.the_type == NamedEntityTag.PERSON.value
            and link.contacts_ref_ids
        }
        contact_ref_ids = list(contact_ref_id_by_person_ref_id.values())
        contacts = []
        if contact_ref_ids:
            contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=contact_ref_ids,
            )
        contacts_by_ref_id = {c.ref_id: c for c in contacts}

        slack_tasks = await uow.get_for(SlackTask).find_all(
            parent_ref_id=slack_task_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.SLACK_TASK.value
            ],
        )
        slack_tasks_by_ref_id = {p.ref_id: p for p in slack_tasks}

        email_tasks = await uow.get_for(EmailTask).find_all(
            parent_ref_id=email_task_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.EMAIL_TASK.value
            ],
        )
        email_tasks_by_ref_id = {p.ref_id: p for p in email_tasks}

        todo_tasks = await uow.get_for(TodoTask).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.TODO_TASK.value
            ],
        )
        todo_tasks_by_ref_id = {t.ref_id: t for t in todo_tasks}

        return InboxTaskFindResult(
            entries=[
                InboxTaskFindResultEntry(
                    inbox_task=it,
                    working_mem_collection=(
                        working_mem_collection
                        if it.owner.the_type == "WorkingMemCollection"
                        else None
                    ),
                    time_plan=(
                        time_plans_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.TIME_PLAN.value
                        else None
                    ),
                    habit=(
                        habits_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.HABIT.value
                        else None
                    ),
                    chore=(
                        chores_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.CHORE.value
                        else None
                    ),
                    project=(
                        projects_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.PROJECT.value
                        else None
                    ),
                    journal=(
                        journals_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.JOURNAL.value
                        else None
                    ),
                    metric=(
                        metrics_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.METRIC.value
                        else None
                    ),
                    person=(
                        persons_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.PERSON.value
                        else (
                            persons_by_ref_id[
                                occasions_by_ref_id[it.owner.ref_id].person.ref_id
                            ]
                            if it.owner.the_type == NamedEntityTag.OCCASION.value
                            else None
                        )
                    ),
                    contact=(
                        contacts_by_ref_id.get(
                            contact_ref_id_by_person_ref_id[it.owner.ref_id]
                        )
                        if it.owner.the_type == NamedEntityTag.PERSON.value
                        else (
                            contacts_by_ref_id.get(
                                contact_ref_id_by_person_ref_id[
                                    occasions_by_ref_id[it.owner.ref_id].person.ref_id
                                ]
                            )
                            if it.owner.the_type == NamedEntityTag.OCCASION.value
                            else None
                        )
                    ),
                    occasion=(
                        occasions_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.OCCASION.value
                        else None
                    ),
                    slack_task=(
                        slack_tasks_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.SLACK_TASK.value
                        else None
                    ),
                    email_task=(
                        email_tasks_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.EMAIL_TASK.value
                        else None
                    ),
                    todo_task=(
                        todo_tasks_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.TODO_TASK.value
                        else None
                    ),
                )
                for it in inbox_tasks
            ],
        )

    def _filter_namespaces_for_generated_tasks(self, sources: list[str]) -> list[str]:
        return [s for s in sources if s not in (TODO_TASK, PROJECT)]

    def _filter_namespaces_for_user_tasks(self, sources: list[str]) -> list[str]:
        return [s for s in sources if parent_link_namespace_allows_user_field_edits(s)]
