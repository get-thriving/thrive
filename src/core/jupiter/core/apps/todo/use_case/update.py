"""The command for updating a todo task."""

from jupiter.core.apps.life_plan.sub.aspects.root import Aspect
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.apps.todo.name import TodoTaskName
from jupiter.core.apps.todo.root import TodoTask
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.inbox_tasks.name import InboxTaskName
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TodoTaskUpdateArgs(JupiterUpdateCrownEntityArgs):
    """TodoTaskUpdate args."""

    ref_id: EntityId
    name: UpdateAction[InboxTaskName]
    status: UpdateAction[InboxTaskStatus]
    aspect_ref_id: UpdateAction[EntityId]
    chapter_ref_id: UpdateAction[EntityId | None]
    goal_ref_id: UpdateAction[EntityId | None]
    is_key: UpdateAction[bool]
    eisen: UpdateAction[Eisen]
    difficulty: UpdateAction[Difficulty]
    actionable_date: UpdateAction[ADate | None]
    due_date: UpdateAction[ADate | None]


@use_case_result
class TodoTaskUpdateResult(UseCaseResultBase):
    """TodoTaskUpdate result."""

    updated_todo_task: TodoTask
    updated_inbox_task: InboxTask


@mutation_use_case(WorkspaceFeature.TODO_TASK)
class TodoTaskUpdateUseCase(
    JupiterUpdateCrownEntityUseCase[TodoTaskUpdateArgs, TodoTaskUpdateResult]
):
    """The command for updating a todo task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TodoTaskUpdateArgs,
    ) -> TodoTaskUpdateResult:
        """Execute the command's action."""
        workspace = context.workspace
        todo_task = await self.load_entity(
            uow, context.user.ref_id, TodoTask, args.ref_id
        )

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if (
                args.aspect_ref_id.should_change
                and args.aspect_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if (
                args.chapter_ref_id.should_change
                and args.chapter_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if (
                args.goal_ref_id.should_change
                and args.goal_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            new_aspect_ref_id = args.aspect_ref_id.or_else(todo_task.aspect_ref_id)
            new_chapter_ref_id = args.chapter_ref_id.or_else(todo_task.chapter_ref_id)
            new_goal_ref_id = args.goal_ref_id.or_else(todo_task.goal_ref_id)
            aspect_changing = (
                args.aspect_ref_id.should_change
                and new_aspect_ref_id != todo_task.aspect_ref_id
            )
            chapter_changing = (
                args.chapter_ref_id.should_change
                and new_chapter_ref_id != todo_task.chapter_ref_id
            )
            goal_changing = (
                args.goal_ref_id.should_change
                and new_goal_ref_id != todo_task.goal_ref_id
            )

            # Shared writers can keep the owner's life-plan links, but cannot
            # retarget them without writer access to those entities.
            if aspect_changing or chapter_changing or goal_changing:
                aspect = await self.load_entity(
                    uow,
                    context.user.ref_id,
                    Aspect,
                    new_aspect_ref_id,
                )

                if chapter_changing and new_chapter_ref_id is not None:
                    chapter = await self.load_entity(
                        uow, context.user.ref_id, Chapter, new_chapter_ref_id
                    )
                    if chapter.aspect_ref_id != aspect.ref_id:
                        raise InputValidationError(
                            f"Chapter does not belong to aspect '{aspect.name}'"
                        )

                if goal_changing and new_goal_ref_id is not None:
                    goal = await self.load_entity(
                        uow, context.user.ref_id, Goal, new_goal_ref_id
                    )
                    if goal.aspect_ref_id != aspect.ref_id:
                        raise InputValidationError(
                            f"Goal does not belong to aspect '{aspect.name}'"
                        )

        updated_todo_task = todo_task.update(
            ctx=context.domain_context,
            aspect_ref_id=args.aspect_ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            name=args.name.transform(lambda n: TodoTaskName(str(n))),
        )
        await uow.get_for(TodoTask).save(updated_todo_task)
        await progress_reporter.mark_updated(updated_todo_task)

        linked_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            owner=EntityLink.std(NamedEntityTag.TODO_TASK.value, todo_task.ref_id),
            allow_archived=True,
        )
        if len(linked_inbox_tasks) == 0:
            raise InputValidationError(
                f"No inbox task associated with todo task '{todo_task.ref_id}'"
            )
        if len(linked_inbox_tasks) > 1:
            raise InputValidationError(
                f"Multiple inbox tasks associated with todo task '{todo_task.ref_id}'"
            )

        updated_inbox_task = linked_inbox_tasks[0].update_link_to_todo(
            ctx=context.domain_context,
            todo_ref_id=todo_task.ref_id,
            name=args.name,
            status=args.status,
            is_key=args.is_key,
            actionable_date=args.actionable_date,
            due_date=args.due_date,
            eisen=args.eisen,
            difficulty=args.difficulty,
        )
        await uow.get_for(InboxTask).save(updated_inbox_task)

        return TodoTaskUpdateResult(
            updated_todo_task=updated_todo_task,
            updated_inbox_task=updated_inbox_task,
        )
