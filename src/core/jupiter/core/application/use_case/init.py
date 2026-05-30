"""UseCase for initialising the workspace."""

from typing import cast

from jupiter.core.auth.sub.local.password_new_plain import PasswordNewPlain
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.auth.sub.local.sub.recovery_token.plain import RecoveryTokenPlain
from jupiter.core.auth.sub.local.sub.recovery_token.root import RecoveryToken
from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.common.birth_year import BirthYear
from jupiter.core.common.birthday import Birthday
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.timezone import Timezone
from jupiter.core.config import (
    JupiterGlobalProperties,
    JupiterGuestMutationContext,
    JupiterGuestMutationUseCase,
)
from jupiter.core.docs.root import DocCollection
from jupiter.core.docs.sub.dir.name import DirName
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.features import (
    UserFeature,
    WorkspaceFeature,
)
from jupiter.core.gamification.score_log import ScoreLog
from jupiter.core.gc.log import GCLog
from jupiter.core.gen.log import GenLog
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.home.config import HomeConfig
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.generation_approach import (
    JournalGenerationApproach,
)
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.name import AspectName
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.milestones.name import MilestoneName
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.core.metrics.collection import MetricCollection
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.prm.root import PRM
from jupiter.core.prm.sub.circle.name import CircleName
from jupiter.core.prm.sub.circle.root import Circle
from jupiter.core.push_integrations.group import (
    PushIntegrationGroup,
)
from jupiter.core.push_integrations.sub.email.task_collection import (
    EmailTaskCollection,
)
from jupiter.core.push_integrations.sub.slack.task_collection import (
    SlackTaskCollection,
)
from jupiter.core.schedule.domain import ScheduleDomain
from jupiter.core.schedule.sub.external_sync_log.root import (
    ScheduleExternalSyncLog,
)
from jupiter.core.schedule.sub.stream.color import (
    ScheduleStreamColor,
)
from jupiter.core.schedule.sub.stream.name import ScheduleStreamName
from jupiter.core.schedule.sub.stream.root import ScheduleStream
from jupiter.core.search.service.entity_index import SearchEntityIndexService
from jupiter.core.smart_lists.collection import (
    SmartListCollection,
)
from jupiter.core.stats.log import StatsLog
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.generation_approach import (
    TimePlanGenerationApproach,
)
from jupiter.core.todo.domain import TodoDomain
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
)
from jupiter.core.users.name import UserName
from jupiter.core.users.root import User
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
from jupiter.core.utils.feature_flag_controls import infer_feature_flag_controls
from jupiter.core.vacations.collection import VacationCollection
from jupiter.core.working_mem.collection import (
    WorkingMemCollection,
)
from jupiter.core.working_mem.root import WorkingMem
from jupiter.core.workspaces.name import WorkspaceName
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.auth.auth_token_ext import AuthTokenExt
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import (
    ProgressReporter,
)
from jupiter.framework.secure import secure_class
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class InitArgs(UseCaseArgsBase):
    """Init use case arguments."""

    user_email_address: EmailAddress
    user_name: UserName
    user_timezone: Timezone
    user_feature_flags: set[UserFeature]
    auth_password: PasswordNewPlain
    auth_password_repeat: PasswordNewPlain
    user_birthday: Birthday
    user_birth_year: BirthYear
    workspace_name: WorkspaceName
    workspace_first_schedule_stream_name: ScheduleStreamName
    workspace_root_aspect_name: AspectName
    workspace_feature_flags: set[WorkspaceFeature]


@use_case_result
class InitResult(UseCaseResultBase):
    """Init use case result."""

    new_user: User
    new_workspace: Workspace
    auth_token_ext: AuthTokenExt
    recovery_token: RecoveryTokenPlain


