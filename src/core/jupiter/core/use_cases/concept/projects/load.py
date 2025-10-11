"""Use case for loading a particular project."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyUseCaseContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.concept.projects.project import Project
from jupiter.core.domain.core.notes.note import Note, NoteRepository
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    readonly_use_case,
)
from jupiter.framework_new.use_case_io import (
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


@readonly_use_case(WorkspaceFeature.PROJECTS)
class ProjectLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ProjectLoadArgs, ProjectLoadResult]
):
    """Use case for loading a particular project."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyUseCaseContext,
        args: ProjectLoadArgs,
    ) -> ProjectLoadResult:
        """Execute the command's action."""
        project = await uow.get_for(Project).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteDomain.PROJECT, project.ref_id, allow_archived=args.allow_archived
        )

        return ProjectLoadResult(project=project, note=note)
