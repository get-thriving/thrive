"""Use case for loading publish-related settings."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.publish.sub.entity.root import ALLOWED_PUBLISH_OWNER_TYPES
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
class PublishEntityLoadSettingsArgs(UseCaseArgsBase):
    """PublishEntityLoadSettings args."""


@use_case_result
class PublishEntityLoadSettingsResult(UseCaseResultBase):
    """PublishEntityLoadSettings results."""

    allowed_publish_owner_entity_types: list[str]


@readonly_use_case(exclude_component=[AppCore.CLI])
class PublishEntityLoadSettingsUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        PublishEntityLoadSettingsArgs, PublishEntityLoadSettingsResult
    ]
):
    """Load workspace-scoped settings for the publish feature."""

    async def _perform_transactional_read(
        self,
        _uow: DomainUnitOfWork,
        _context: JupiterLoggedInReadonlyContext,
        _args: PublishEntityLoadSettingsArgs,
    ) -> PublishEntityLoadSettingsResult:
        """Execute the command's action."""
        return PublishEntityLoadSettingsResult(
            allowed_publish_owner_entity_types=sorted(ALLOWED_PUBLISH_OWNER_TYPES),
        )