@secure_class
class InitUseCase(JupiterGuestMutationUseCase[InitArgs, InitResult]):
    """UseCase for initialising the workspace."""

    async def _execute(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterGuestMutationContext,
        args: InitArgs,
    ) -> InitResult:
        """Execute the command's action."""
        # TODO(horia141): params
        (
            user_feature_flags_controls,
            workspace_feature_flags_controls,
        ) = infer_feature_flag_controls(
            cast(JupiterGlobalProperties, self._global_properties)
        )

        user_feature_flags = {}
        for user_feature in UserFeature:
            user_feature_flags[user_feature] = (
                True
                if user_feature in args.user_feature_flags
                else user_feature_flags_controls.standard_flag_for(user_feature)
            )

        workspace_feature_flags = {}
        for workspace_feature in WorkspaceFeature:
            workspace_feature_flags[workspace_feature] = (
                True
                if workspace_feature in args.workspace_feature_flags
                else workspace_feature_flags_controls.standard_flag_for(
                    workspace_feature
                )
            )

        for_app_review = False  # args.for_app_review

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            if for_app_review:
                new_user = User.new_app_store_review_user(
                    ctx=context.domain_context,
                    email_address=args.user_email_address,
                    name=args.user_name,
                    feature_flag_controls=user_feature_flags_controls,
                )
            else:
                new_user = User.new_standard_user_local(
                    ctx=context.domain_context,
                    email_address=args.user_email_address,
                    name=args.user_name,
                    feature_flag_controls=user_feature_flags_controls,
                    feature_flags=user_feature_flags,
                )
            new_user = await uow.get_for(User).create(new_user)
            new_user = new_user.update(
                context.domain_context,
                name=UpdateAction.do_nothing(),
                timezone=UpdateAction.change_to(args.user_timezone),
            )
            new_user = await uow.get_for(User).save(new_user)

            new_auth = AuthLocal.new_auth(
                context.domain_context,
                user_ref_id=new_user.ref_id,
                password=args.auth_password,
                password_repeat=args.auth_password_repeat,
            )
            new_auth = await uow.get_for(AuthLocal).create(new_auth)

            new_recovery_token_entity, new_recovery_token = (
                RecoveryToken.new_recovery_token(
                    context.domain_context,
                    auth_ref_id=new_auth.ref_id,
                )
            )
            await uow.get_for(RecoveryToken).create(new_recovery_token_entity)

            new_score_log = ScoreLog.new_score_log(
                ctx=context.domain_context,
                user_ref_id=new_user.ref_id,
            )
            new_score_log = await uow.get_for(ScoreLog).create(new_score_log)

            new_web_ui_settings = WebUiSettings.new_web_ui_settings(
                ctx=context.domain_context,
                user_ref_id=new_user.ref_id,
            )
            await uow.get_for(WebUiSettings).create(new_web_ui_settings)

            new_workspace = Workspace.new_workspace(
                ctx=context.domain_context,
                name=args.workspace_name,
                feature_flag_controls=workspace_feature_flags_controls,
                feature_flags=workspace_feature_flags,
            )
            new_workspace = await uow.get_for(Workspace).create(new_workspace)

            new_home_config = HomeConfig.new_home_config(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_home_config = await uow.get_for(HomeConfig).create(new_home_config)

            new_vacation_collection = VacationCollection.new_vacation_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_vacation_collection = await uow.get_for(VacationCollection).create(
                new_vacation_collection,
            )

            new_life_plan = LifePlan.new_life_plan(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
                birthday=args.user_birthday,
                birth_year=args.user_birth_year,
            )
            new_life_plan = await uow.get_for(LifePlan).create(
                new_life_plan,
            )

            new_root_aspect = Aspect.new_root_aspect(
                ctx=context.domain_context,
                life_plan_ref_id=new_life_plan.ref_id,
                name=args.workspace_root_aspect_name,
            )
            new_root_aspect = await uow.get_for(Aspect).create(
                new_root_aspect,
            )

            new_birth_milestone = Milestone.new_milestone(
                ctx=context.domain_context,
                life_plan_ref_id=new_life_plan.ref_id,
                name=MilestoneName("Birth"),
                aspect_ref_id=new_root_aspect.ref_id,
                date=new_life_plan.birthday_date,
            )
            await uow.get_for(Milestone).create(new_birth_milestone)

            new_inbox_task_collection = InboxTaskCollection.new_inbox_task_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_inbox_task_collection = await uow.get_for(InboxTaskCollection).create(
                new_inbox_task_collection,
            )

            new_note_collection = NoteCollection.new_note_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_note_collection = await uow.get_for(NoteCollection).create(
                new_note_collection
            )

            new_working_mem_collection = (
                WorkingMemCollection.new_working_mem_collection(
                    ctx=context.domain_context,
                    workspace_ref_id=new_workspace.ref_id,
                    generation_period=RecurringTaskPeriod.DAILY,
                )
            )
            new_working_mem_collection = await uow.get_for(WorkingMemCollection).create(
                new_working_mem_collection,
            )

            new_working_mem = WorkingMem.new_working_mem(
                ctx=context.domain_context,
                working_mem_collection_ref_id=new_working_mem_collection.ref_id,
            )
            new_working_mem = await uow.get_for(WorkingMem).create(new_working_mem)

            new_working_mem_note = Note.new_note(
                ctx=context.domain_context,
                note_collection_ref_id=new_note_collection.ref_id,
                owner=EntityLink.std(
                    NamedEntityTag.WORKING_MEM.value,
                    new_working_mem.ref_id,
                ),
                content=[],
            )
            await uow.get_for(Note).create(new_working_mem_note)

            new_time_plan_domain = TimePlanDomain.new_time_plan_domain(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
                periods={RecurringTaskPeriod.QUARTERLY, RecurringTaskPeriod.WEEKLY},
                generation_approach=TimePlanGenerationApproach.BOTH_PLAN_AND_TASK,
                generation_in_advance_days={
                    RecurringTaskPeriod.QUARTERLY: 14,
                    RecurringTaskPeriod.WEEKLY: 3,
                },
                planning_task_eisen=Eisen.IMPORTANT,
                planning_task_difficulty=Difficulty.MEDIUM,
            )
            new_time_plan_domain = await uow.get_for(TimePlanDomain).create(
                new_time_plan_domain
            )

            new_todo_domain = TodoDomain.new_todo_domain(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_todo_domain = await uow.get_for(TodoDomain).create(new_todo_domain)

            new_schedule_domain = ScheduleDomain.new_schedule_domain(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_schedule_domain = await uow.get_for(ScheduleDomain).create(
                new_schedule_domain,
            )

            new_schedule_external_sync_log = (
                ScheduleExternalSyncLog.new_schedule_external_sync_log(
                    ctx=context.domain_context,
                    schedule_domain_ref_id=new_schedule_domain.ref_id,
                )
            )
            new_schedule_external_sync_log = await uow.get_for(
                ScheduleExternalSyncLog
            ).create(new_schedule_external_sync_log)

            new_first_schedule_stream = ScheduleStream.new_schedule_stream_for_user(
                ctx=context.domain_context,
                schedule_domain_ref_id=new_schedule_domain.ref_id,
                name=args.workspace_first_schedule_stream_name,
                color=ScheduleStreamColor.BLUE,
            )
            new_first_schedule_stream = await uow.get_for(ScheduleStream).create(
                new_first_schedule_stream,
            )

            new_habit_collection = HabitCollection.new_habit_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_habit_collection = await uow.get_for(HabitCollection).create(
                new_habit_collection,
            )

            new_chore_collection = ChoreCollection.new_chore_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_chore_collection = await uow.get_for(ChoreCollection).create(
                new_chore_collection,
            )

            new_big_plan_collection = BigPlanCollection.new_big_plan_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_big_plan_collection = await uow.get_for(BigPlanCollection).create(
                new_big_plan_collection,
            )

            journal_collection = JournalCollection.new_journal_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
                periods={RecurringTaskPeriod.WEEKLY},
                generation_approach=JournalGenerationApproach.BOTH_JOURNAL_AND_TASK,
                generation_in_advance_days={
                    RecurringTaskPeriod.WEEKLY: 3,
                },
                writing_task_eisen=Eisen.IMPORTANT,
                writing_task_difficulty=Difficulty.MEDIUM,
            )
            journal_collection = await uow.get_for(JournalCollection).create(
                journal_collection,
            )

            new_doc_collection = DocCollection.new_doc_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_doc_collection = await uow.get_for(DocCollection).create(
                new_doc_collection
            )

            new_root_doc_dir = Dir.new_root_dir(
                ctx=context.domain_context,
                doc_collection_ref_id=new_doc_collection.ref_id,
                name=DirName("Root"),
            )
            await uow.get_for(Dir).create(new_root_doc_dir)

            new_smart_list_collection = SmartListCollection.new_smart_list_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_smart_list_collection = await uow.get_for(SmartListCollection).create(
                new_smart_list_collection,
            )

            new_metric_collection = MetricCollection.new_metric_collection(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_metric_collection = await uow.get_for(MetricCollection).create(
                new_metric_collection,
            )

            new_prm = PRM.new_prm(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_prm = await uow.get_for(PRM).create(
                new_prm,
            )

            # Seed some default circles inspired by the person relationship enum.
            default_circle_names = [
                "Family",
                "Friend",
                "Work Buddy",
                "School Buddy",
                "Colleague",
                "Acquaintance",
                "Other",
            ]
            for circle_name in default_circle_names:
                new_circle = Circle.new_circle(
                    ctx=context.domain_context,
                    prm_ref_id=new_prm.ref_id,
                    name=CircleName(circle_name),
                )
                await uow.get_for(Circle).create(new_circle)

            new_push_integration_group = (
                PushIntegrationGroup.new_push_integration_group(
                    ctx=context.domain_context,
                    workspace_ref_id=new_workspace.ref_id,
                )
            )
            new_push_integration_group = await uow.get_for(PushIntegrationGroup).create(
                new_push_integration_group,
            )

            new_slack_task_collection = SlackTaskCollection.new_slack_task_collection(
                ctx=context.domain_context,
                push_integration_group_ref_id=new_push_integration_group.ref_id,
            )
            new_slack_task_collection = await uow.get_for(SlackTaskCollection).create(
                new_slack_task_collection,
            )

            new_email_task_collection = EmailTaskCollection.new_email_task_collection(
                ctx=context.domain_context,
                push_integration_group_ref_id=new_push_integration_group.ref_id,
            )
            new_email_task_collection = await uow.get_for(EmailTaskCollection).create(
                new_email_task_collection,
            )

            new_time_event_domain = TimeEventDomain.new_time_event_domain(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_time_event_domain = await uow.get_for(TimeEventDomain).create(
                new_time_event_domain
            )

            new_tag_domain = TagDomain.new_tag_domain(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_tag_domain = await uow.get_for(TagDomain).create(new_tag_domain)

            new_contact_domain = ContactDomain.new_contact_domain(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_contact_domain = await uow.get_for(ContactDomain).create(
                new_contact_domain
            )

            new_gc_log = GCLog.new_gc_log(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_gc_log = await uow.get_for(GCLog).create(new_gc_log)

            new_gen_log = GenLog.new_gen_log(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_gen_log = await uow.get_for(GenLog).create(new_gen_log)

            new_stats_log = StatsLog.new_stats_log(
                ctx=context.domain_context,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_stats_log = await uow.get_for(StatsLog).create(new_stats_log)

            new_user_workspace_link = UserWorkspaceLink.new_user_workspace_link(
                ctx=context.domain_context,
                user_ref_id=new_user.ref_id,
                workspace_ref_id=new_workspace.ref_id,
            )
            new_user_workspace_link = await uow.get_for(UserWorkspaceLink).create(
                new_user_workspace_link
            )

        index_service = SearchEntityIndexService(
            self._ports, self._concept_registry, self._time_provider
        )
        await index_service.index(
            workspace_ref_id=new_workspace.ref_id,
            entity_type=Aspect.__name__,
            entity_ref_id=new_root_aspect.ref_id,
        )

        auth_token = self._auth_token_stamper.stamp_for_general_long(new_user.ref_id)

        if new_user.should_go_through_onboarding_flow:
            await self._ports.crm.upsert_as_user(new_user)

        return InitResult(
            new_user=new_user,
            new_workspace=new_workspace,
            auth_token_ext=auth_token.to_ext(),
            recovery_token=new_recovery_token,
        )
