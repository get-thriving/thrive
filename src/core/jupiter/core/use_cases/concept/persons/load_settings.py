"""Load settings for persons use case."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.persons.person_collection import PersonCollection
from jupiter.core.domain.concept.projects.project import Project
from jupiter.core.domain.features import WorkspaceFeature
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
class PersonLoadSettingsArgs(UseCaseArgsBase):
    """PersonLoadSettings args."""


@use_case_result
class PersonLoadSettingsResult(UseCaseResultBase):
    """PersonLoadSettings results."""

    catch_up_project: Project


@readonly_use_case(WorkspaceFeature.PERSONS, exclude_component=[AppCore.CLI])
class PersonLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        PersonLoadSettingsArgs, PersonLoadSettingsResult
    ],
):
    """The command for loading the settings around persons."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PersonLoadSettingsArgs,
    ) -> PersonLoadSettingsResult:
        """Execute the command's action."""
        workspace = context.workspace

        person_collection = await uow.get_for(PersonCollection).load_by_parent(
            workspace.ref_id,
        )
        catch_up_project = await uow.get_for(Project).load_by_id(
            person_collection.catch_up_project_ref_id,
        )

        return PersonLoadSettingsResult(catch_up_project=catch_up_project)
