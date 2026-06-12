"""Use case for loading a publish entity."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.publish.root import PublishDomain
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntity
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class PublishEntityLoadArgs(UseCaseArgsBase):
    """PublishEntityLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class PublishEntityLoadResult(UseCaseResultBase):
    """PublishEntityLoad result."""

    publish_entity: PublishEntity


@readonly_use_case(exclude_component=[AppCore.CLI])
class PublishEntityLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        PublishEntityLoadArgs, PublishEntityLoadResult
    ]
):
    """Use case for loading a publish entity."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PublishEntityLoadArgs,
    ) -> PublishEntityLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        publish_domain = await uow.get_for(PublishDomain).load_by_parent(
            context.workspace.ref_id
        )
        publish_entity = await uow.get_for(PublishEntity).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        if publish_entity.parent_ref_id != publish_domain.ref_id:
            raise InputValidationError(
                "The publish entity does not belong to this workspace."
            )

        return PublishEntityLoadResult(publish_entity=publish_entity)
