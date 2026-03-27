"""Generate tasks for a workspace."""

import typing
from collections import defaultdict
from typing import Final, Sequence, cast

from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common import schedules
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import ContactLinkRepository
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.service.remove import (
    InboxTaskRemoveService,
)
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.log import GenLog
from jupiter.core.gen.log_entry import GenLogEntry
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.root import Habit
from jupiter.core.habits.service.streak_recorder import (
    HabitStreakRecorderService,
)
from jupiter.core.infer_sync_targets import (
    infer_sync_targets_for_enabled_features,
)
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.root import Journal
from jupiter.core.journals.source import JournalSource
from jupiter.core.journals.stats import (
    JournalStats,
    JournalStatsRepository,
)
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
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
from jupiter.core.sync_target import (
    SyncTarget,
)
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.source import TimePlanSource
from jupiter.core.users.root import User
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.vacations.root import Vacation
from jupiter.core.working_mem.collection import (
    WorkingMemCollection,
)
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import NoFilter
from jupiter.framework.progress_reporter.reporter import (
    ProgressReporter,
)
from jupiter.framework.storage.repository import DomainStorageEngine
from jupiter.framework.use_case import UnavailableForContextError


class GenService:
    """Shared service for performing garbage collection."""

    _domain_storage_engine: Final[DomainStorageEngine]

    def __init__(
        self,
        domain_storage_engine: DomainStorageEngine,
    ) -> None:
        """Constructor."""
        self._domain_storage_engine = domain_storage_engine

    async def do_it(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        user: User,
        workspace: Workspace,
        gen_even_if_not_modified: bool,
        today: ADate,
        gen_targets: list[SyncTarget],
        period: list[RecurringTaskPeriod] | None,
        filter_aspect_ref_ids: list[EntityId] | None = None,
        filter_habit_ref_ids: list[EntityId] | None = None,
        filter_chore_ref_ids: list[EntityId] | None = None,
        filter_metric_ref_ids: list[EntityId] | None = None,
        filter_person_ref_ids: list[EntityId] | None = None,
        filter_slack_task_ref_ids: list[EntityId] | None = None,
        filter_email_task_ref_ids: list[EntityId] | None = None,
    ) -> None:
        """Execute the service's action."""
        big_diff = list(
            set(gen_targets).difference(
                infer_sync_targets_for_enabled_features(user, workspace, gen_targets)
            )
        )
        if len(big_diff) > 0:
            raise UnavailableForContextError(
                f"Gen targets {','.join(s.value for s in big_diff)} are not supported in this workspace"
            )

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and filter_aspect_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
        if (
            not workspace.is_feature_available(WorkspaceFeature.HABITS)
            and filter_habit_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.HABITS)
        if (
            not workspace.is_feature_available(WorkspaceFeature.CHORES)
            and filter_chore_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.CHORES)
        if (
            not workspace.is_feature_available(WorkspaceFeature.METRICS)
            and filter_metric_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.METRICS)
        if (
            not workspace.is_feature_available(WorkspaceFeature.PRM)
            and filter_person_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.PRM)
        if (
            not workspace.is_feature_available(WorkspaceFeature.SLACK_TASKS)
            and filter_slack_task_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.SLACK_TASKS)
        if (
            not workspace.is_feature_available(WorkspaceFeature.EMAIL_TASKS)
            and filter_email_task_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.EMAIL_TASKS)

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            gen_log = await uow.get_for(GenLog).load_by_parent(workspace.ref_id)
            gen_log_entry = GenLogEntry.new_log_entry(
                ctx,
                gen_log_ref_id=gen_log.ref_id,
                gen_even_if_not_modified=gen_even_if_not_modified,
                today=today,
                gen_targets=gen_targets,
                period=period,
                filter_aspect_ref_ids=filter_aspect_ref_ids,
                filter_habit_ref_ids=filter_habit_ref_ids,
                filter_chore_ref_ids=filter_chore_ref_ids,
                filter_metric_ref_ids=filter_metric_ref_ids,
                filter_person_ref_ids=filter_person_ref_ids,
                filter_slack_task_ref_ids=filter_slack_task_ref_ids,
                filter_email_task_ref_ids=filter_email_task_ref_ids,
            )
            gen_log_entry = await uow.get_for(GenLogEntry).create(gen_log_entry)

            vacation_collection = await uow.get_for(VacationCollection).load_by_parent(
                workspace.ref_id,
            )
            all_vacations = await uow.get_for(Vacation).find_all(
                parent_ref_id=vacation_collection.ref_id,
            )
            life_plan = await uow.get_for(LifePlan).load_by_parent(
                workspace.ref_id,
            )
            all_syncable_aspects = await uow.get_for(Aspect).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=False,
                ref_id=filter_aspect_ref_ids or NoFilter(),
            )
            filter_aspect_ref_ids = [p.ref_id for p in all_syncable_aspects]

            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            journal_collection = await uow.get_for(JournalCollection).load_by_parent(
                workspace.ref_id,
            )
            working_mem_collection = await uow.get_for(
                WorkingMemCollection
            ).load_by_parent(
                workspace.ref_id,
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
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
                workspace.ref_id,
            )

        if (
            workspace.is_feature_available(WorkspaceFeature.WORKING_MEM)
            and SyncTarget.WORKING_MEM in gen_targets
        ):
            async with progress_reporter.section(
                "Generating working mem cleanup tasks"
            ):
                schedule = schedules.get_schedule(
                    working_mem_collection.generation_period,
                    EntityName("Cleanup WorkingMem.txt"),
                    today.to_timestamp_at_end_of_day(),
                    None,
                    None,
                    None,
                    None,
                    None,
                )

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_cleanup_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        source=[InboxTaskSource.WORKING_MEM_CLEANUP],
                        allow_archived=True,
                    )

                all_inbox_tasks_by_timeline = {}
                for inbox_task in all_cleanup_inbox_tasks:
                    if inbox_task.recurring_timeline is None:
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}'",
                        )
                    all_inbox_tasks_by_timeline[inbox_task.recurring_timeline] = (
                        inbox_task
                    )

                found_inbox_task = all_inbox_tasks_by_timeline.get(
                    schedule.timeline, None
                )

                if found_inbox_task:
                    if (
                        not gen_even_if_not_modified
                        and found_inbox_task.last_modified_time
                        >= working_mem_collection.last_modified_time
                    ):
                        pass
                    else:
                        found_inbox_task = (
                            found_inbox_task.update_link_to_working_mem_cleanup(
                                ctx,
                                name=schedule.full_name,
                                recurring_timeline=schedule.timeline,
                                due_date=schedule.due_date,
                            )
                        )

                        async with (
                            self._domain_storage_engine.get_unit_of_work() as uow
                        ):
                            await uow.get_for(InboxTask).save(found_inbox_task)
                        gen_log_entry = gen_log_entry.add_entity_updated(
                            ctx,
                            found_inbox_task,
                        )
                else:
                    inbox_task = InboxTask.new_inbox_task_for_working_mem_cleanup(
                        ctx,
                        inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                        name=schedule.full_name,
                        due_date=schedule.due_date,
                        working_mem_collection_ref_id=working_mem_collection.ref_id,
                        recurring_task_timeline=schedule.timeline,
                        recurring_task_gen_right_now=today.to_timestamp_at_end_of_day(),
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        inbox_task = await uow.get_for(InboxTask).create(inbox_task)
                    gen_log_entry = gen_log_entry.add_entity_created(
                        ctx,
                        inbox_task,
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.TIME_PLANS)
            and SyncTarget.TIME_PLANS in gen_targets
        ):
            async with progress_reporter.section("Generating time plans"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_time_plans = await uow.get_for(TimePlan).find_all_generic(
                        parent_ref_id=time_plan_domain.ref_id,
                        allow_archived=False,
                    )

                all_time_plans_by_timeline = {}
                for time_plan in all_time_plans:
                    all_time_plans_by_timeline[time_plan.timeline] = time_plan

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        source=[InboxTaskSource.TIME_PLAN],
                        source_entity_ref_id=(
                            [tp.ref_id for tp in all_time_plans]
                            if all_time_plans
                            else NoFilter()
                        ),
                    )

                all_inbox_tasks_by_timeline = {}
                for inbox_task in all_inbox_tasks:
                    if (
                        inbox_task.source_entity_ref_id is None
                        or inbox_task.recurring_timeline is None
                    ):
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}'",
                        )
                    all_inbox_tasks_by_timeline[inbox_task.recurring_timeline] = (
                        inbox_task
                    )

                gen_log_entry = await self._generate_time_plans_and_planning_tasks_for_time_plan_domain(
                    ctx,
                    progress_reporter=progress_reporter,
                    user=user,
                    inbox_task_collection=inbox_task_collection,
                    note_collection=note_collection,
                    today=today,
                    period_filter=frozenset(period) if period else None,
                    time_plan_domain=time_plan_domain,
                    all_time_plans_by_timeline=all_time_plans_by_timeline,
                    all_inbox_tasks_by_timeline=all_inbox_tasks_by_timeline,
                    gen_even_if_not_modified=gen_even_if_not_modified,
                    gen_log_entry=gen_log_entry,
                )

        if (
            workspace.is_feature_available(WorkspaceFeature.HABITS)
            and SyncTarget.HABITS in gen_targets
        ):
            async with progress_reporter.section("Generating habits"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_habits = await uow.get_for(Habit).find_all_generic(
                        parent_ref_id=habit_collection.ref_id,
                        allow_archived=False,
                        ref_id=filter_habit_ref_ids or NoFilter(),
                        aspect_ref_id=filter_aspect_ref_ids or NoFilter(),
                    )

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_collection_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        source=[InboxTaskSource.HABIT],
                        allow_archived=True,
                        source_entity_ref_id=(
                            [rt.ref_id for rt in all_habits]
                            if all_habits
                            else NoFilter()
                        ),
                    )

                all_inbox_tasks_by_habit_ref_id_and_timeline: dict[
                    tuple[EntityId, str],
                    list[InboxTask],
                ] = defaultdict(list)
                for inbox_task in all_collection_inbox_tasks:
                    if (
                        inbox_task.source_entity_ref_id is None
                        or inbox_task.recurring_timeline is None
                    ):
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}'",
                        )
                    all_inbox_tasks_by_habit_ref_id_and_timeline[
                        (inbox_task.source_entity_ref_id, inbox_task.recurring_timeline)
                    ].append(inbox_task)

                for habit in all_habits:
                    gen_log_entry = await self._generate_inbox_tasks_for_habit(
                        ctx,
                        progress_reporter=progress_reporter,
                        user=user,
                        inbox_task_collection=inbox_task_collection,
                        today=today,
                        period_filter=frozenset(period) if period else None,
                        habit=habit,
                        all_inbox_tasks_by_habit_ref_id_and_timeline=all_inbox_tasks_by_habit_ref_id_and_timeline,
                        gen_even_if_not_modified=gen_even_if_not_modified,
                        gen_log_entry=gen_log_entry,
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.CHORES)
            and SyncTarget.CHORES in gen_targets
        ):
            async with progress_reporter.section("Generating chores"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_chores = await uow.get_for(Chore).find_all_generic(
                        parent_ref_id=chore_collection.ref_id,
                        allow_archived=False,
                        ref_id=filter_chore_ref_ids or NoFilter(),
                        aspect_ref_id=filter_aspect_ref_ids or NoFilter(),
                    )

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_collection_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        source=[InboxTaskSource.CHORE],
                        allow_archived=True,
                        source_entity_ref_id=(
                            [rt.ref_id for rt in all_chores]
                            if all_chores
                            else NoFilter()
                        ),
                    )

                all_inbox_tasks_by_chore_ref_id_and_timeline = {}
                for inbox_task in all_collection_inbox_tasks:
                    if (
                        inbox_task.source_entity_ref_id is None
                        or inbox_task.recurring_timeline is None
                    ):
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}'",
                        )
                    all_inbox_tasks_by_chore_ref_id_and_timeline[
                        (inbox_task.source_entity_ref_id, inbox_task.recurring_timeline)
                    ] = inbox_task

                for chore in all_chores:
                    gen_log_entry = await self._generate_inbox_tasks_for_chore(
                        ctx,
                        progress_reporter=progress_reporter,
                        user=user,
                        workspace=workspace,
                        inbox_task_collection=inbox_task_collection,
                        today=today,
                        period_filter=frozenset(period) if period else None,
                        all_vacations=all_vacations,
                        chore=chore,
                        all_inbox_tasks_by_chore_ref_id_and_timeline=all_inbox_tasks_by_chore_ref_id_and_timeline,
                        gen_even_if_not_modified=gen_even_if_not_modified,
                        gen_log_entry=gen_log_entry,
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.JOURNALS)
            and SyncTarget.JOURNALS in gen_targets
        ):
            async with progress_reporter.section("Generating journals"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_journals = await uow.get_for(Journal).find_all_generic(
                        parent_ref_id=journal_collection.ref_id,
                        allow_archived=False,
                    )

                all_journals_by_timeline = {}
                for journal in all_journals:
                    all_journals_by_timeline[journal.timeline] = journal

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        source=[InboxTaskSource.JOURNAL],
                        source_entity_ref_id=(
                            [j.ref_id for j in all_journals]
                            if all_journals
                            else NoFilter()
                        ),
                    )

                all_writing_tasks_by_timeline = {}
                for inbox_task in all_inbox_tasks:
                    if (
                        inbox_task.source_entity_ref_id is None
                        or inbox_task.recurring_timeline is None
                    ):
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}'",
                        )
                    all_writing_tasks_by_timeline[inbox_task.recurring_timeline] = (
                        inbox_task
                    )

                gen_log_entry = await self._generate_journals_and_writing_tasks_for_journal_collection(
                    ctx,
                    progress_reporter=progress_reporter,
                    workspace=workspace,
                    user=user,
                    inbox_task_collection=inbox_task_collection,
                    note_collection=note_collection,
                    today=today,
                    period_filter=frozenset(period) if period else None,
                    journal_collection=journal_collection,
                    all_journals_by_timeline=all_journals_by_timeline,
                    all_writing_tasks_by_timeline=all_writing_tasks_by_timeline,
                    gen_even_if_not_modified=gen_even_if_not_modified,
                    gen_log_entry=gen_log_entry,
                )

        if (
            workspace.is_feature_available(WorkspaceFeature.METRICS)
            and SyncTarget.METRICS in gen_targets
        ):
            async with progress_reporter.section("Generating for metrics"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    metric_collection = await uow.get_for(
                        MetricCollection
                    ).load_by_parent(
                        workspace.ref_id,
                    )
                    all_metrics = await uow.get_for(Metric).find_all(
                        parent_ref_id=metric_collection.ref_id,
                        filter_ref_ids=filter_metric_ref_ids,
                    )

                    all_collection_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        source=[InboxTaskSource.METRIC],
                        allow_archived=True,
                        source_entity_ref_id=(
                            [m.ref_id for m in all_metrics]
                            if all_metrics
                            else NoFilter()
                        ),
                    )

                all_collection_inbox_tasks_by_metric_ref_id_and_timeline = {}

                for inbox_task in all_collection_inbox_tasks:
                    if (
                        inbox_task.source_entity_ref_id is None
                        or inbox_task.recurring_timeline is None
                    ):
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}'",
                        )
                    all_collection_inbox_tasks_by_metric_ref_id_and_timeline[
                        (inbox_task.source_entity_ref_id, inbox_task.recurring_timeline)
                    ] = inbox_task

                for metric in all_metrics:
                    if metric.collection_params is None:
                        continue

                    # MyPy not smart enough to infer that if (not A and not B) then (A or B)
                    gen_log_entry = await self._generate_collection_inbox_tasks_for_metric(
                        ctx,
                        progress_reporter=progress_reporter,
                        user=user,
                        inbox_task_collection=inbox_task_collection,
                        today=today,
                        period_filter=frozenset(period) if period else None,
                        metric=metric,
                        collection_params=metric.collection_params,
                        all_inbox_tasks_by_metric_ref_id_and_timeline=all_collection_inbox_tasks_by_metric_ref_id_and_timeline,
                        gen_even_if_not_modified=gen_even_if_not_modified,
                        gen_log_entry=gen_log_entry,
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.PRM)
            and SyncTarget.PERSONS in gen_targets
        ):
            async with progress_reporter.section("Generating for persons"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    prm = await uow.get_for(PRM).load_by_parent(
                        workspace.ref_id,
                    )
                    all_persons = await uow.get_for(Person).find_all(
                        parent_ref_id=prm.ref_id,
                        filter_ref_ids=filter_person_ref_ids,
                    )
                    contact_domain = await uow.get_for(ContactDomain).load_by_parent(
                        workspace.ref_id
                    )
                    all_person_contact_links = await uow.get(
                        ContactLinkRepository
                    ).find_all_generic(
                        namespace=ContactNamespace.PERSON,
                        source_entity_ref_id=(
                            [p.ref_id for p in all_persons]
                            if all_persons
                            else NoFilter()
                        ),
                    )
                    person_contact_ref_id_by_person_ref_id = {
                        link.source_entity_ref_id: link.contacts_ref_ids[0]
                        for link in all_person_contact_links
                        if len(link.contacts_ref_ids) > 0
                    }
                    all_person_contacts = await uow.get_for(Contact).find_all_generic(
                        parent_ref_id=contact_domain.ref_id,
                        allow_archived=True,
                        ref_id=(
                            list(person_contact_ref_id_by_person_ref_id.values())
                            if person_contact_ref_id_by_person_ref_id
                            else NoFilter()
                        ),
                    )
                    all_person_contacts_by_ref_id = {
                        contact.ref_id: contact for contact in all_person_contacts
                    }
                    person_contact_name_by_person_ref_id = {
                        person_ref_id: all_person_contacts_by_ref_id[
                            contact_ref_id
                        ].name
                        for person_ref_id, contact_ref_id in person_contact_ref_id_by_person_ref_id.items()
                        if contact_ref_id in all_person_contacts_by_ref_id
                    }

                    all_catch_up_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        source=[InboxTaskSource.PERSON_CATCH_UP],
                        source_entity_ref_id=(
                            [m.ref_id for m in all_persons]
                            if all_persons
                            else NoFilter()
                        ),
                    )
                    all_occasions = await uow.get_for(Occasion).find_all_generic(
                        person_ref_id=[p.ref_id for p in all_persons] or NoFilter(),
                        allow_archived=False,
                    )
                    all_occasion_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        source=[InboxTaskSource.PERSON_OCCASION],
                        source_entity_ref_id=(
                            [o.ref_id for o in all_occasions]
                            if all_occasions
                            else NoFilter()
                        ),
                    )
                    all_occasion_time_event_blocks = await uow.get_for(
                        TimeEventFullDaysBlock
                    ).find_all_generic(
                        parent_ref_id=time_event_domain.ref_id,
                        allow_archived=False,
                        namespace=TimeEventNamespace.PERSON_OCCASION,
                        source_entity_ref_id=(
                            [o.ref_id for o in all_occasions]
                            if all_occasions
                            else NoFilter()
                        ),
                    )

                all_catch_up_inbox_tasks_by_person_ref_id_and_timeline = {}
                for inbox_task in all_catch_up_inbox_tasks:
                    if (
                        inbox_task.source_entity_ref_id is None
                        or inbox_task.recurring_timeline is None
                    ):
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}'",
                        )
                    all_catch_up_inbox_tasks_by_person_ref_id_and_timeline[
                        (inbox_task.source_entity_ref_id, inbox_task.recurring_timeline)
                    ] = inbox_task

                for person in all_persons:
                    if person.catch_up_params is None:
                        continue
                    person_contact_name = person_contact_name_by_person_ref_id.get(
                        person.ref_id
                    )
                    if person_contact_name is None:
                        continue

                    # MyPy not smart enough to infer that if (not A and not B) then (A or B)

                    gen_log_entry = await self._generate_catch_up_inbox_tasks_for_person(
                        ctx,
                        progress_reporter=progress_reporter,
                        user=user,
                        inbox_task_collection=inbox_task_collection,
                        today=today,
                        period_filter=frozenset(period) if period else None,
                        person=person,
                        person_contact_name=person_contact_name,
                        catch_up_params=person.catch_up_params,
                        all_inbox_tasks_by_person_ref_id_and_timeline=all_catch_up_inbox_tasks_by_person_ref_id_and_timeline,
                        gen_even_if_not_modified=gen_even_if_not_modified,
                        gen_log_entry=gen_log_entry,
                    )

            all_occasion_inbox_tasks_by_occasion_ref_id_and_timeline = {}
            for inbox_task in all_occasion_inbox_tasks:
                if (
                    inbox_task.source_entity_ref_id is None
                    or inbox_task.recurring_timeline is None
                ):
                    raise Exception(
                        f"Expected that inbox task with id='{inbox_task.ref_id}'",
                    )
                all_occasion_inbox_tasks_by_occasion_ref_id_and_timeline[
                    (inbox_task.source_entity_ref_id, inbox_task.recurring_timeline)
                ] = inbox_task

            all_occasion_time_event_blocks_by_occasion_ref_id_and_start_date = {}
            for time_event_block in all_occasion_time_event_blocks:
                all_occasion_time_event_blocks_by_occasion_ref_id_and_start_date[
                    (time_event_block.source_entity_ref_id, time_event_block.start_date)
                ] = time_event_block

            all_persons_by_ref_id = {p.ref_id: p for p in all_persons}

            for occasion in all_occasions:
                person = all_persons_by_ref_id[occasion.person.ref_id]
                person_contact_name = person_contact_name_by_person_ref_id.get(
                    person.ref_id
                )
                if person_contact_name is None:
                    continue

                for idx in range(5):
                    gen_log_entry = await self._generate_time_event_block_for_occasion(
                        ctx,
                        progress_reporter=progress_reporter,
                        time_event_domain=time_event_domain,
                        today=today.add_days(idx * 365),
                        occasion=occasion,
                        all_occasion_time_event_blocks_by_occasion_ref_id_and_start_date=all_occasion_time_event_blocks_by_occasion_ref_id_and_start_date,
                        gen_even_if_not_modified=gen_even_if_not_modified,
                        gen_log_entry=gen_log_entry,
                    )

                    gen_log_entry = await self._generate_inbox_task_for_occasion(
                        ctx,
                        progress_reporter=progress_reporter,
                        user=user,
                        inbox_task_collection=inbox_task_collection,
                        today=today.add_days(idx * 365),
                        person=person,
                        person_contact_name=person_contact_name,
                        occasion=occasion,
                        all_inbox_tasks_by_occasion_ref_id_and_timeline=all_occasion_inbox_tasks_by_occasion_ref_id_and_timeline,
                        gen_even_if_not_modified=gen_even_if_not_modified,
                        gen_log_entry=gen_log_entry,
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.SLACK_TASKS)
            and SyncTarget.SLACK_TASKS in gen_targets
        ):
            async with progress_reporter.section("Generating for Slack tasks"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    push_integration_group = await uow.get_for(
                        PushIntegrationGroup
                    ).load_by_parent(
                        workspace.ref_id,
                    )
                    slack_collection = await uow.get_for(
                        SlackTaskCollection
                    ).load_by_parent(
                        push_integration_group.ref_id,
                    )

                    all_slack_tasks = await uow.get_for(SlackTask).find_all(
                        parent_ref_id=slack_collection.ref_id,
                        filter_ref_ids=filter_slack_task_ref_ids,
                    )
                    all_slack_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        source=[InboxTaskSource.SLACK_TASK],
                        source_entity_ref_id=(
                            [st.ref_id for st in all_slack_tasks]
                            if all_slack_tasks
                            else NoFilter()
                        ),
                    )

                all_inbox_tasks_by_slack_task_ref_id = {
                    it.source_entity_ref_id: it for it in all_slack_inbox_tasks
                }
                for slack_task in all_slack_tasks:
                    gen_log_entry = (
                        await self._generate_slack_inbox_task_for_slack_task(
                            ctx,
                            progress_reporter=progress_reporter,
                            slack_task=slack_task,
                            inbox_task_collection=inbox_task_collection,
                            all_inbox_tasks_by_slack_task_ref_id=typing.cast(
                                dict[EntityId, InboxTask],
                                all_inbox_tasks_by_slack_task_ref_id,
                            ),
                            gen_even_if_not_modified=gen_even_if_not_modified,
                            gen_log_entry=gen_log_entry,
                        )
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.EMAIL_TASKS)
            and SyncTarget.EMAIL_TASKS in gen_targets
        ):
            async with progress_reporter.section("Generating for email tasks"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    push_integration_group = await uow.get_for(
                        PushIntegrationGroup
                    ).load_by_parent(
                        workspace.ref_id,
                    )
                    email_collection = await uow.get_for(
                        EmailTaskCollection
                    ).load_by_parent(
                        push_integration_group.ref_id,
                    )

                    all_email_tasks = await uow.get_for(EmailTask).find_all(
                        parent_ref_id=email_collection.ref_id,
                        filter_ref_ids=filter_email_task_ref_ids,
                    )
                    all_email_inbox_tasks = await uow.get_for(
                        InboxTask
                    ).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        source=[InboxTaskSource.EMAIL_TASK],
                        source_entity_ref_id=(
                            [st.ref_id for st in all_email_tasks]
                            if all_email_tasks
                            else NoFilter()
                        ),
                    )

                all_inbox_tasks_by_email_task_ref_id = {
                    it.source_entity_ref_id: it for it in all_email_inbox_tasks
                }
                for email_task in all_email_tasks:
                    gen_log_entry = (
                        await self._generate_email_inbox_task_for_email_task(
                            ctx,
                            progress_reporter=progress_reporter,
                            email_task=email_task,
                            inbox_task_collection=inbox_task_collection,
                            all_inbox_tasks_by_email_task_ref_id=typing.cast(
                                dict[EntityId, InboxTask],
                                all_inbox_tasks_by_email_task_ref_id,
                            ),
                            gen_even_if_not_modified=gen_even_if_not_modified,
                            gen_log_entry=gen_log_entry,
                        )
                    )

        if (
            workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and SyncTarget.LIFE_PLAN_EVAL in gen_targets
        ):
            async with progress_reporter.section("Generating life plan eval tasks"):
                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    all_eval_tasks = await uow.get_for(InboxTask).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=True,
                        source=[InboxTaskSource.LIFE_PLAN_EVAL],
                    )

                all_eval_tasks_by_timeline: dict[str, InboxTask] = {}
                for inbox_task in all_eval_tasks:
                    if inbox_task.recurring_timeline is None:
                        raise Exception(
                            f"Expected that inbox task with id='{inbox_task.ref_id}' has a recurring timeline",
                        )
                    all_eval_tasks_by_timeline[inbox_task.recurring_timeline] = (
                        inbox_task
                    )

                gen_log_entry = await self._generate_eval_tasks_for_life_plan(
                    ctx,
                    progress_reporter=progress_reporter,
                    inbox_task_collection=inbox_task_collection,
                    today=today,
                    period_filter=frozenset(period) if period else None,
                    life_plan=life_plan,
                    all_eval_tasks_by_timeline=all_eval_tasks_by_timeline,
                    gen_even_if_not_modified=gen_even_if_not_modified,
                    gen_log_entry=gen_log_entry,
                )

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            gen_log_entry = gen_log_entry.close(ctx)
            gen_log_entry = await uow.get_for(GenLogEntry).save(gen_log_entry)

    async def _generate_time_plans_and_planning_tasks_for_time_plan_domain(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        user: User,
        inbox_task_collection: InboxTaskCollection,
        note_collection: NoteCollection,
        today: ADate,
        period_filter: frozenset[RecurringTaskPeriod] | None,
        time_plan_domain: TimePlanDomain,
        all_time_plans_by_timeline: dict[str, TimePlan],
        all_inbox_tasks_by_timeline: dict[str, InboxTask],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        for period in time_plan_domain.periods:
            if period_filter is not None and period not in period_filter:
                continue

            if time_plan_domain.generation_approach.should_do_nothing:
                continue

            real_today = today.add_days(
                time_plan_domain.generation_in_advance_days[period]
            )

            schedule = schedules.get_schedule(
                period,
                EntityName(f"Make {period.value} plan for"),
                real_today.to_timestamp_at_end_of_day(),
            )

            if not schedule.should_keep:
                continue

            found_time_plan = all_time_plans_by_timeline.get(schedule.timeline, None)
            found_planning_task = all_inbox_tasks_by_timeline.get(
                schedule.timeline, None
            )

            if (
                found_time_plan
                and found_time_plan.source is not TimePlanSource.GENERATED
            ):
                continue

            if time_plan_domain.generation_approach.should_generate_a_time_plan:
                if found_time_plan:
                    if (
                        not gen_even_if_not_modified
                        and found_time_plan.last_modified_time
                        >= time_plan_domain.last_modified_time
                    ):
                        continue

                    found_time_plan = found_time_plan.update_link_to_time_plan_domain(
                        ctx,
                        right_now=real_today,
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        await uow.get_for(TimePlan).save(found_time_plan)
                        await progress_reporter.mark_updated(found_time_plan)
                    gen_log_entry = gen_log_entry.add_entity_updated(
                        ctx,
                        found_time_plan,
                    )
                else:
                    time_plan = TimePlan.new_time_plan_generated(
                        ctx,
                        time_plan_domain_ref_id=time_plan_domain.ref_id,
                        right_now=real_today,
                        period=period,
                        timeline=schedule.timeline,
                        start_date=schedule.first_day,
                        end_date=schedule.end_day,
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        time_plan = await uow.get_for(TimePlan).create(time_plan)
                        await progress_reporter.mark_created(time_plan)
                    gen_log_entry = gen_log_entry.add_entity_created(
                        ctx,
                        time_plan,
                    )

                    new_note = Note.new_note(
                        ctx,
                        note_collection_ref_id=note_collection.ref_id,
                        namespace=NoteNamespace.TIME_PLAN,
                        source_entity_ref_id=time_plan.ref_id,
                        content=[],
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        new_note = await uow.get_for(Note).create(new_note)

                    found_time_plan = time_plan

            if time_plan_domain.generation_approach.should_generate_a_planning_task:
                if time_plan_domain.planning_task_gen_params is None:
                    raise Exception("Planning task gen params is not set")
                gen_params = time_plan_domain.planning_task_gen_params

                if found_planning_task:
                    if (
                        not gen_even_if_not_modified
                        and found_planning_task.last_modified_time
                        >= time_plan_domain.last_modified_time
                    ):
                        continue

                    found_planning_task = found_planning_task.update_link_to_time_plan(
                        ctx,
                        eisen=gen_params.eisen,
                        difficulty=gen_params.difficulty,
                        due_date=cast(TimePlan, found_time_plan).start_date,
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        await uow.get_for(InboxTask).save(found_planning_task)
                    gen_log_entry = gen_log_entry.add_entity_updated(
                        ctx,
                        found_planning_task,
                    )
                else:
                    inbox_task = InboxTask.new_inbox_task_for_time_plan(
                        ctx,
                        inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                        name=schedule.full_name,
                        eisen=gen_params.eisen,
                        difficulty=gen_params.difficulty,
                        actionable_date=schedule.actionable_date,
                        due_date=cast(TimePlan, found_time_plan).start_date,
                        time_plan_ref_id=cast(TimePlan, found_time_plan).ref_id,
                        recurring_task_timeline=schedule.timeline,
                        recurring_task_gen_right_now=real_today.to_timestamp_at_end_of_day(),
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        inbox_task = await uow.get_for(InboxTask).create(inbox_task)
                    gen_log_entry = gen_log_entry.add_entity_created(
                        ctx,
                        inbox_task,
                    )

        return gen_log_entry

    async def _generate_inbox_tasks_for_habit(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        user: User,
        inbox_task_collection: InboxTaskCollection,
        today: ADate,
        period_filter: frozenset[RecurringTaskPeriod] | None,
        habit: Habit,
        all_inbox_tasks_by_habit_ref_id_and_timeline: dict[
            tuple[EntityId, str],
            list[InboxTask],
        ],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        if habit.suspended:
            return gen_log_entry

        if period_filter is not None and habit.gen_params.period not in period_filter:
            return gen_log_entry

        schedule = schedules.get_schedule(
            habit.gen_params.period,
            habit.name,
            today.to_timestamp_at_end_of_day(),
            habit.gen_params.skip_rule,
            habit.gen_params.actionable_from_day,
            habit.gen_params.actionable_from_month,
            habit.gen_params.due_at_day,
            habit.gen_params.due_at_month,
        )

        if not schedule.should_keep:
            return gen_log_entry

        all_found_tasks_by_repeat_index: dict[int, InboxTask] = {
            cast(int, ft.recurring_repeat_index): ft
            for ft in all_inbox_tasks_by_habit_ref_id_and_timeline.get(
                (habit.ref_id, schedule.timeline),
                [],
            )
        }
        repeat_idx_to_keep: set[int] = set()

        task_ranges: Sequence[tuple[ADate | None, ADate]]
        if habit.repeats_in_period_count is not None:
            if habit.repeats_strategy is None:
                raise ValueError("Repeats strategy is not set")
            task_ranges = habit.repeats_strategy.spread_tasks(
                start_date=schedule.first_day,
                end_date=schedule.end_day,
                repeats_in_period=habit.repeats_in_period_count,
            )
        else:
            task_ranges = [(schedule.actionable_date, schedule.due_date)]

        remaining_tasks: set[InboxTask] = set()

        for task_idx in range(habit.repeats_in_period_count or 1):
            found_task = all_found_tasks_by_repeat_index.get(task_idx, None)

            if found_task:
                repeat_idx_to_keep.add(task_idx)
                if (
                    not gen_even_if_not_modified
                    and found_task.last_modified_time >= habit.last_modified_time
                ):
                    remaining_tasks.add(found_task)
                    continue

                found_task = found_task.update_link_to_habit(
                    ctx,
                    name=schedule.full_name,
                    timeline=schedule.timeline,
                    is_key=habit.is_key,
                    repeat_index=task_idx,
                    repeats_in_period_count=habit.repeats_in_period_count,
                    actionable_date=task_ranges[task_idx][0],
                    due_date=task_ranges[task_idx][1],
                    eisen=habit.gen_params.eisen,
                    difficulty=habit.gen_params.difficulty,
                )

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    found_task = await uow.get_for(InboxTask).save(found_task)

                remaining_tasks.add(found_task)
                gen_log_entry = gen_log_entry.add_entity_updated(
                    ctx,
                    found_task,
                )
            else:
                inbox_task = InboxTask.new_inbox_task_for_habit(
                    ctx,
                    inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                    name=schedule.full_name,
                    habit_ref_id=habit.ref_id,
                    recurring_task_timeline=schedule.timeline,
                    recurring_task_repeat_index=task_idx,
                    recurring_task_gen_right_now=today.to_timestamp_at_end_of_day(),
                    is_key=habit.is_key,
                    eisen=habit.gen_params.eisen,
                    difficulty=habit.gen_params.difficulty,
                    actionable_date=task_ranges[task_idx][0],
                    due_date=task_ranges[task_idx][1],
                    repeats_in_period_count=habit.repeats_in_period_count,
                )

                async with self._domain_storage_engine.get_unit_of_work() as uow:
                    inbox_task = await uow.get_for(InboxTask).create(
                        inbox_task,
                    )

                remaining_tasks.add(inbox_task)
                gen_log_entry = gen_log_entry.add_entity_created(
                    ctx,
                    inbox_task,
                )

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            inbox_task_remove_service = InboxTaskRemoveService()
            for task in all_found_tasks_by_repeat_index.values():
                if task.recurring_repeat_index is None:
                    continue
                if task.recurring_repeat_index in repeat_idx_to_keep:
                    continue
                await inbox_task_remove_service.do_it(ctx, uow, progress_reporter, task)
                gen_log_entry = gen_log_entry.add_entity_removed(
                    ctx,
                    task,
                )

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            streak_recorder_service = HabitStreakRecorderService()
            await streak_recorder_service.upsert(
                ctx=ctx,
                uow=uow,
                today=today,
                habit=habit,
                inbox_tasks=remaining_tasks,
            )

        return gen_log_entry

    async def _generate_inbox_tasks_for_chore(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        user: User,
        workspace: Workspace,
        inbox_task_collection: InboxTaskCollection,
        today: ADate,
        period_filter: frozenset[RecurringTaskPeriod] | None,
        all_vacations: list[Vacation],
        chore: Chore,
        all_inbox_tasks_by_chore_ref_id_and_timeline: dict[
            tuple[EntityId, str],
            InboxTask,
        ],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        if chore.suspended:
            return gen_log_entry

        if period_filter is not None and chore.gen_params.period not in period_filter:
            return gen_log_entry

        schedule = schedules.get_schedule(
            chore.gen_params.period,
            chore.name,
            today.to_timestamp_at_end_of_day(),
            chore.gen_params.skip_rule,
            chore.gen_params.actionable_from_day,
            chore.gen_params.actionable_from_month,
            chore.gen_params.due_at_day,
            chore.gen_params.due_at_month,
        )

        if workspace.is_feature_available(WorkspaceFeature.VACATIONS):
            if not chore.must_do:
                for vacation in all_vacations:
                    if vacation.is_in_vacation(schedule.first_day, schedule.end_day):
                        return gen_log_entry

        if not chore.is_in_active_interval(schedule.first_day, schedule.end_day):
            return gen_log_entry

        if not schedule.should_keep:
            return gen_log_entry

        found_task = all_inbox_tasks_by_chore_ref_id_and_timeline.get(
            (chore.ref_id, schedule.timeline),
            None,
        )

        if found_task:
            if (
                not gen_even_if_not_modified
                and found_task.last_modified_time >= chore.last_modified_time
            ):
                return gen_log_entry

            found_task = found_task.update_link_to_chore(
                ctx,
                name=schedule.full_name,
                timeline=schedule.timeline,
                is_key=chore.is_key,
                actionable_date=schedule.actionable_date,
                due_date=schedule.due_date,
                eisen=chore.gen_params.eisen,
                difficulty=chore.gen_params.difficulty,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await uow.get_for(InboxTask).save(found_task)

            gen_log_entry = gen_log_entry.add_entity_updated(
                ctx,
                found_task,
            )
        else:
            inbox_task = InboxTask.new_inbox_task_for_chore(
                ctx,
                inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                name=schedule.full_name,
                chore_ref_id=chore.ref_id,
                recurring_task_timeline=schedule.timeline,
                recurring_task_gen_right_now=today.to_timestamp_at_end_of_day(),
                is_key=chore.is_key,
                eisen=chore.gen_params.eisen,
                difficulty=chore.gen_params.difficulty,
                actionable_date=schedule.actionable_date,
                due_date=schedule.due_date,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                inbox_task = await uow.get_for(InboxTask).create(inbox_task)

            gen_log_entry = gen_log_entry.add_entity_created(
                ctx,
                inbox_task,
            )

        return gen_log_entry

    async def _generate_journals_and_writing_tasks_for_journal_collection(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        workspace: Workspace,
        user: User,
        inbox_task_collection: InboxTaskCollection,
        note_collection: NoteCollection,
        today: ADate,
        period_filter: frozenset[RecurringTaskPeriod] | None,
        journal_collection: JournalCollection,
        all_journals_by_timeline: dict[str, Journal],
        all_writing_tasks_by_timeline: dict[str, InboxTask],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        for period in journal_collection.periods:
            if period_filter is not None and period not in period_filter:
                continue

            if journal_collection.generation_approach.should_do_nothing:
                continue

            real_today = today.add_days(
                journal_collection.generation_in_advance_days[period]
            )

            schedule = schedules.get_schedule(
                period,
                EntityName(f"Write {period.value} journal for"),
                real_today.to_timestamp_at_end_of_day(),
            )

            if not schedule.should_keep:
                continue

            found_journal = all_journals_by_timeline.get(schedule.timeline, None)
            found_writing_task = all_writing_tasks_by_timeline.get(
                schedule.timeline, None
            )

            if found_journal and found_journal.source is not JournalSource.GENERATED:
                continue

            if journal_collection.generation_approach.should_generate_a_journal:
                if found_journal:
                    if (
                        not gen_even_if_not_modified
                        and found_journal.last_modified_time
                        >= journal_collection.last_modified_time
                    ):
                        continue

                    found_journal = found_journal.update_link_to_journal_collection(
                        ctx,
                        right_now=real_today,
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        await uow.get_for(Journal).save(found_journal)
                        await progress_reporter.mark_updated(found_journal)
                    gen_log_entry = gen_log_entry.add_entity_updated(
                        ctx,
                        found_journal,
                    )
                else:
                    journal = Journal.new_journal_generated(
                        ctx,
                        journal_collection_ref_id=journal_collection.ref_id,
                        right_now=real_today,
                        period=period,
                        timeline=schedule.timeline,
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        journal = await uow.get_for(Journal).create(journal)
                        await progress_reporter.mark_created(journal)
                    gen_log_entry = gen_log_entry.add_entity_created(
                        ctx,
                        journal,
                    )

                    new_note = Note.new_note(
                        ctx,
                        note_collection_ref_id=note_collection.ref_id,
                        namespace=NoteNamespace.JOURNAL,
                        source_entity_ref_id=journal.ref_id,
                        content=[],
                    )

                    new_journal_stats = JournalStats.new_stats(
                        ctx,
                        journal_ref_id=journal.ref_id,
                        today=real_today,
                        period=period,
                        sources=workspace.infer_sources_for_enabled_features(None),
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        new_note = await uow.get_for(Note).create(new_note)
                        new_journal_stats = await uow.get(
                            JournalStatsRepository
                        ).create(new_journal_stats)

                    found_journal = journal

            if journal_collection.generation_approach.should_generate_a_writing_task:
                if journal_collection.writing_task_gen_params is None:
                    raise Exception("Writing task gen params is not set")
                gen_params = journal_collection.writing_task_gen_params

                if found_writing_task:
                    if (
                        not gen_even_if_not_modified
                        and found_writing_task.last_modified_time
                        >= journal_collection.last_modified_time
                    ):
                        continue

                    found_writing_task = found_writing_task.update_link_to_journal(
                        ctx,
                        eisen=gen_params.eisen,
                        difficulty=gen_params.difficulty,
                        due_date=schedule.due_date,
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        await uow.get_for(InboxTask).save(found_writing_task)
                    gen_log_entry = gen_log_entry.add_entity_updated(
                        ctx,
                        found_writing_task,
                    )
                else:
                    inbox_task = InboxTask.new_inbox_task_for_journal(
                        ctx,
                        inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                        name=schedule.full_name,
                        eisen=gen_params.eisen,
                        difficulty=gen_params.difficulty,
                        actionable_date=schedule.due_date.add_days(
                            -journal_collection.generation_in_advance_days[period]
                        ),
                        due_date=schedule.due_date,
                        journal_ref_id=cast(Journal, found_journal).ref_id,
                        recurring_task_timeline=schedule.timeline,
                        recurring_task_gen_right_now=real_today.to_timestamp_at_end_of_day(),
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        inbox_task = await uow.get_for(InboxTask).create(inbox_task)
                    gen_log_entry = gen_log_entry.add_entity_created(
                        ctx,
                        inbox_task,
                    )

        return gen_log_entry

    async def _generate_collection_inbox_tasks_for_metric(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        user: User,
        inbox_task_collection: InboxTaskCollection,
        today: ADate,
        period_filter: frozenset[RecurringTaskPeriod] | None,
        metric: Metric,
        collection_params: RecurringTaskGenParams,
        all_inbox_tasks_by_metric_ref_id_and_timeline: dict[
            tuple[EntityId, str],
            InboxTask,
        ],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        if period_filter is not None and collection_params.period not in period_filter:
            return gen_log_entry

        schedule = schedules.get_schedule(
            typing.cast(RecurringTaskPeriod, collection_params.period),
            metric.name,
            today.to_timestamp_at_end_of_day(),
            None,
            collection_params.actionable_from_day,
            collection_params.actionable_from_month,
            collection_params.due_at_day,
            collection_params.due_at_month,
        )

        found_task = all_inbox_tasks_by_metric_ref_id_and_timeline.get(
            (metric.ref_id, schedule.timeline),
            None,
        )

        if found_task:
            if (
                not gen_even_if_not_modified
                and found_task.last_modified_time >= metric.last_modified_time
            ):
                return gen_log_entry

            found_task = found_task.update_link_to_metric(
                ctx,
                name=schedule.full_name,
                recurring_timeline=schedule.timeline,
                eisen=collection_params.eisen,
                difficulty=collection_params.difficulty,
                actionable_date=schedule.actionable_date,
                due_time=schedule.due_date,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await uow.get_for(InboxTask).save(found_task)

            gen_log_entry = gen_log_entry.add_entity_updated(
                ctx,
                found_task,
            )
        else:
            inbox_task = InboxTask.new_inbox_task_for_metric_collection(
                ctx,
                inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                name=schedule.full_name,
                metric_ref_id=metric.ref_id,
                recurring_task_timeline=schedule.timeline,
                recurring_task_gen_right_now=today.to_timestamp_at_end_of_day(),
                eisen=collection_params.eisen,
                difficulty=collection_params.difficulty,
                actionable_date=schedule.actionable_date,
                due_date=schedule.due_date,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                inbox_task = await uow.get_for(InboxTask).create(inbox_task)

            gen_log_entry = gen_log_entry.add_entity_created(
                ctx,
                inbox_task,
            )

        return gen_log_entry

    async def _generate_catch_up_inbox_tasks_for_person(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        user: User,
        inbox_task_collection: InboxTaskCollection,
        today: ADate,
        period_filter: frozenset[RecurringTaskPeriod] | None,
        person: Person,
        person_contact_name: ContactName,
        catch_up_params: RecurringTaskGenParams,
        all_inbox_tasks_by_person_ref_id_and_timeline: dict[
            tuple[EntityId, str],
            InboxTask,
        ],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        if period_filter is not None and catch_up_params.period not in period_filter:
            return gen_log_entry

        schedule = schedules.get_schedule(
            typing.cast(RecurringTaskPeriod, catch_up_params.period),
            person_contact_name,
            today.to_timestamp_at_end_of_day(),
            None,
            catch_up_params.actionable_from_day,
            catch_up_params.actionable_from_month,
            catch_up_params.due_at_day,
            catch_up_params.due_at_month,
        )

        found_task = all_inbox_tasks_by_person_ref_id_and_timeline.get(
            (person.ref_id, schedule.timeline),
            None,
        )

        if found_task:
            if (
                not gen_even_if_not_modified
                and found_task.last_modified_time >= person.last_modified_time
            ):
                return gen_log_entry

            found_task = found_task.update_link_to_person_catch_up(
                ctx,
                name=schedule.full_name,
                recurring_timeline=schedule.timeline,
                eisen=catch_up_params.eisen,
                difficulty=catch_up_params.difficulty,
                actionable_date=schedule.actionable_date,
                due_time=schedule.due_date,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await uow.get_for(InboxTask).save(found_task)

            gen_log_entry = gen_log_entry.add_entity_updated(
                ctx,
                found_task,
            )
        else:
            inbox_task = InboxTask.new_inbox_task_for_person_catch_up(
                ctx,
                inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                name=schedule.full_name,
                person_ref_id=person.ref_id,
                recurring_task_timeline=schedule.timeline,
                recurring_task_gen_right_now=today.to_timestamp_at_end_of_day(),
                eisen=catch_up_params.eisen,
                difficulty=catch_up_params.difficulty,
                actionable_date=schedule.actionable_date,
                due_date=schedule.due_date,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                inbox_task = await uow.get_for(InboxTask).create(inbox_task)

            gen_log_entry = gen_log_entry.add_entity_created(
                ctx,
                inbox_task,
            )

        return gen_log_entry

    async def _generate_time_event_block_for_occasion(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        time_event_domain: TimeEventDomain,
        today: ADate,
        occasion: Occasion,
        all_occasion_time_event_blocks_by_occasion_ref_id_and_start_date: dict[
            tuple[EntityId, ADate],
            TimeEventFullDaysBlock,
        ],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        found_block = (
            all_occasion_time_event_blocks_by_occasion_ref_id_and_start_date.get(
                (occasion.ref_id, occasion.date_in_year(today)), None
            )
        )

        if found_block:
            if (
                not gen_even_if_not_modified
                and found_block.last_modified_time >= occasion.last_modified_time
            ):
                return gen_log_entry

            found_block = found_block.update_for_person_occasion(
                ctx,
                occasion_date=occasion.date_in_year(today),
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await uow.get_for(TimeEventFullDaysBlock).save(found_block)
        else:
            found_block = TimeEventFullDaysBlock.new_time_event_for_person_occasion(
                ctx,
                time_event_domain_ref_id=time_event_domain.ref_id,
                occasion_ref_id=occasion.ref_id,
                occasion_date=occasion.date_in_year(today),
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                found_block = await uow.get_for(TimeEventFullDaysBlock).create(
                    found_block
                )

        return gen_log_entry

    async def _generate_inbox_task_for_occasion(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        user: User,
        inbox_task_collection: InboxTaskCollection,
        today: ADate,
        person: Person,
        person_contact_name: ContactName,
        occasion: Occasion,
        all_inbox_tasks_by_occasion_ref_id_and_timeline: dict[
            tuple[EntityId, str],
            InboxTask,
        ],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        schedule = schedules.get_schedule(
            RecurringTaskPeriod.YEARLY,
            occasion.name,
            today.to_timestamp_at_end_of_day(),
            None,
            None,
            None,
            RecurringTaskDueAtDay.build(
                RecurringTaskPeriod.YEARLY,
                occasion.date.day,
            ),
            RecurringTaskDueAtMonth.build(
                RecurringTaskPeriod.YEARLY,
                occasion.date.month,
            ),
        )

        found_task = all_inbox_tasks_by_occasion_ref_id_and_timeline.get(
            (occasion.ref_id, schedule.timeline),
            None,
        )

        if found_task:
            if (
                not gen_even_if_not_modified
                and found_task.last_modified_time >= occasion.last_modified_time
            ):
                return gen_log_entry

            found_task = found_task.update_link_to_person_occasion(
                ctx,
                name=schedule.full_name,
                recurring_timeline=schedule.timeline,
                occasion_kind=occasion.kind,
                occasion_person_name=person_contact_name,
                preparation_days_cnt=person.preparation_days_cnt_for_birthday,
                due_time=schedule.due_date,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await uow.get_for(InboxTask).save(found_task)

            gen_log_entry = gen_log_entry.add_entity_updated(
                ctx,
                found_task,
            )
        else:
            inbox_task = InboxTask.new_inbox_task_for_person_occasion(
                ctx,
                inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                name=schedule.full_name,
                occasion_kind=occasion.kind,
                occasion_person_name=person_contact_name,
                occasion_ref_id=occasion.ref_id,
                recurring_task_timeline=schedule.timeline,
                preparation_days_cnt=person.preparation_days_cnt_for_birthday,
                recurring_task_gen_right_now=today.to_timestamp_at_end_of_day(),
                due_date=schedule.due_date,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                inbox_task = await uow.get_for(InboxTask).create(inbox_task)

            gen_log_entry = gen_log_entry.add_entity_created(
                ctx,
                inbox_task,
            )

        return gen_log_entry

    async def _generate_slack_inbox_task_for_slack_task(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        slack_task: SlackTask,
        inbox_task_collection: InboxTaskCollection,
        all_inbox_tasks_by_slack_task_ref_id: dict[EntityId, InboxTask],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        found_task = all_inbox_tasks_by_slack_task_ref_id.get(
            slack_task.ref_id,
            None,
        )

        if found_task:
            if (
                not gen_even_if_not_modified
                and found_task.last_modified_time >= slack_task.last_modified_time
            ):
                return gen_log_entry

            found_task = found_task.update_link_to_slack_task(
                ctx,
                user=slack_task.user,
                channel=slack_task.channel,
                message=slack_task.message,
                generation_extra_info=slack_task.generation_extra_info,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await uow.get_for(InboxTask).save(found_task)

            gen_log_entry = gen_log_entry.add_entity_updated(
                ctx,
                found_task,
            )
        else:
            inbox_task = InboxTask.new_inbox_task_for_slack_task(
                ctx,
                inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                slack_task_ref_id=slack_task.ref_id,
                user=slack_task.user,
                channel=slack_task.channel,
                generation_extra_info=slack_task.generation_extra_info,
                message=slack_task.message,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                slack_task = slack_task.mark_as_used_for_generation(ctx)
                await uow.get_for(SlackTask).save(slack_task)

                inbox_task = await uow.get_for(InboxTask).create(inbox_task)

            gen_log_entry = gen_log_entry.add_entity_created(
                ctx,
                inbox_task,
            )

        return gen_log_entry

    async def _generate_email_inbox_task_for_email_task(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        email_task: EmailTask,
        inbox_task_collection: InboxTaskCollection,
        all_inbox_tasks_by_email_task_ref_id: dict[EntityId, InboxTask],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        found_task = all_inbox_tasks_by_email_task_ref_id.get(
            email_task.ref_id,
            None,
        )

        if found_task:
            if (
                not gen_even_if_not_modified
                and found_task.last_modified_time >= email_task.last_modified_time
            ):
                return gen_log_entry

            found_task = found_task.update_link_to_email_task(
                ctx,
                from_address=email_task.from_address,
                from_name=email_task.from_name,
                to_address=email_task.to_address,
                subject=email_task.subject,
                body=email_task.body,
                generation_extra_info=email_task.generation_extra_info,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                await uow.get_for(InboxTask).save(found_task)

            gen_log_entry = gen_log_entry.add_entity_updated(
                ctx,
                found_task,
            )
        else:
            inbox_task = InboxTask.new_inbox_task_for_email_task(
                ctx,
                inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                email_task_ref_id=email_task.ref_id,
                from_address=email_task.from_address,
                from_name=email_task.from_name,
                to_address=email_task.to_address,
                subject=email_task.subject,
                body=email_task.body,
                generation_extra_info=email_task.generation_extra_info,
            )

            async with self._domain_storage_engine.get_unit_of_work() as uow:
                email_task = email_task.mark_as_used_for_generation(ctx)
                await uow.get_for(EmailTask).save(email_task)
                await progress_reporter.mark_updated(email_task)

                inbox_task = await uow.get_for(InboxTask).create(inbox_task)

            gen_log_entry = gen_log_entry.add_entity_created(
                ctx,
                inbox_task,
            )

        return gen_log_entry

    async def _generate_eval_tasks_for_life_plan(
        self,
        ctx: MutationContext,
        progress_reporter: ProgressReporter,
        inbox_task_collection: InboxTaskCollection,
        today: ADate,
        period_filter: frozenset[RecurringTaskPeriod] | None,
        life_plan: LifePlan,
        all_eval_tasks_by_timeline: dict[str, InboxTask],
        gen_even_if_not_modified: bool,
        gen_log_entry: GenLogEntry,
    ) -> GenLogEntry:
        if life_plan.eval_approach.should_do_nothing:
            return gen_log_entry

        if life_plan.eval_task_gen_params is None:
            return gen_log_entry

        for period in life_plan.eval_periods:
            if period_filter is not None and period not in period_filter:
                continue

            real_today = today.add_days(
                life_plan.eval_task_generation_in_advance_days.get(period, 0)
            )

            schedule = schedules.get_schedule(
                period,
                EntityName(f"Evaluate {period.value} life plan for"),
                real_today.to_timestamp_at_end_of_day(),
            )

            if not schedule.should_keep:
                continue

            found_eval_task = all_eval_tasks_by_timeline.get(schedule.timeline, None)

            if life_plan.eval_approach.should_generate_an_eval_task:
                if life_plan.eval_task_gen_params is None:
                    raise Exception("Eval task gen params is not set")
                gen_params = life_plan.eval_task_gen_params

                if found_eval_task:
                    if (
                        not gen_even_if_not_modified
                        and found_eval_task.last_modified_time
                        >= life_plan.last_modified_time
                    ):
                        continue

                    found_eval_task = found_eval_task.update_link_to_life_plan_eval(
                        ctx,
                        eisen=gen_params.eisen,
                        difficulty=gen_params.difficulty,
                        due_date=schedule.due_date,
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        await uow.get_for(InboxTask).save(found_eval_task)
                    gen_log_entry = gen_log_entry.add_entity_updated(
                        ctx,
                        found_eval_task,
                    )
                else:
                    inbox_task = InboxTask.new_inbox_task_for_life_plan_eval(
                        ctx,
                        inbox_task_collection_ref_id=inbox_task_collection.ref_id,
                        name=schedule.full_name,
                        eisen=gen_params.eisen,
                        difficulty=gen_params.difficulty,
                        actionable_date=schedule.due_date.add_days(
                            -life_plan.eval_task_generation_in_advance_days.get(
                                period, 0
                            )
                        ),
                        due_date=schedule.due_date,
                        life_plan_ref_id=life_plan.ref_id,
                        recurring_task_timeline=schedule.timeline,
                        recurring_task_gen_right_now=real_today.to_timestamp_at_end_of_day(),
                    )

                    async with self._domain_storage_engine.get_unit_of_work() as uow:
                        inbox_task = await uow.get_for(InboxTask).create(inbox_task)
                    gen_log_entry = gen_log_entry.add_entity_created(
                        ctx,
                        inbox_task,
                    )

        return gen_log_entry
