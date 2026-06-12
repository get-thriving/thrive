"""Use case for loading a person."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.prm.sub.person.root import Person
from jupiter.core.prm.sub.person.service.load import PersonLoadResult, PersonLoadService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

__all__ = ["PersonLoadArgs", "PersonLoadResult", "PersonLoadUseCase"]


@use_case_args
class PersonLoadArgs(UseCaseArgsBase):
    """PersonLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None
    catch_up_task_retrieve_offset: int | None
    occasion_task_retrieve_offset: int | None


@readonly_use_case(WorkspaceFeature.PRM)
class PersonLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[PersonLoadArgs, PersonLoadResult]
):
    """Use case for loading a person."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PersonLoadArgs,
    ) -> PersonLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        if (
            args.catch_up_task_retrieve_offset is not None
            and args.catch_up_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid catch_up_inbox_task_retrieve_offset")
        if (
            args.occasion_task_retrieve_offset is not None
            and args.occasion_task_retrieve_offset < 0
        ):
            raise InputValidationError("Invalid occasion_inbox_task_retrieve_offset")

        workspace = context.workspace
        person = await uow.get_for(Person).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return await PersonLoadService().do_it(
            uow,
            workspace.ref_id,
            person,
            allow_archived=allow_archived,
            catch_up_task_retrieve_offset=args.catch_up_task_retrieve_offset or 0,
            occasion_task_retrieve_offset=args.occasion_task_retrieve_offset or 0,
        )
