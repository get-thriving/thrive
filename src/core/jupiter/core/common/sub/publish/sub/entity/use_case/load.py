"""Use case for loading a publish entity."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.root import (
    ALLOWED_PUBLISH_OWNER_TYPES,
    PublishEntity,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterLoadLeafSupportEntityArgs,
    JupiterLoadLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class PublishEntityLoadArgs(JupiterLoadLeafSupportEntityArgs):
    """PublishEntityLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class PublishEntityLoadResult(UseCaseResultBase):
    """PublishEntityLoad result."""

    publish_entity: PublishEntity


@readonly_use_case(exclude_component=[AppCore.CLI])
class PublishEntityLoadUseCase(
    JupiterLoadLeafSupportEntityUseCase[PublishEntityLoadArgs, PublishEntityLoadResult]
):
    """Use case for loading a publish entity."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PublishEntityLoadArgs,
    ) -> PublishEntityLoadResult:
        """Execute the command's action."""
        _, publish_entity = await self.load_for_owner(
            uow,
            PublishDomain,
            PublishEntity,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_PUBLISH_OWNER_TYPES,
            AccessLevel.READER,
            allow_archived=args.allow_archived or False,
        )

        return PublishEntityLoadResult(publish_entity=publish_entity)
