"""The command for finding a inbox task."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.parent_link_namespace import (
    BIG_PLAN,
    TODO_TASK,
    parent_link_namespace_allows_user_field_edits,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    SHAREABLE_INBOX_TASK_OWNER_TYPES,
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.habits.root import Habit
from jupiter.core.journals.root import Journal
from jupiter.core.metrics.root import Metric
from jupiter.core.named_entity_tag import NamedEntityTag
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
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.todo.root import TodoTask
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
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
    big_plan: BigPlan | None
    journal: Journal | None
    metric: Metric | None
    person: Person | None
    contact: Contact | None
    occasion: Occasion | None
    slack_task: SlackTask | None
    email_task: EmailTask | None
    todo_task: TodoTask | None
    owner: UserLight
    access_status: AccessStatus | None


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
        filter_source_ref_id_set = (
            set(args.filter_source_entity_ref_ids)
            if args.filter_source_entity_ref_ids is not None
            else None
        )

        # Workspace-local inbox tasks. Skipped when filtering by source entity
        # refs so we only return tasks the caller can access via ACL.
        if filter_source_ref_id_set is None:
            inbox_tasks = await inbox_task_repo.find_all_for_parent_link_namespaces(
                parent_ref_id=inbox_task_collection.ref_id,
                parent_link_namespaces=filter_plns,
                allow_archived=allow_archived,
                filter_ref_ids=args.filter_ref_ids,
                filter_status=filter_status,
            )
        else:
            inbox_tasks = []

        # Inbox tasks owned by accessible crown parents (includes shared
        # cross-workspace parents, and also re-includes owned ones).
        accessible_owner_links: list[EntityLink] = []
        for pln in filter_plns:
            owner_type = _owner_type_from_parent_link_namespace(pln)
            if owner_type not in SHAREABLE_INBOX_TASK_OWNER_TYPES:
                continue
            statuses = await uow.get(AccessStatusRepository).find_all_for_user(
                owner_type,
                context.user.ref_id,
            )
            for status in statuses:
                if not status.access_level.allows(AccessLevel.READER):
                    continue
                if (
                    filter_source_ref_id_set is not None
                    and status.entity.ref_id not in filter_source_ref_id_set
                ):
                    continue
                accessible_owner_links.append(
                    EntityLink.std(owner_type, status.entity.ref_id)
                )
        if accessible_owner_links:
            shared_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=None,
                allow_archived=allow_archived,
                ref_id=args.filter_ref_ids or NoFilter(),
                status=filter_status,
                owner=accessible_owner_links,
            )
            seen_inbox_task_ref_ids = {it.ref_id for it in inbox_tasks}
            for inbox_task in shared_inbox_tasks:
                if inbox_task.ref_id not in seen_inbox_task_ref_ids:
                    inbox_tasks.append(inbox_task)
                    seen_inbox_task_ref_ids.add(inbox_task.ref_id)

        # Parents may live in another workspace when shared; do not scope by
        # the caller's collection.
        time_plans = await uow.get_for(TimePlan).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.TIME_PLAN.value
            ],
        )
        time_plans_by_ref_id = {tp.ref_id: tp for tp in time_plans}

        habits = await uow.get_for(Habit).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.HABIT.value
            ],
        )
        habits_by_ref_id = {rt.ref_id: rt for rt in habits}

        chores = await uow.get_for(Chore).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.CHORE.value
            ],
        )
        chores_by_ref_id = {rt.ref_id: rt for rt in chores}

        big_plans = await uow.get_for(BigPlan).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.BIG_PLAN.value
            ],
        )
        big_plans_by_ref_id = {bp.ref_id: bp for bp in big_plans}

        journals = await uow.get_for(Journal).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.JOURNAL.value
            ],
        )
        journals_by_ref_id = {j.ref_id: j for j in journals}

        metrics = await uow.get_for(Metric).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
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

        persons = await uow.get_for(Person).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.PERSON.value
            ]
            + [o.person.ref_id for o in occasions],
        )
        persons_by_ref_id = {p.ref_id: p for p in persons}

        # Load contacts for persons
        contact_links = await uow.get_for(ContactLink).find_all_generic(
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

        seen_parent_keys: set[tuple[str, EntityId]] = set()
        parent_owner_links: list[EntityLink] = []
        for it in inbox_tasks:
            key = (it.owner.the_type, it.owner.ref_id)
            if key in seen_parent_keys:
                continue
            seen_parent_keys.add(key)
            parent_owner_links.append(it.owner)

        owner_ref_ids_by_parent_ref_id = (
            await OwnerUserRefIdsForEntitiesService().do_it(uow, parent_owner_links)
        )
        # Stub parents (e.g. WorkingMem) have no OWNER grant; attribute them to
        # the caller, who can only see them inside their own workspace.
        owner_user_ref_ids = set(owner_ref_ids_by_parent_ref_id.values())
        owner_user_ref_ids.add(context.user.ref_id)
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            list(owner_user_ref_ids)
        )
        owners_by_ref_id = {owner.ref_id: owner for owner in owners}

        access_statuses = await uow.get(
            AccessStatusRepository
        ).load_all_for_entities_and_user(parent_owner_links, context.user.ref_id)
        access_status_by_parent_ref_id = {
            status.entity.ref_id: status for status in access_statuses
        }

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
                    big_plan=(
                        big_plans_by_ref_id[it.owner.ref_id]
                        if it.owner.the_type == NamedEntityTag.BIG_PLAN.value
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
                    owner=owners_by_ref_id[
                        owner_ref_ids_by_parent_ref_id.get(
                            it.owner.ref_id, context.user.ref_id
                        )
                    ],
                    access_status=access_status_by_parent_ref_id.get(it.owner.ref_id),
                )
                for it in inbox_tasks
            ],
        )

    def _filter_namespaces_for_generated_tasks(self, sources: list[str]) -> list[str]:
        return [s for s in sources if s not in (TODO_TASK, BIG_PLAN)]

    def _filter_namespaces_for_user_tasks(self, sources: list[str]) -> list[str]:
        return [s for s in sources if parent_link_namespace_allows_user_field_edits(s)]
