"""The command for clearing all branch and leaf type entities."""

from typing import cast

from jupiter.core.auth.auth_method import UserAuthMethod
from jupiter.core.auth.sub.local.password_new_plain import PasswordNewPlain
from jupiter.core.auth.sub.local.password_plain import PasswordPlain
from jupiter.core.auth.sub.local.root import AuthLocal
from jupiter.core.common.access.root import (
    THE_ACCESS_DOMAIN_REF_ID,
    AccessDomain,
)
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.timezone import Timezone
from jupiter.core.config import (
    JupiterGlobalProperties,
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.crm.root import (
    THE_CRM_DOMAIN_REF_ID,
    CRMDomain,
)
from jupiter.core.env import Env
from jupiter.core.features import UserFeature, WorkspaceFeature
from jupiter.core.home.config import HomeConfig
from jupiter.core.home.sub.tab.target import HomeTabTarget
from jupiter.core.journals.collection import JournalCollection
from jupiter.core.journals.generation_approach import (
    JournalGenerationApproach,
)
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.name import AspectName
from jupiter.core.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.search.domain import SearchDomain
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.generation_approach import (
    TimePlanGenerationApproach,
)
from jupiter.core.users.name import UserName
from jupiter.core.users.root import User
from jupiter.core.user_workspace_link.user_workspace_link import (
    UserWorkspaceLink,
    UserWorkspaceLinkNotFoundError,
    UserWorkspaceLinkRepository,
)
from jupiter.core.utils.feature_flag_controls import infer_feature_flag_controls
from jupiter.core.working_mem.collection import WorkingMemCollection
from jupiter.core.working_mem.root import WorkingMem, WorkingMemRepository
from jupiter.core.workspaces.name import WorkspaceName
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_root_remover import generic_root_remover


@use_case_args
class ClearAllArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    user_name: UserName
    user_timezone: Timezone
    user_feature_flags: set[UserFeature] | None
    auth_current_password: PasswordPlain
    auth_new_password: PasswordNewPlain
    auth_new_password_repeat: PasswordNewPlain
    workspace_name: WorkspaceName
    workspace_root_aspect_name: AspectName
    workspace_feature_flags: set[WorkspaceFeature] | None


@mutation_use_case(exclude_globally=[Env.PRODUCTION])
class ClearAllUseCase(JupiterLoggedInMutationUseCase[ClearAllArgs, None]):
    """The command for clearing all branch and leaf type entities."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ClearAllArgs,
    ) -> None:
        """Execute the command's action."""
        user = context.user
        workspace = context.workspace

        try:
            async with progress_reporter.section("Clearing the search index"):
                async with (
                    self._ports.search_storage_engine.get_unit_of_work() as search_uow
                ):
                    await search_uow.search_repository.drop(workspace.ref_id)

                async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                    search_domain = await uow.get_for(SearchDomain).load_by_parent(
                        workspace.ref_id
                    )

                async with (
                    self._ports.search_indexing_storage_engine.get_unit_of_work() as iuow
                ):
                    await iuow.search_entity_indexing_record_repository.remove_all_for_search_domain(
                        search_domain.ref_id,
                    )
                    await iuow.search_mutation_log_record_repository.remove_all_for_search_domain(
                        search_domain.ref_id,
                    )

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                # TODO(horia141): params
                (
                    user_feature_flags_controls,
                    workspace_feature_flags_controls,
                ) = infer_feature_flag_controls(
                    cast(JupiterGlobalProperties, self._global_properties)
                )

                home_config = await uow.get_for(HomeConfig).load_by_parent(
                    workspace.ref_id,
                )

                life_plan = await uow.get_for(LifePlan).load_by_parent(
                    workspace.ref_id,
                )

                async with progress_reporter.section("Setting things back to default"):
                    user = user.update(
                        ctx=context.domain_context,
                        name=UpdateAction.change_to(args.user_name),
                        timezone=UpdateAction.change_to(args.user_timezone),
                    )

                    if args.user_feature_flags is not None:
                        user_feature_flags = {}
                        for user_feature in UserFeature:
                            user_feature_flags[user_feature] = (
                                user_feature in args.user_feature_flags
                            )

                        user = user.change_feature_flags(
                            ctx=context.domain_context,
                            feature_flag_controls=user_feature_flags_controls,
                            feature_flags=user_feature_flags,
                        )

                    await uow.get_for(User).save(user)

                    if user.auth_method == UserAuthMethod.LOCAL:
                        auth = await uow.get_for(AuthLocal).load_by_parent(
                            parent_ref_id=user.ref_id
                        )
                        auth = auth.change_password(
                            ctx=context.domain_context,
                            current_password=args.auth_current_password,
                            new_password=args.auth_new_password,
                            new_password_repeat=args.auth_new_password_repeat,
                        )
                        await uow.get_for(AuthLocal).save(auth)

                    workspace = workspace.update(
                        ctx=context.domain_context,
                        name=UpdateAction.change_to(args.workspace_name),
                    )

                    for target in HomeTabTarget:
                        home_config = home_config.reoder_tabs(
                            ctx=context.domain_context,
                            target=target,
                            order_of_tabs=[],
                        )
                    await uow.get_for(HomeConfig).save(home_config)

                    if args.workspace_feature_flags is not None:
                        workspace_feature_flags = {}
                        for workspace_feature in WorkspaceFeature:
                            workspace_feature_flags[workspace_feature] = (
                                workspace_feature in args.workspace_feature_flags
                            )

                        workspace = workspace.change_feature_flags(
                            ctx=context.domain_context,
                            feature_flag_controls=workspace_feature_flags_controls,
                            feature_flags=workspace_feature_flags,
                        )

                    await uow.get_for(Workspace).save(workspace)

                    root_aspect = await uow.get(AspectRepository).load_root_aspect(
                        life_plan.ref_id
                    )
                    root_aspect = root_aspect.update(
                        ctx=context.domain_context,
                        name=UpdateAction.change_to(args.workspace_root_aspect_name),
                        parent_aspect_ref_id=UpdateAction.do_nothing(),
                    ).reorder_child_aspects(
                        ctx=context.domain_context,
                        new_order=[],
                    )
                    await uow.get_for(Aspect).save(root_aspect)

                    time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
                        workspace.ref_id
                    )
                    time_plan_domain = time_plan_domain.update(
                        context.domain_context,
                        periods=UpdateAction.change_to(
                            {RecurringTaskPeriod.WEEKLY, RecurringTaskPeriod.QUARTERLY}
                        ),
                        generation_approach=UpdateAction.change_to(
                            TimePlanGenerationApproach.BOTH_PLAN_AND_TASK
                        ),
                        generation_in_advance_days=UpdateAction.change_to(
                            {
                                RecurringTaskPeriod.QUARTERLY: 14,
                                RecurringTaskPeriod.WEEKLY: 3,
                            }
                        ),
                        planning_task_eisen=UpdateAction.change_to(Eisen.IMPORTANT),
                        planning_task_difficulty=UpdateAction.change_to(
                            Difficulty.MEDIUM
                        ),
                    )
                    await uow.get_for(TimePlanDomain).save(time_plan_domain)

                    journal_collection = await uow.get_for(
                        JournalCollection
                    ).load_by_parent(workspace.ref_id)
                    journal_collection = journal_collection.update(
                        context.domain_context,
                        periods=UpdateAction.change_to({RecurringTaskPeriod.WEEKLY}),
                        generation_approach=UpdateAction.change_to(
                            JournalGenerationApproach.BOTH_JOURNAL_AND_TASK
                        ),
                        generation_in_advance_days=UpdateAction.change_to(
                            {RecurringTaskPeriod.WEEKLY: 3}
                        ),
                        writing_task_eisen=UpdateAction.change_to(Eisen.IMPORTANT),
                        writing_task_difficulty=UpdateAction.change_to(
                            Difficulty.MEDIUM
                        ),
                    )
                    await uow.get_for(JournalCollection).save(journal_collection)

                await generic_root_remover(
                    context.domain_context, uow, progress_reporter, User, user.ref_id
                )

                await generic_root_remover(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    Workspace,
                    workspace.ref_id,
                )

                await generic_root_remover(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    AccessDomain,
                    THE_ACCESS_DOMAIN_REF_ID,
                )

                try:
                    user_workspace_link = await uow.get(
                        UserWorkspaceLinkRepository
                    ).load_by_user(user.ref_id)
                except UserWorkspaceLinkNotFoundError:
                    user_workspace_link = None

                if (
                    user_workspace_link is None
                    or user_workspace_link.archived
                    or user_workspace_link.workspace_ref_id != workspace.ref_id
                ):
                    if user_workspace_link is not None:
                        await uow.get_for(UserWorkspaceLink).remove(
                            context.domain_context,
                            user_workspace_link.ref_id,
                        )
                    user_workspace_link = UserWorkspaceLink.new_user_workspace_link(
                        ctx=context.domain_context,
                        user_ref_id=user.ref_id,
                        workspace_ref_id=workspace.ref_id,
                    )
                    await uow.get_for(UserWorkspaceLink).create(user_workspace_link)

                working_mem_collection = await uow.get_for(
                    WorkingMemCollection
                ).load_by_parent(workspace.ref_id)
                working_mem = await uow.get(WorkingMemRepository).load_the_working_mem(
                    working_mem_collection.ref_id,
                    allow_archived=True,
                )
                working_mem = working_mem.unarchive(context.domain_context)
                await uow.get_for(WorkingMem).save(working_mem)

                note_collection = await uow.get_for(NoteCollection).load_by_parent(
                    workspace.ref_id
                )
                working_mem_owner = EntityLink.std(
                    NamedEntityTag.WORKING_MEM.value, working_mem.ref_id
                )
                working_mem_note = await uow.get(
                    NoteRepository
                ).load_optional_for_owner(working_mem_owner, allow_archived=True)
                if working_mem_note is None:
                    working_mem_note = Note.new_note(
                        context.domain_context,
                        note_collection_ref_id=note_collection.ref_id,
                        owner=working_mem_owner,
                        content=[],
                    )
                    await uow.get_for(Note).create(working_mem_note)

            async with (
                self._ports.crm_indexing_storage_engine.get_unit_of_work() as iuow
            ):
                await iuow.crm_entity_indexing_record_repository.remove_all_for_crm_domain(
                    THE_CRM_DOMAIN_REF_ID,
                )

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                await generic_root_remover(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    CRMDomain,
                    THE_CRM_DOMAIN_REF_ID,
                )

            async with progress_reporter.section(
                "Clearing use case invocation records"
            ):
                await self._invocation_recorder.clear_all(context.as_str())
        except Exception as e:
            # Nothing should go wrong here, but if it does, it's kind of hard to debug.
            # So we raise this exception that should not be caught by the system.
            raise Exception("Clearing error") from e
