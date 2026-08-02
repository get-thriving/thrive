"""Support for loading, updating, archiving, and removing leaf support entities."""

from typing import Generic, TypeVar

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.service.check_owner_link_for_acl import (
    CheckOwnerLinkForAclService,
)
from jupiter.core.common.sub.access.sub.status.service.find_workspace_for_entity import (
    FindWorkspaceForEntityService,
)
from jupiter.core.common.sub.access.sub.status.service.load_for_acl import (
    LoadForAclService,
)
from jupiter.core.common.sub.access.sub.status.service.load_support_entity_for_acl import (
    LoadSupportEntityForAclService,
)
from jupiter.core.common.sub.access.sub.status.service.load_support_entity_for_owner_acl import (
    LoadSupportEntityForOwnerAclService,
)
from jupiter.core.config import (
    JupiterTransactionalLoggedInMutationUseCase,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.entity import (
    AboveGroundEntity,
    CrownEntity,
    LeafSupportEntity,
    TrunkEntity,
)
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case_io import UseCaseArgsBase, UseCaseResultBase

_TrunkEntityT = TypeVar("_TrunkEntityT", bound=TrunkEntity)
_LeafSupportEntityT = TypeVar("_LeafSupportEntityT", bound=LeafSupportEntity)
_CrownEntityT = TypeVar("_CrownEntityT", bound=CrownEntity)


class JupiterLoadLeafSupportEntityArgs(UseCaseArgsBase):
    """Args for loading a leaf support entity."""

    ref_id: EntityId
    allow_archived: bool | None


_JupiterLoadLeafSupportEntityArgsT = TypeVar(
    "_JupiterLoadLeafSupportEntityArgsT", bound=JupiterLoadLeafSupportEntityArgs
)
_JupiterLoadLeafSupportEntityResultT = TypeVar(
    "_JupiterLoadLeafSupportEntityResultT", bound=UseCaseResultBase | None
)


class JupiterLoadLeafSupportEntityUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        _JupiterLoadLeafSupportEntityArgsT, _JupiterLoadLeafSupportEntityResultT
    ],
    Generic[_JupiterLoadLeafSupportEntityArgsT, _JupiterLoadLeafSupportEntityResultT],
):
    """A Jupiter command base that loads a leaf support entity."""

    async def load_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        in_ref_id: EntityId,
    ) -> _TrunkEntityT:
        """Load the trunk that holds the support entities, off the given owner."""
        return await uow.get_for(parent_type).load_by_parent(in_ref_id)

    async def load_in_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        workspace_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity rooted in the caller's workspace via parent links."""
        return await LoadSupportEntityForAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            workspace_ref_id,
            allow_archived=allow_archived,
        )

    async def load_for_owner(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        allowed_owner_types: frozenset[str],
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity via ACL on the entity it describes."""
        return await LoadSupportEntityForOwnerAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            user_ref_id,
            caller_workspace_ref_id,
            allowed_owner_types,
            access_level,
            allow_archived=allow_archived,
        )


class JupiterUpsertLeafSupportEntityArgs(UseCaseArgsBase):
    """Args for upserting a leaf support entity against the entity it describes."""

    owner: EntityLink


_JupiterUpsertLeafSupportEntityArgsT = TypeVar(
    "_JupiterUpsertLeafSupportEntityArgsT", bound=JupiterUpsertLeafSupportEntityArgs
)
_JupiterUpsertLeafSupportEntityResultT = TypeVar(
    "_JupiterUpsertLeafSupportEntityResultT", bound=UseCaseResultBase | None
)


class JupiterUpsertLeafSupportEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterUpsertLeafSupportEntityArgsT, _JupiterUpsertLeafSupportEntityResultT
    ],
    Generic[
        _JupiterUpsertLeafSupportEntityArgsT, _JupiterUpsertLeafSupportEntityResultT
    ],
):
    """A Jupiter command base that upserts a leaf support entity for an owner."""

    async def load_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        in_ref_id: EntityId,
    ) -> _TrunkEntityT:
        """Load the trunk that holds the support entities, off the given owner."""
        return await uow.get_for(parent_type).load_by_parent(in_ref_id)

    async def check_owner_and_find_workspace(
        self,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        owner: EntityLink,
        allowed_owner_types: frozenset[str],
        access_level: AccessLevel = AccessLevel.WRITER,
        require_in_caller_workspace: bool = False,
    ) -> EntityId:
        """Check the user's access over the owner, and find the workspace holding it.

        These links are keyed on the owner alone, so upserting one reaches
        whichever workspace already holds a link for that owner. The link also
        belongs with the entity it describes rather than with whoever writes it,
        so the returned workspace is the owner's, not the caller's.

        Pass ``require_in_caller_workspace=True`` for per-workspace namespaces
        (tags, contacts) that may only attach to entities in this workspace.
        """
        return await CheckOwnerLinkForAclService(self._concept_registry).do_it(
            uow,
            owner,
            user_ref_id,
            caller_workspace_ref_id,
            access_level,
            allowed_owner_types,
            require_in_caller_workspace=require_in_caller_workspace,
        )


class JupiterCreateLeafSupportEntityArgs(UseCaseArgsBase):
    """Args for creating a leaf support entity."""


_JupiterCreateLeafSupportEntityArgsT = TypeVar(
    "_JupiterCreateLeafSupportEntityArgsT", bound=JupiterCreateLeafSupportEntityArgs
)
_JupiterCreateLeafSupportEntityResultT = TypeVar(
    "_JupiterCreateLeafSupportEntityResultT", bound=UseCaseResultBase | None
)


class JupiterCreateLeafSupportEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterCreateLeafSupportEntityArgsT, _JupiterCreateLeafSupportEntityResultT
    ],
    Generic[
        _JupiterCreateLeafSupportEntityArgsT, _JupiterCreateLeafSupportEntityResultT
    ],
):
    """A Jupiter command base that creates a leaf support entity for an owner."""

    async def load_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        in_ref_id: EntityId,
    ) -> _TrunkEntityT:
        """Load the trunk that holds the support entities, off the given owner."""
        return await uow.get_for(parent_type).load_by_parent(in_ref_id)

    async def check_owner_and_find_workspace(
        self,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        owner: EntityLink,
        allowed_owner_types: frozenset[str],
        access_level: AccessLevel = AccessLevel.WRITER,
        require_in_caller_workspace: bool = False,
    ) -> EntityId:
        """Check the user's access over the owner, and find the workspace holding it.

        The support entity belongs with the entity it describes rather than with
        whoever creates it, so the returned workspace is the owner's, not the
        caller's.
        """
        return await CheckOwnerLinkForAclService(self._concept_registry).do_it(
            uow,
            owner,
            user_ref_id,
            caller_workspace_ref_id,
            access_level,
            allowed_owner_types,
            require_in_caller_workspace=require_in_caller_workspace,
        )

    async def find_entity_workspace(
        self,
        uow: DomainUnitOfWork,
        entity: AboveGroundEntity,
    ) -> EntityId:
        """Find the workspace an entity sits in by walking its parents."""
        return await FindWorkspaceForEntityService(self._concept_registry).do_it(
            uow, entity
        )

    async def load_owner_entity(
        self,
        uow: DomainUnitOfWork,
        user_ref_id: EntityId,
        entity_type: type[_CrownEntityT],
        ref_id: EntityId,
        access_level: AccessLevel = AccessLevel.WRITER,
    ) -> tuple[_CrownEntityT, EntityId]:
        """Load the entity the support record describes, with the workspace holding it."""
        entity = await LoadForAclService().do_it(
            uow,
            entity_type,
            ref_id,
            user_ref_id,
            access_level,
        )
        workspace_ref_id = await self.find_entity_workspace(uow, entity)
        return entity, workspace_ref_id


class JupiterUpdateLeafSupportEntityArgs(UseCaseArgsBase):
    """Args for updating a leaf support entity."""

    ref_id: EntityId


_JupiterUpdateLeafSupportEntityArgsT = TypeVar(
    "_JupiterUpdateLeafSupportEntityArgsT", bound=JupiterUpdateLeafSupportEntityArgs
)
_JupiterUpdateLeafSupportEntityResultT = TypeVar(
    "_JupiterUpdateLeafSupportEntityResultT", bound=UseCaseResultBase | None
)


class JupiterUpdateLeafSupportEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterUpdateLeafSupportEntityArgsT, _JupiterUpdateLeafSupportEntityResultT
    ],
    Generic[
        _JupiterUpdateLeafSupportEntityArgsT, _JupiterUpdateLeafSupportEntityResultT
    ],
):
    """A Jupiter command base that updates a leaf support entity."""

    async def load_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        in_ref_id: EntityId,
    ) -> _TrunkEntityT:
        """Load the trunk that holds the support entities, off the given owner."""
        return await uow.get_for(parent_type).load_by_parent(in_ref_id)

    async def load_in_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        workspace_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity rooted in the caller's workspace via parent links."""
        return await LoadSupportEntityForAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            workspace_ref_id,
            allow_archived=allow_archived,
        )

    async def load_for_owner(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        allowed_owner_types: frozenset[str],
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity via ACL on the entity it describes."""
        return await LoadSupportEntityForOwnerAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            user_ref_id,
            caller_workspace_ref_id,
            allowed_owner_types,
            access_level,
            allow_archived=allow_archived,
        )


class JupiterArchiveLeafSupportEntityArgs(UseCaseArgsBase):
    """Args for archiving a leaf support entity."""

    ref_id: EntityId


_JupiterArchiveLeafSupportEntityArgsT = TypeVar(
    "_JupiterArchiveLeafSupportEntityArgsT", bound=JupiterArchiveLeafSupportEntityArgs
)
_JupiterArchiveLeafSupportEntityResultT = TypeVar(
    "_JupiterArchiveLeafSupportEntityResultT", bound=UseCaseResultBase | None
)


class JupiterArchiveLeafSupportEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterArchiveLeafSupportEntityArgsT, _JupiterArchiveLeafSupportEntityResultT
    ],
    Generic[
        _JupiterArchiveLeafSupportEntityArgsT, _JupiterArchiveLeafSupportEntityResultT
    ],
):
    """A Jupiter command base that archives a leaf support entity."""

    async def load_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        in_ref_id: EntityId,
    ) -> _TrunkEntityT:
        """Load the trunk that holds the support entities, off the given owner."""
        return await uow.get_for(parent_type).load_by_parent(in_ref_id)

    async def load_in_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        workspace_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity rooted in the caller's workspace via parent links."""
        return await LoadSupportEntityForAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            workspace_ref_id,
            allow_archived=allow_archived,
        )

    async def load_for_owner(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        allowed_owner_types: frozenset[str],
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity via ACL on the entity it describes."""
        return await LoadSupportEntityForOwnerAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            user_ref_id,
            caller_workspace_ref_id,
            allowed_owner_types,
            access_level,
            allow_archived=allow_archived,
        )


class JupiterRemoveLeafSupportEntityArgs(UseCaseArgsBase):
    """Args for removing a leaf support entity."""

    ref_id: EntityId


_JupiterRemoveLeafSupportEntityArgsT = TypeVar(
    "_JupiterRemoveLeafSupportEntityArgsT", bound=JupiterRemoveLeafSupportEntityArgs
)
_JupiterRemoveLeafSupportEntityResultT = TypeVar(
    "_JupiterRemoveLeafSupportEntityResultT", bound=UseCaseResultBase | None
)


class JupiterRemoveLeafSupportEntityUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        _JupiterRemoveLeafSupportEntityArgsT, _JupiterRemoveLeafSupportEntityResultT
    ],
    Generic[
        _JupiterRemoveLeafSupportEntityArgsT, _JupiterRemoveLeafSupportEntityResultT
    ],
):
    """A Jupiter command base that removes a leaf support entity."""

    async def load_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        in_ref_id: EntityId,
    ) -> _TrunkEntityT:
        """Load the trunk that holds the support entities, off the given owner."""
        return await uow.get_for(parent_type).load_by_parent(in_ref_id)

    async def load_in_parent(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        workspace_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity rooted in the caller's workspace via parent links."""
        return await LoadSupportEntityForAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            workspace_ref_id,
            allow_archived=allow_archived,
        )

    async def load_for_owner(
        self,
        uow: DomainUnitOfWork,
        parent_type: type[_TrunkEntityT],
        entity_type: type[_LeafSupportEntityT],
        ref_id: EntityId,
        user_ref_id: EntityId,
        caller_workspace_ref_id: EntityId,
        allowed_owner_types: frozenset[str],
        access_level: AccessLevel,
        allow_archived: bool = False,
    ) -> tuple[_TrunkEntityT, _LeafSupportEntityT]:
        """Load a support entity via ACL on the entity it describes."""
        return await LoadSupportEntityForOwnerAclService(self._concept_registry).do_it(
            uow,
            parent_type,
            entity_type,
            ref_id,
            user_ref_id,
            caller_workspace_ref_id,
            allowed_owner_types,
            access_level,
            allow_archived=allow_archived,
        )
