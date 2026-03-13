"""Load settings for persons use case."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.prm.root import PRM
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
class PersonLoadSettingsArgs(UseCaseArgsBase):
    """PersonLoadSettings args."""


@use_case_result
class PersonLoadSettingsResult(UseCaseResultBase):
    """PersonLoadSettings results."""

    catch_up_aspect: Aspect
    max_circles_per_person: int


@readonly_use_case(WorkspaceFeature.PRM, exclude_component=[AppCore.CLI])
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

        prm = await uow.get_for(PRM).load_by_parent(
            workspace.ref_id,
        )
        catch_up_aspect = await uow.get_for(Aspect).load_by_id(
            prm.catch_up_aspect_ref_id,
        )

        return PersonLoadSettingsResult(
            catch_up_aspect=catch_up_aspect,
            max_circles_per_person=prm.max_circles_per_person,
        )
