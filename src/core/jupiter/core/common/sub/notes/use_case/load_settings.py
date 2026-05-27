"""Use case for loading note-related settings."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.root import ALLOWED_NOTE_OWNER_TYPES
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class NoteLoadSettingsArgs(UseCaseArgsBase):
    """NoteLoadSettings args."""


@use_case_result
class NoteLoadSettingsResult(UseCaseResultBase):
    """NoteLoadSettings results."""

    allowed_note_owner_entity_types: list[str]


@readonly_use_case(exclude_component=[AppCore.CLI])
class NoteLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        NoteLoadSettingsArgs, NoteLoadSettingsResult
    ],
):
    """Load workspace-scoped settings for the notes feature."""

    async def _perform_transactional_read(
        self,
        _uow: DomainUnitOfWork,
        _context: JupiterLoggedInReadonlyContext,
        _args: NoteLoadSettingsArgs,
    ) -> NoteLoadSettingsResult:
        """Execute the command's action."""
        return NoteLoadSettingsResult(
            allowed_note_owner_entity_types=sorted(ALLOWED_NOTE_OWNER_TYPES),
        )
