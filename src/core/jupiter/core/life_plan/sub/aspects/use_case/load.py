"""Use case for loading a particular project."""

from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ProjectLoadArgs(UseCaseArgsBase):
    """ProjectLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class ProjectLoadResult(UseCaseResultBase):
    """ProjectLoadResult."""

    project: Project
    note: Note | None


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class ProjectLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ProjectLoadArgs, ProjectLoadResult]
):
    """Use case for loading a particular project."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ProjectLoadArgs,
    ) -> ProjectLoadResult:
        """Execute the command's action."""
        project = await uow.get_for(Project).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteNamespace.PROJECT, project.ref_id, allow_archived=args.allow_archived
        )

        return ProjectLoadResult(project=project, note=note)
