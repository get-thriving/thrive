"""The command for removing a note."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import ALLOWED_NOTE_OWNER_TYPES, Note
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterRemoveLeafSupportEntityArgs,
    JupiterRemoveLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class NoteRemoveArgs(JupiterRemoveLeafSupportEntityArgs):
    """NoteRemove arguments."""

    ref_id: EntityId


@mutation_use_case(exclude_component=[AppCore.CLI])
class NoteRemoveUseCase(JupiterRemoveLeafSupportEntityUseCase[NoteRemoveArgs, None]):
    """The command for removing a note."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: NoteRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        _, note = await self.load_for_owner(
            uow,
            NoteCollection,
            Note,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_NOTE_OWNER_TYPES,
            AccessLevel.COMMENTER,
            allow_archived=True,
        )
        await NoteRemoveService().remove(context.domain_context, uow, note)
