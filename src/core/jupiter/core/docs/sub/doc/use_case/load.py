"""Load a particular doc."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.docs.sub.doc.service.load import DocLoadResult, DocLoadService
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args

__all__ = ["DocLoadArgs", "DocLoadResult", "DocLoadUseCase"]


@use_case_args
class DocLoadArgs(UseCaseArgsBase):
    """DocLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DocLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[DocLoadArgs, DocLoadResult]
):
    """Use case for loading a particular doc."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DocLoadArgs,
    ) -> DocLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        doc = await uow.get_for(Doc).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )

        return await DocLoadService().do_it(
            uow,
            doc,
            allow_archived=allow_archived,
        )
