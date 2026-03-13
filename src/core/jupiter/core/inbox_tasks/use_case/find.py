"""The command for finding a inbox task."""

from collections import defaultdict

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.inbox_tasks.status import InboxTaskStatus
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.root import Journal
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.root import Metric
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
from jupiter.core.working_mem.collection import (
    WorkingMemCollection,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    readonly_use_case,
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
    include_notes: bool | None
    include_time_event_blocks: bool | None
    include_tags: bool | None
    filter_just_workable: bool | None
    filter_just_user: bool | None
    filter_just_generated: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_aspect_ref_ids: list[EntityId] | None
    filter_sources: list[InboxTaskSource] | None
    filter_source_entity_ref_ids: list[EntityId] | None


@use_case_result_part
class InboxTaskFindResultEntry(UseCaseResultBase):
    """A single entry in the load all inbox tasks response."""

    inbox_task: InboxTask
    tags: list[Tag]
    contacts: list[Contact]
    note: Note | None
    aspect: Aspect
    chapter: Chapter | None
    goal: Goal | None
    time_event_blocks: list[TimeEventInDayBlock] | None
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


@use_case_result
class InboxTaskFindResult(UseCaseResultBase):
    """PersonFindResult."""

    entries: list[InboxTaskFindResultEntry]


@readonly_use_case(WorkspaceFeature.INBOX_TASKS)
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
        include_notes = args.include_notes or False
        include_time_event_blocks = args.include_time_event_blocks or False
        include_tags = args.include_tags or False
        workspace = context.workspace

        if args.filter_just_user and args.filter_just_generated:
            raise InputValidationError(
                "Cannot filter for both user tasks and generated tasks at the same time"
            )

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.filter_aspect_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        filter_sources = (
            args.filter_sources
            if args.filter_sources is not None
            else workspace.infer_sources_for_enabled_features(None)
        )
        if args.filter_just_user:
            filter_sources = self._filter_sources_for_user_tasks(filter_sources)
        elif args.filter_just_generated:
            filter_sources = self._filter_sources_for_generated_tasks(filter_sources)

        big_diff = list(
            set(filter_sources).difference(
                workspace.infer_sources_for_enabled_features(filter_sources)
            )
        )
        if len(big_diff) > 0:
            raise UnavailableForContextError(
                f"Sources {','.join(s.value for s in big_diff)} are not supported in this workspace"
            )

        filter_status: list[InboxTaskStatus] | NoFilter = (
            InboxTaskStatus.all_workable_statuses()
            if args.filter_just_workable
            else NoFilter()
        )
        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
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
        big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
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

        aspects = await uow.get_for(Aspect).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_aspect_ref_ids or NoFilter(),
        )
        aspect_by_ref_id = {p.ref_id: p for p in aspects}

        chapters = await uow.get_for(Chapter).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=allow_archived,
            ref_id=NoFilter(),
        )
        chapter_by_ref_id = {c.ref_id: c for c in chapters}

        goals = await uow.get_for(Goal).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=allow_archived,
            ref_id=NoFilter(),
        )
        goal_by_ref_id = {g.ref_id: g for g in goals}

        inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            status=filter_status,
            source=filter_sources,
            aspect_ref_id=args.filter_aspect_ref_ids or NoFilter(),
            source_entity_ref_id=args.filter_source_entity_ref_ids or NoFilter(),
        )

        time_plans = await uow.get_for(TimePlan).find_all(
            parent_ref_id=time_plan_domain.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.TIME_PLAN
            ],
        )
        time_plans_by_ref_id = {tp.ref_id: tp for tp in time_plans}

        habits = await uow.get_for(Habit).find_all(
            parent_ref_id=habit_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.HABIT
            ],
        )
        habits_by_ref_id = {rt.ref_id: rt for rt in habits}

        chores = await uow.get_for(Chore).find_all(
            parent_ref_id=chore_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.CHORE
            ],
        )
        chores_by_ref_id = {rt.ref_id: rt for rt in chores}

        big_plans = await uow.get_for(BigPlan).find_all(
            parent_ref_id=big_plan_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.BIG_PLAN
            ],
        )
        big_plans_by_ref_id = {bp.ref_id: bp for bp in big_plans}

        journals = await uow.get_for(Journal).find_all(
            parent_ref_id=journal_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.JOURNAL
            ],
        )
        journals_by_ref_id = {j.ref_id: j for j in journals}

        metrics = await uow.get_for(Metric).find_all(
            parent_ref_id=metric_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.METRIC
            ],
        )
        metrics_by_ref_id = {m.ref_id: m for m in metrics}

        occasions = await uow.get_for(Occasion).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            ref_id=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.PERSON_OCCASION
            ],
        )
        occasions_by_ref_id = {o.ref_id: o for o in occasions}

        persons = await uow.get_for(Person).find_all(
            parent_ref_id=prm.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.PERSON_CATCH_UP
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
            namespace=ContactNamespace.PERSON,
            allow_archived=False,
        )
        contact_ref_id_by_person_ref_id = {
            link.source_entity_ref_id: link.contacts_ref_ids[0]
            for link in contact_links
            if link.contacts_ref_ids
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

        # Load contacts linked to inbox tasks
        contact_links_for_inbox_tasks = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            namespace=ContactNamespace.INBOX_TASK,
            allow_archived=False,
            source_entity_ref_id=[it.ref_id for it in inbox_tasks],
        )
        inbox_task_contacts_by_ref_id = {
            link.source_entity_ref_id: link.contacts_ref_ids
            for link in contact_links_for_inbox_tasks
        }
        all_inbox_task_contact_ref_ids = []
        for contact_ref_ids in inbox_task_contacts_by_ref_id.values():
            all_inbox_task_contact_ref_ids.extend(contact_ref_ids)
        if all_inbox_task_contact_ref_ids:
            additional_contacts = await uow.get_for(Contact).find_all_generic(
                parent_ref_id=contact_domain.ref_id,
                allow_archived=False,
                ref_id=list(set(all_inbox_task_contact_ref_ids)),
            )
            for contact in additional_contacts:
                contacts_by_ref_id[contact.ref_id] = contact

        slack_tasks = await uow.get_for(SlackTask).find_all(
            parent_ref_id=slack_task_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.SLACK_TASK
            ],
        )
        slack_tasks_by_ref_id = {p.ref_id: p for p in slack_tasks}

        email_tasks = await uow.get_for(EmailTask).find_all(
            parent_ref_id=email_task_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.EMAIL_TASK
            ],
        )
        email_tasks_by_ref_id = {p.ref_id: p for p in email_tasks}

        notes_by_inbox_task_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                namespace=NoteNamespace.INBOX_TASK,
                allow_archived=True,
                source_entity_ref_id=[it.ref_id for it in inbox_tasks],
            )
            for note in notes:
                notes_by_inbox_task_ref_id[note.source_entity_ref_id] = note

        time_event_blocks_by_inbox_task_ref_id: defaultdict[
            EntityId, list[TimeEventInDayBlock]
        ] = defaultdict(list)
        if include_time_event_blocks:
            time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
                workspace.ref_id
            )
            time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
                parent_ref_id=time_event_domain.ref_id,
                allow_archived=True,
                namespace=TimeEventNamespace.INBOX_TASK,
                source_entity_ref_id=[it.ref_id for it in inbox_tasks],
            )
            for block in time_event_blocks:
                time_event_blocks_by_inbox_task_ref_id[
                    block.source_entity_ref_id
                ].append(block)

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.INBOX_TASK,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.INBOX_TASK,
                source_entity_ref_id=[it.ref_id for it in inbox_tasks],
            )
            tag_links_by_inbox_task_ref_id = {
                t.source_entity_ref_id: t for t in tag_links
            }
        else:
            all_tags_by_ref_id = {}
            tag_links_by_inbox_task_ref_id = {}

        return InboxTaskFindResult(
            entries=[
                InboxTaskFindResultEntry(
                    inbox_task=it,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_inbox_task_ref_id[it.ref_id].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if it.ref_id in tag_links_by_inbox_task_ref_id
                        else []
                    ),
                    contacts=[
                        contacts_by_ref_id[contact_ref_id]
                        for contact_ref_id in inbox_task_contacts_by_ref_id.get(
                            it.ref_id, []
                        )
                        if contact_ref_id in contacts_by_ref_id
                    ],
                    aspect=aspect_by_ref_id[it.aspect_ref_id],
                    chapter=(
                        chapter_by_ref_id[it.chapter_ref_id]
                        if it.chapter_ref_id
                        else None
                    ),
                    goal=goal_by_ref_id[it.goal_ref_id] if it.goal_ref_id else None,
                    working_mem_collection=(
                        working_mem_collection
                        if it.source == InboxTaskSource.WORKING_MEM_CLEANUP
                        else None
                    ),
                    time_plan=(
                        time_plans_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.TIME_PLAN
                        else None
                    ),
                    habit=(
                        habits_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.HABIT
                        else None
                    ),
                    chore=(
                        chores_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.CHORE
                        else None
                    ),
                    big_plan=(
                        big_plans_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.BIG_PLAN
                        else None
                    ),
                    journal=(
                        journals_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.JOURNAL
                        else None
                    ),
                    metric=(
                        metrics_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.METRIC
                        else None
                    ),
                    person=(
                        persons_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.PERSON_CATCH_UP
                        else (
                            persons_by_ref_id[
                                occasions_by_ref_id[
                                    it.source_entity_ref_id_for_sure
                                ].person.ref_id
                            ]
                            if it.source == InboxTaskSource.PERSON_OCCASION
                            else None
                        )
                    ),
                    contact=(
                        contacts_by_ref_id.get(
                            contact_ref_id_by_person_ref_id[
                                it.source_entity_ref_id_for_sure
                            ]
                        )
                        if it.source == InboxTaskSource.PERSON_CATCH_UP
                        else (
                            contacts_by_ref_id.get(
                                contact_ref_id_by_person_ref_id[
                                    occasions_by_ref_id[
                                        it.source_entity_ref_id_for_sure
                                    ].person.ref_id
                                ]
                            )
                            if it.source == InboxTaskSource.PERSON_OCCASION
                            else None
                        )
                    ),
                    occasion=(
                        occasions_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.PERSON_OCCASION
                        else None
                    ),
                    slack_task=(
                        slack_tasks_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.SLACK_TASK
                        else None
                    ),
                    email_task=(
                        email_tasks_by_ref_id[it.source_entity_ref_id_for_sure]
                        if it.source == InboxTaskSource.EMAIL_TASK
                        else None
                    ),
                    note=notes_by_inbox_task_ref_id.get(it.ref_id, None),
                    time_event_blocks=time_event_blocks_by_inbox_task_ref_id.get(
                        it.ref_id, None
                    ),
                )
                for it in inbox_tasks
            ],
        )

    def _filter_sources_for_generated_tasks(
        self, sources: list[InboxTaskSource]
    ) -> list[InboxTaskSource]:
        return [s for s in sources if not s.allow_user_changes]

    def _filter_sources_for_user_tasks(
        self, sources: list[InboxTaskSource]
    ) -> list[InboxTaskSource]:
        return [s for s in sources if s.allow_user_changes]
