"""Create a person."""

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
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.prm.sub.person.name import PersonName
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person_circle_links.root import PersonCircleLink
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class PersonCreateArgs(UseCaseArgsBase):
    """Person create args.."""

    name: PersonName
    catch_up_period: RecurringTaskPeriod | None
    catch_up_eisen: Eisen | None
    catch_up_difficulty: Difficulty | None
    catch_up_actionable_from_day: RecurringTaskDueAtDay | None
    catch_up_actionable_from_month: RecurringTaskDueAtMonth | None
    catch_up_due_at_day: RecurringTaskDueAtDay | None
    catch_up_due_at_month: RecurringTaskDueAtMonth | None
    circle_ref_ids: list[EntityId] | None = None


@use_case_result
class PersonCreateResult(UseCaseResultBase):
    """Person create result."""

    new_person: Person


@mutation_use_case(WorkspaceFeature.PRM)
class PersonCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[PersonCreateArgs, PersonCreateResult]
):
    """The command for creating a person."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonCreateArgs,
    ) -> PersonCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )

        catch_up_params = None
        if args.catch_up_period is not None:
            catch_up_eisen = args.catch_up_eisen or Eisen.REGULAR
            catch_up_difficulty = args.catch_up_difficulty or Difficulty.EASY
            catch_up_params = RecurringTaskGenParams(
                period=args.catch_up_period,
                eisen=catch_up_eisen,
                difficulty=catch_up_difficulty,
                actionable_from_day=args.catch_up_actionable_from_day,
                actionable_from_month=args.catch_up_actionable_from_month,
                due_at_day=args.catch_up_due_at_day,
                due_at_month=args.catch_up_due_at_month,
                skip_rule=None,
            )

        new_person = Person.new_person(
            ctx=context.domain_context,
            prm_ref_id=prm.ref_id,
            name=args.name,
            catch_up_params=catch_up_params,
        )
        new_person = await uow.get_for(Person).create(new_person)
        await progress_reporter.mark_created(new_person)

        desired_circle_ref_ids = set(args.circle_ref_ids or [])
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

            for circle_ref_id in desired_circle_ref_ids:
                link = PersonCircleLink.new_link(
                    context.domain_context,
                    prm.ref_id,
                    new_person.ref_id,
                    circle_ref_id,
                )
                await uow.get_for_record(PersonCircleLink).create(link)

        return PersonCreateResult(new_person=new_person)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: PersonCreateArgs,
        result: PersonCreateResult,
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
            period=[args.catch_up_period] if args.catch_up_period else [],
            filter_person_ref_ids=[result.new_person.ref_id],
        )
