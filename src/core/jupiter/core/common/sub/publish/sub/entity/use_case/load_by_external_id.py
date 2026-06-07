"""Guest readonly use case for loading a publish entity by external id."""

from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.common.sub.publish.sub.entity.root import (
    PublishEntity,
    PublishEntityRepository,
)
from jupiter.core.common.sub.publish.sub.entity.status import PublishEntityStatus
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class PublishEntityLoadByExternalIdArgs(UseCaseArgsBase):
    """PublishEntityLoadByExternalId args."""

    external_id: PublishExternalId


@use_case_result
class PublishEntityLoadByExternalIdResult(UseCaseResultBase):
    """PublishEntityLoadByExternalId result."""

    publish_entity: PublishEntity


class PublishEntityLoadByExternalIdUseCase(
    JupiterGuestReadonlyUseCase[
        PublishEntityLoadByExternalIdArgs, PublishEntityLoadByExternalIdResult
    ]
):
    """Load a publish entity by its external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: PublishEntityLoadByExternalIdArgs,
    ) -> PublishEntityLoadByExternalIdResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            publish_entity = await uow.get(PublishEntityRepository).load_by_external_id(
                args.external_id
            )

            if publish_entity.status != PublishEntityStatus.ACTIVE:
                raise InputValidationError(
                    "The publish entity is not active and cannot be loaded."
                )

            return PublishEntityLoadByExternalIdResult(publish_entity=publish_entity)
