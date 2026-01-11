"""Update a person."""

import typing

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common import schedules
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.inbox_tasks.service.archive import (
    InboxTaskArchiveService,
)
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person.name import PersonName
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class PersonUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[PersonName]
    catch_up_period: UpdateAction[RecurringTaskPeriod | None]
    catch_up_eisen: UpdateAction[Eisen | None]
    catch_up_difficulty: UpdateAction[Difficulty | None]
    catch_up_actionable_from_day: UpdateAction[RecurringTaskDueAtDay | None]
    catch_up_actionable_from_month: UpdateAction[RecurringTaskDueAtMonth | None]
    catch_up_due_at_day: UpdateAction[RecurringTaskDueAtDay | None]
    catch_up_due_at_month: UpdateAction[RecurringTaskDueAtMonth | None]
    circle_ref_ids: UpdateAction[list[EntityId]] = UpdateAction.do_nothing()


@mutation_use_case(WorkspaceFeature.PRM)
class PersonUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[PersonUpdateArgs, None]
):
    """The command for updating a person."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )
        person = await uow.get_for(Person).load_by_id(args.ref_id)

        if args.circle_ref_ids.should_change:
            desired_circle_ref_ids = set(args.circle_ref_ids.just_the_value)
            if len(desired_circle_ref_ids) > prm.max_circles_per_person:
                raise InputValidationError(
                    f"You can select at most {prm.max_circles_per_person} circles.",
                )
            if desired_circle_ref_ids:
                circles = await uow.get_for(Circle).find_all(
                    parent_ref_id=prm.ref_id,
                    allow_archived=False,
                    filter_ref_ids=list(desired_circle_ref_ids),
                )
                if len(circles) != len(desired_circle_ref_ids):
                    raise InputValidationError(
                        "Some circles do not exist in this workspace",
                    )

            existing_links = await uow.get_for_record(PersonCircleLink).find_all(
                prm.ref_id,
            )
            existing_circle_ref_ids = {
                link.circle_ref_id
                for link in existing_links
                if link.person_ref_id == person.ref_id
            }

            for circle_ref_id in existing_circle_ref_ids - desired_circle_ref_ids:
                await uow.get_for_record(PersonCircleLink).remove(
                    (prm.ref_id, person.ref_id, circle_ref_id)
                )
            for circle_ref_id in desired_circle_ref_ids - existing_circle_ref_ids:
                link = PersonCircleLink.new_link(
                    context.domain_context,
                    prm.ref_id,
                    person.ref_id,
                    circle_ref_id,
                )
                await uow.get_for_record(PersonCircleLink).create(link)

        # Change the person.
        catch_up_params: UpdateAction[RecurringTaskGenParams | None]
        if (
            args.catch_up_period.should_change
            or args.catch_up_eisen.should_change
            or args.catch_up_difficulty.should_change
            or args.catch_up_actionable_from_day.should_change
            or args.catch_up_actionable_from_month.should_change
            or args.catch_up_due_at_day.should_change
            or args.catch_up_due_at_month
        ):
            new_catch_up_period = None
            if args.catch_up_period.should_change:
                new_catch_up_period = args.catch_up_period.just_the_value
            elif person.catch_up_params is not None:
                new_catch_up_period = person.catch_up_params.period

            if new_catch_up_period is not None:
                new_catch_up_eisen = Eisen.REGULAR
                if args.catch_up_eisen.should_change:
                    new_catch_up_eisen = (
                        args.catch_up_eisen.just_the_value or Eisen.REGULAR
                    )
                elif person.catch_up_params is not None:
                    new_catch_up_eisen = person.catch_up_params.eisen

                new_catch_up_difficulty = Difficulty.EASY
                if args.catch_up_difficulty.should_change:
                    new_catch_up_difficulty = (
                        args.catch_up_difficulty.just_the_value or Difficulty.EASY
                    )
                elif person.catch_up_params is not None:
                    new_catch_up_difficulty = person.catch_up_params.difficulty

                new_catch_up_actionable_from_day = None
                if args.catch_up_actionable_from_day.should_change:
                    new_catch_up_actionable_from_day = (
                        args.catch_up_actionable_from_day.just_the_value
                    )
                elif person.catch_up_params is not None:
                    new_catch_up_actionable_from_day = (
                        person.catch_up_params.actionable_from_day
                    )

                new_catch_up_actionable_from_month = None
                if args.catch_up_actionable_from_month.should_change:
                    new_catch_up_actionable_from_month = (
                        args.catch_up_actionable_from_month.just_the_value
                    )
                elif person.catch_up_params is not None:
                    new_catch_up_actionable_from_month = (
                        person.catch_up_params.actionable_from_month
                    )

                new_catch_up_due_at_day = None
                if args.catch_up_due_at_day.should_change:
                    new_catch_up_due_at_day = args.catch_up_due_at_day.just_the_value
                elif person.catch_up_params is not None:
                    new_catch_up_due_at_day = person.catch_up_params.due_at_day

                new_catch_up_due_at_month = None
                if args.catch_up_due_at_month.should_change:
                    new_catch_up_due_at_month = (
                        args.catch_up_due_at_month.just_the_value
                    )
                elif person.catch_up_params is not None:
                    new_catch_up_due_at_month = person.catch_up_params.due_at_month

                catch_up_params = UpdateAction.change_to(
                    RecurringTaskGenParams(
                        period=new_catch_up_period,
                        eisen=new_catch_up_eisen,
                        difficulty=new_catch_up_difficulty,
                        actionable_from_day=new_catch_up_actionable_from_day,
                        actionable_from_month=new_catch_up_actionable_from_month,
                        due_at_day=new_catch_up_due_at_day,
                        due_at_month=new_catch_up_due_at_month,
                        skip_rule=None,
                    ),
                )
            else:
                catch_up_params = UpdateAction.change_to(None)
        else:
            catch_up_params = UpdateAction.do_nothing()

        project = await uow.get_for(Project).load_by_id(
            prm.catch_up_project_ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        person_catch_up_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.PERSON_CATCH_UP,
            source_entity_ref_id=person.ref_id,
        )

        person = person.update(
            ctx=context.domain_context,
            name=args.name,
            catch_up_params=catch_up_params,
        )

        await uow.get_for(Person).save(person)
        await progress_reporter.mark_updated(person)

        # TODO(horia141): also create tasks here!
        # TODO(horia141): what if we change other person properties not just catch up params?
        # Change the catch up inbox tasks
        if person.catch_up_params is None:
            # Situation 1: we need to get rid of any existing catch ups persons because there's no collection catch ups.
            inbox_task_archive_service = InboxTaskArchiveService()
            for inbox_task in person_catch_up_tasks:
                await inbox_task_archive_service.do_it(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    inbox_task,
                    JupiterArchivalReason.USER,
                )
        else:
            # Situation 2: we need to update the existing persons.
            for inbox_task in person_catch_up_tasks:
                schedule = schedules.get_schedule(
                    person.catch_up_params.period,
                    person.name,
                    typing.cast(Timestamp, inbox_task.recurring_gen_right_now),
                    None,
                    person.catch_up_params.actionable_from_day,
                    person.catch_up_params.actionable_from_month,
                    person.catch_up_params.due_at_day,
                    person.catch_up_params.due_at_month,
                )

                inbox_task = inbox_task.update_link_to_person_catch_up(
                    ctx=context.domain_context,
                    project_ref_id=project.ref_id,
                    name=schedule.full_name,
                    recurring_timeline=schedule.timeline,
                    eisen=person.catch_up_params.eisen,
                    difficulty=person.catch_up_params.difficulty,
                    actionable_date=schedule.actionable_date,
                    due_time=schedule.due_date,
                )
                # Situation 2a: we're handling the same project.
                await uow.get_for(InboxTask).save(inbox_task)
                await progress_reporter.mark_updated(inbox_task)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonUpdateArgs,
        result: None,
    ) -> None:
        """Execute the command's post-mutation work."""
        await GenService(self._ports.domain_storage_engine).do_it(
            context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=False,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.PERSONS],
            period=[],
            filter_person_ref_ids=[args.ref_id],
        )
