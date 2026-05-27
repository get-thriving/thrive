"""The command for updating a todo task."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.name import InboxTaskName
from jupiter.core.common.sub.inbox_tasks.root import InboxTask, InboxTaskRepository
from jupiter.core.common.sub.inbox_tasks.status import InboxTaskStatus
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.todo.name import TodoTaskName
from jupiter.core.todo.root import TodoTask
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
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TodoTaskUpdateArgs(UseCaseArgsBase):
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
    JupiterTransactionalLoggedInMutationUseCase[
        TodoTaskUpdateArgs, TodoTaskUpdateResult
    ]
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
        todo_task = await uow.get_for(TodoTask).load_by_id(args.ref_id)

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

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN) and (
            args.aspect_ref_id.should_change
            or args.chapter_ref_id.should_change
            or args.goal_ref_id.should_change
        ):
            aspect = await uow.get_for(Aspect).load_by_id(
                args.aspect_ref_id.or_else(todo_task.aspect_ref_id)
            )
            chapter_ref_id = args.chapter_ref_id.or_else(todo_task.chapter_ref_id)
            goal_ref_id = args.goal_ref_id.or_else(todo_task.goal_ref_id)

            if (
                chapter_ref_id is not None
                and chapter_ref_id != todo_task.chapter_ref_id
            ):
                chapter = await uow.get_for(Chapter).load_by_id(chapter_ref_id)
                if chapter.aspect_ref_id != aspect.ref_id:
                    raise InputValidationError(
                        f"Chapter does not belong to aspect '{aspect.name}'"
                    )

            if goal_ref_id is not None and goal_ref_id != todo_task.goal_ref_id:
                goal = await uow.get_for(Goal).load_by_id(goal_ref_id)
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

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id
        )
        linked_inbox_tasks = await uow.get(
            InboxTaskRepository
        ).find_all_for_owner_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
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
