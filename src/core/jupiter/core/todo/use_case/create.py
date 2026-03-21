"""The command for creating a todo task."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.inbox_tasks.name import InboxTaskName
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.status import InboxTaskStatus
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.todo.domain import TodoDomain
from jupiter.core.todo.name import TodoTaskName
from jupiter.core.todo.root import TodoTask
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
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
class TodoTaskCreateArgs(UseCaseArgsBase):
    """TodoTaskCreate args."""

    name: InboxTaskName
    aspect_ref_id: EntityId | None
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    actionable_date: ADate | None
    due_date: ADate | None


@use_case_result
class TodoTaskCreateResult(UseCaseResultBase):
    """TodoTaskCreate result."""

    new_todo_task: TodoTask
    new_inbox_task: InboxTask


@mutation_use_case(WorkspaceFeature.TODO_TASK)
class TodoTaskCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TodoTaskCreateArgs, TodoTaskCreateResult
    ]
):
    """The command for creating a todo task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TodoTaskCreateArgs,
    ) -> TodoTaskCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if args.aspect_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.chapter_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.goal_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        if args.aspect_ref_id is None:
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            the_aspect = await uow.get(AspectRepository).load_root_aspect(
                life_plan.ref_id
            )
        else:
            the_aspect = await uow.get_for(Aspect).load_by_id(args.aspect_ref_id)

        if args.chapter_ref_id is not None:
            chapter = await uow.get_for(Chapter).load_by_id(args.chapter_ref_id)
            if chapter.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Chapter does not belong to aspect '{the_aspect.name}'"
                )

        if args.goal_ref_id is not None:
            goal = await uow.get_for(Goal).load_by_id(args.goal_ref_id)
            if goal.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Goal does not belong to aspect '{the_aspect.name}'"
                )

        todo_domain = await uow.get_for(TodoDomain).load_by_parent(workspace.ref_id)
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id
        )

        new_todo_task = TodoTask.new_todo_task(
            ctx=context.domain_context,
            todo_domain_ref_id=todo_domain.ref_id,
            aspect_ref_id=the_aspect.ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            name=TodoTaskName(str(args.name)),
        )
        new_todo_task = await uow.get_for(TodoTask).create(new_todo_task)
        await progress_reporter.mark_created(new_todo_task)

        new_inbox_task = InboxTask.new_inbox_task_for_todo(
            ctx=context.domain_context,
            inbox_task_collection_ref_id=inbox_task_collection.ref_id,
            todo_ref_id=new_todo_task.ref_id,
            name=args.name,
            status=InboxTaskStatus.NOT_STARTED,
            is_key=args.is_key,
            eisen=args.eisen,
            difficulty=args.difficulty,
            actionable_date=args.actionable_date,
            due_date=args.due_date,
        )
        new_inbox_task = await uow.get_for(InboxTask).create(new_inbox_task)
        await progress_reporter.mark_created(new_inbox_task)

        return TodoTaskCreateResult(
            new_todo_task=new_todo_task,
            new_inbox_task=new_inbox_task,
        )
