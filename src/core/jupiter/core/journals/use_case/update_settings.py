"""Update settings around journals."""

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common import schedules
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.generation_approach import (
    JournalGenerationApproach,
)
from jupiter.core.journals.root import Journal, JournalRepository
from jupiter.core.journals.source import JournalSource
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class JournalUpdateSettingsArgs(UseCaseArgsBase):
    """Args."""

    periods: UpdateAction[list[RecurringTaskPeriod]]
    generation_approach: UpdateAction[JournalGenerationApproach]
    generation_in_advance_days: UpdateAction[dict[RecurringTaskPeriod, int]]
    writing_task_eisen: UpdateAction[Eisen | None]
    writing_task_difficulty: UpdateAction[Difficulty | None]


@mutation_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalUpdateSettingsUseCase(
    JupiterLoggedInMutationUseCase[JournalUpdateSettingsArgs, None]
):
    """Command for updating the settings for journals in general."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: JournalUpdateSettingsArgs,
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            workspace = context.workspace

            journal_collection = await uow.get_for(JournalCollection).load_by_parent(
                workspace.ref_id
            )
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)

            journal_collection = journal_collection.update(
                context.domain_context,
                periods=args.periods.transform(lambda s: set(s)),
                generation_approach=args.generation_approach,
                generation_in_advance_days=args.generation_in_advance_days,
                writing_task_eisen=args.writing_task_eisen,
                writing_task_difficulty=args.writing_task_difficulty,
            )
            await uow.get_for(JournalCollection).save(journal_collection)

        gen_service = GenService(
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        await gen_service.do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=True,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.JOURNALS],
            period=None,
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            for period in RecurringTaskPeriod:
                schedule = schedules.get_schedule(
                    period=period,
                    name=EntityName("Test"),
                    right_now=self._time_provider.get_current_date().to_timestamp_at_end_of_day(),
                )

                journals_for_period = await uow.get(
                    JournalRepository
                ).find_all_in_range(
                    parent_ref_id=journal_collection.ref_id,
                    allow_archived=False,
                    filter_periods=[period],
                    filter_start_date=schedule.first_day,
                    filter_end_date=schedule.end_day.add_days(
                        365
                    ),  # Look reasonably far in the future
                )

                for journal in journals_for_period:
                    if journal.source == JournalSource.USER:
                        continue

                    writing_tasks = await uow.get_for(InboxTask).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=False,
                        namespace=InboxTaskNamespace.JOURNAL,
                        source_entity_ref_id=journal.ref_id,
                    )

                    writing_task: InboxTask | None
                    if len(writing_tasks) == 0:
                        writing_task = None
                    elif len(writing_tasks) == 1:
                        writing_task = writing_tasks[0]
                    else:
                        raise Exception("Found multiple writing tasks for journal")

                    if (
                        period not in journal_collection.periods
                        or journal_collection.generation_approach.should_not_generate_a_journal
                    ):
                        await generic_crown_archiver(
                            context.domain_context,
                            uow,
                            progress_reporter,
                            Journal,
                            journal.ref_id,
                            JupiterArchivalReason.USER,
                        )
                    if (
                        writing_task
                        and journal_collection.generation_approach.should_not_generate_a_writing_task
                    ):
                        await generic_crown_archiver(
                            context.domain_context,
                            uow,
                            progress_reporter,
                            InboxTask,
                            writing_task.ref_id,
                            JupiterArchivalReason.USER,
                        )
