"""Retrieve details about a journal."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.journals.root import Journal
from jupiter.core.journals.service.load import JournalLoadResult, JournalLoadService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import use_case_args

__all__ = ["JournalLoadArgs", "JournalLoadResult", "JournalLoadUseCase"]


@use_case_args
class JournalLoadArgs(JupiterLoadCrownEntityArgs):
    """JournalLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(
    WorkspaceFeature.JOURNALS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class JournalLoadUseCase(
    JupiterLoadCrownEntityUseCase[JournalLoadArgs, JournalLoadResult]
):
    """The command for loading details about a journal."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: JournalLoadArgs,
    ) -> JournalLoadResult:
        """Execute the command's actions."""
        allow_archived = args.allow_archived or False

        await self.check_entity(
            uow,
            context.user.ref_id,
            Journal,
            args.ref_id,
            allow_archived,
        )
        journal = await uow.get_for(Journal).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return await JournalLoadService().do_it(
            uow,
            journal,
            allow_archived=allow_archived,
        )
