"""The command for finding a inbox task."""

from collections import defaultdict

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
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
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.metrics.root import Metric
from jupiter.core.persons.collection import PersonCollection
from jupiter.core.persons.root import Person
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
from jupiter.core.working_mem.root import WorkingMem
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

    allow_archived: bool
    include_notes: bool
    include_time_event_blocks: bool
    filter_just_workable: bool | None
    filter_just_user: bool | None
    filter_just_generated: bool | None
    filter_ref_ids: list[EntityId] | None
    filter_project_ref_ids: list[EntityId] | None
    filter_sources: list[InboxTaskSource] | None
    filter_source_entity_ref_ids: list[EntityId] | None


@use_case_result_part
class InboxTaskFindResultEntry(UseCaseResultBase):
    """A single entry in the load all inbox tasks response."""

    inbox_task: InboxTask
    note: Note | None
    project: Project
    chapter: Chapter | None
    goal: Goal | None
    time_event_blocks: list[TimeEventInDayBlock] | None
    working_mem: WorkingMem | None
    time_plan: TimePlan | None
    habit: Habit | None
    chore: Chore | None
    big_plan: BigPlan | None
    journal: Journal | None
    metric: Metric | None
    person: Person | None
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
        workspace = context.workspace

        if args.filter_just_user and args.filter_just_generated:
            raise InputValidationError(
                "Cannot filter for both user tasks and generated tasks at the same time"
            )

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.filter_project_ref_ids is not None
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
        person_collection = await uow.get_for(PersonCollection).load_by_parent(
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

        projects = await uow.get_for(Project).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_project_ref_ids or NoFilter(),
        )
        project_by_ref_id = {p.ref_id: p for p in projects}

        chapters = await uow.get_for(Chapter).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=args.allow_archived,
            ref_id=NoFilter(),
        )
        chapter_by_ref_id = {c.ref_id: c for c in chapters}

        goals = await uow.get_for(Goal).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=args.allow_archived,
            ref_id=NoFilter(),
        )
        goal_by_ref_id = {g.ref_id: g for g in goals}

        inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            status=filter_status,
            source=filter_sources,
            project_ref_id=args.filter_project_ref_ids or NoFilter(),
            source_entity_ref_id=args.filter_source_entity_ref_ids or NoFilter(),
        )

        working_mems = await uow.get_for(WorkingMem).find_all(
            parent_ref_id=working_mem_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source == InboxTaskSource.WORKING_MEM_CLEANUP
            ],
        )
        working_mems_by_ref_id = {wm.ref_id: wm for wm in working_mems}

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

        persons = await uow.get_for(Person).find_all(
            parent_ref_id=person_collection.ref_id,
            allow_archived=True,
            filter_ref_ids=[
                it.source_entity_ref_id_for_sure
                for it in inbox_tasks
                if it.source
                in {InboxTaskSource.PERSON_BIRTHDAY, InboxTaskSource.PERSON_CATCH_UP}
            ],
        )
        persons_by_ref_id = {p.ref_id: p for p in persons}

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
        if args.include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                domain=NoteDomain.INBOX_TASK,
                allow_archived=True,
                source_entity_ref_id=[it.ref_id for it in inbox_tasks],
            )
            for note in notes:
                notes_by_inbox_task_ref_id[note.source_entity_ref_id] = note

        time_event_blocks_by_inbox_task_ref_id: defaultdict[
            EntityId, list[TimeEventInDayBlock]
        ] = defaultdict(list)
        if args.include_time_event_blocks:
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

        return InboxTaskFindResult(
            entries=[
                InboxTaskFindResultEntry(
                    inbox_task=it,
                    project=project_by_ref_id[it.project_ref_id],
                    chapter=(
                        chapter_by_ref_id[it.chapter_ref_id]
                        if it.chapter_ref_id
                        else None
                    ),
                    goal=goal_by_ref_id[it.goal_ref_id] if it.goal_ref_id else None,
                    working_mem=(
                        working_mems_by_ref_id[it.source_entity_ref_id_for_sure]
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
                        if it.source == InboxTaskSource.PERSON_BIRTHDAY
                        or it.source == InboxTaskSource.PERSON_CATCH_UP
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
