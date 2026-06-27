"""Support for loading, finding, creating, updating, archiving, and removing crown entities."""

from typing import Generic, TypeVar

from jupiter.core.common.access.access_level import AccessLevel
from jupiter.core.common.access.sub.grant.service.grant_rights_to_user import (
    GrantRightsToUserService,
)
from jupiter.core.common.access.sub.status.service.load_for_acl import LoadForAclService
from jupiter.core.config import (
    JupiterTransactionalLoggedInMutationUseCase,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import CrownEntity
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseArgsBase


_CrownEntityT = TypeVar("_CrownEntityT", bound=CrownEntity)


class JupiterLoadCrownEntityArgs(UseCaseArgsBase):
    """Args for loading a crown entity."""

    ref_id: EntityId
    allow_archived: bool | None


_JupiterLoadCrownEntityArgsT = TypeVar(
    "_JupiterLoadCrownEntityArgsT", bound=JupiterLoadCrownEntityArgs
)
_JupiterLoadCrownEntityResultT = TypeVar("_JupiterLoadCrownEntityResultT")


class JupiterLoadCrownEntityUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        _JupiterLoadCrownEntityArgsT, _JupiterLoadCrownEntityResultT
    ],
    Generic[_JupiterLoadCrownEntityArgsT, _JupiterLoadCrownEntityResultT],
):
    """A Jupiter command base that loads a crown entity."""

    async def load_entity(
        self,
        uow: DomainUnitOfWork,
        user_id: EntityId,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
        allow_archived: bool = False,
    ) -> _CrownEntityT:
        """Load a crown entity for the current user, enforcing reader access."""
        return await LoadForAclService().do_it(
            uow,
            entity_type,
            ref_id,
            user_id,
            AccessLevel.READER,
            allow_archived=allow_archived,
        )


class JupiterFindCrownEntityArgs(UseCaseArgsBase):
    """Args for finding crown entities."""


_JupiterFindCrownEntityArgsT = TypeVar(
    "_JupiterFindCrownEntityArgsT", bound=JupiterFindCrownEntityArgs
)
_JupiterFindCrownEntityResultT = TypeVar("_JupiterFindCrownEntityResultT")


class JupiterFindCrownEntityUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        _JupiterFindCrownEntityArgsT, _JupiterFindCrownEntityResultT
    ],
    Generic[_JupiterFindCrownEntityArgsT, _JupiterFindCrownEntityResultT],
):
    """A Jupiter command base that finds crown entities."""


class JupiterCreateCrownEntityArgs(UseCaseArgsBase):
    """Args for creating a crown entity."""


_JupiterCreateCrownEntityArgsT = TypeVar(
    "_JupiterCreateCrownEntityArgsT", bound=JupiterCreateCrownEntityArgs
)
_JupiterCreateCrownEntityResultT = TypeVar("_JupiterCreateCrownEntityResultT")


class JupiterCreateCrownEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterCreateCrownEntityArgsT, _JupiterCreateCrownEntityResultT
    ],
    Generic[_JupiterCreateCrownEntityArgsT, _JupiterCreateCrownEntityResultT],
):
    """A Jupiter command base that creates a crown entity."""

    async def create_entity(
        self,
        domain_context: DomainContext,
        uow: DomainUnitOfWork,
        user_id: EntityId,
        entity: _CrownEntityT,
        access_level: AccessLevel = AccessLevel.OWNER,
    ) -> _CrownEntityT:
        """Create a crown entity for the current user, granting them access."""
        entity_type = type(entity)
        created = await uow.get_for(entity_type).create(entity)
        await GrantRightsToUserService(self._concept_registry).do_it(
            domain_context,
            uow,
            EntityLink.std(entity_type.__name__, created.ref_id),
            user_id,
            access_level,
        )
        return created


class JupiterUpdateCrownEntityArgs(UseCaseArgsBase):
    """Args for updating a crown entity."""

    ref_id: EntityId


_JupiterUpdateCrownEntityArgsT = TypeVar(
    "_JupiterUpdateCrownEntityArgsT", bound=JupiterUpdateCrownEntityArgs
)
_JupiterUpdateCrownEntityResultT = TypeVar("_JupiterUpdateCrownEntityResultT")


class JupiterUpdateCrownEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterUpdateCrownEntityArgsT, _JupiterUpdateCrownEntityResultT
    ],
    Generic[_JupiterUpdateCrownEntityArgsT, _JupiterUpdateCrownEntityResultT],
):
    """A Jupiter command base that updates a crown entity."""

    async def load_entity(
        self,
        uow: DomainUnitOfWork,
        user_id: EntityId,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
        allow_archived: bool = False,
    ) -> _CrownEntityT:
        """Load a crown entity for the current user, enforcing writer access."""
        return await LoadForAclService().do_it(
            uow,
            entity_type,
            ref_id,
            user_id,
            AccessLevel.WRITER,
            allow_archived=allow_archived,
        )


class JupiterArchiveCrownEntityArgs(UseCaseArgsBase):
    """Args for archiving a crown entity."""

    ref_id: EntityId


_JupiterArchiveCrownEntityArgsT = TypeVar("_JupiterArchiveCrownEntityArgsT", bound=JupiterArchiveCrownEntityArgs)
_JupiterArchiveCrownEntityResultT = TypeVar("_JupiterArchiveCrownEntityResultT")


class JupiterArchiveCrownEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterArchiveCrownEntityArgsT, _JupiterArchiveCrownEntityResultT
    ],
    Generic[_JupiterArchiveCrownEntityArgsT, _JupiterArchiveCrownEntityResultT],
):
    """A Jupiter command base that archives a crown entity."""

    async def load_entity(
        self,
        uow: DomainUnitOfWork,
        user_id: EntityId,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
        allow_archived: bool = False,
    ) -> _CrownEntityT:
        """Load a crown entity for the current user, enforcing writer access."""
        return await LoadForAclService().do_it(
            uow,
            entity_type,
            ref_id,
            user_id,
            AccessLevel.WRITER,
            allow_archived=allow_archived,
        )


class JupiterRemoveCrownEntityArgs(UseCaseArgsBase):
    """Args for removing a crown entity."""

    ref_id: EntityId


_JupiterRemoveCrownEntityArgsT = TypeVar(
    "_JupiterRemoveCrownEntityArgsT", bound=JupiterRemoveCrownEntityArgs
)
_JupiterRemoveCrownEntityResultT = TypeVar("_JupiterRemoveCrownEntityResultT")


class JupiterRemoveCrownEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterRemoveCrownEntityArgsT, _JupiterRemoveCrownEntityResultT
    ],
    Generic[_JupiterRemoveCrownEntityArgsT, _JupiterRemoveCrownEntityResultT],
):
    """A Jupiter command base that removes a crown entity."""

    async def load_entity(
        self,
        uow: DomainUnitOfWork,
        user_id: EntityId,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
    ) -> _CrownEntityT:
        """Load a crown entity for the current user, enforcing writer access."""
        return await LoadForAclService().do_it(
            uow,
            entity_type,
            ref_id,
            user_id,
            AccessLevel.WRITER,
            allow_archived=True,
        )
