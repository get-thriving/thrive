"""The command for updating a project."""

from typing import cast

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.name import ProjectName
from jupiter.core.life_plan.sub.aspects.root import MAX_PROJECT_DEPTH_FROM_ROOT, Project
from jupiter.core.life_plan.sub.aspects.service.check_cycles import (
    ProjectCheckCyclesService,
    ProjectTreeHasCyclesError,
)
from jupiter.core.life_plan.sub.aspects.service.compute_depth_from_root import (
    ProjectComputeDepthFromRootService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ProjectUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[ProjectName]
    parent_project_ref_id: UpdateAction[EntityId | None] = UpdateAction.do_nothing()


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class ProjectUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ProjectUpdateArgs, None]
):
    """The command for updating a project."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ProjectUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        project = await uow.get_for(Project).load_by_id(args.ref_id)

        current_parent: Project | None = None
        new_parent: Project | None = None

        new_parent_project_ref_id = args.parent_project_ref_id.or_else(
            project.parent_project_ref_id
        )
        if args.parent_project_ref_id.should_change:
            if project.is_root and new_parent_project_ref_id is not None:
                raise InputValidationError(
                    "Root projects cannot have a parent project."
                )
            if not project.is_root and new_parent_project_ref_id is None:
                raise InputValidationError(
                    "A non-root project must have a parent project."
                )

            if not project.is_root and new_parent_project_ref_id is not None:
                current_parent = await uow.get_for(Project).load_by_id(
                    cast(
                        EntityId, project.parent_project_ref_id
                    )  # Null on root projects
                )
                new_parent = await uow.get_for(Project).load_by_id(
                    new_parent_project_ref_id
                )

                if current_parent.ref_id != new_parent.ref_id:
                    new_parent_depth = await ProjectComputeDepthFromRootService().do_it(
                        uow, new_parent
                    )
                    if new_parent_depth + 1 >= MAX_PROJECT_DEPTH_FROM_ROOT:
                        raise InputValidationError(
                            f"Cannot move a project deeper than {MAX_PROJECT_DEPTH_FROM_ROOT} levels from the root."
                        )

                current_parent = current_parent.remove_child_project(
                    context.domain_context, project.ref_id
                )
                await uow.get_for(Project).save(current_parent)
                await progress_reporter.mark_updated(current_parent)

                new_parent = new_parent.add_child_project(
                    context.domain_context, project.ref_id
                )
                await uow.get_for(Project).save(new_parent)
                await progress_reporter.mark_updated(new_parent)

        project = project.update(
            ctx=context.domain_context,
            name=args.name,
            parent_project_ref_id=args.parent_project_ref_id,
        )

        project = await uow.get_for(Project).save(project)
        await progress_reporter.mark_updated(project)

        try:
            await ProjectCheckCyclesService().check_for_cycles(uow, project)
        except ProjectTreeHasCyclesError as err:
            raise InputValidationError("The project tree has cycles.") from err
