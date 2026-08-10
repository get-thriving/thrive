"""Use case for loading a note."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.grant.service.get_access_level_for_entity import (
    GetAccessLevelForEntityService,
)
from jupiter.core.common.sub.access.sub.status.root import AccessStatus
from jupiter.core.common.sub.access.sub.status.service.owner_user_ref_ids_for_entities import (
    OwnerUserRefIdsForEntitiesService,
)
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.root import ALLOWED_NOTE_OWNER_TYPES, Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterLoadLeafSupportEntityArgs,
    JupiterLoadLeafSupportEntityUseCase,
)
from jupiter.core.users.root import UserRepository
from jupiter.core.users.user_light import UserLight
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class NoteLoadArgs(JupiterLoadLeafSupportEntityArgs):
    """NoteLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class NoteLoadResult(UseCaseResultBase):
    """NoteLoad result."""

    note: Note
    owner: UserLight
    access_status: AccessStatus | None


@readonly_use_case(exclude_component=[AppCore.CLI])
class NoteLoadUseCase(
    JupiterLoadLeafSupportEntityUseCase[NoteLoadArgs, NoteLoadResult]
):
    """Use case for loading a note."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: NoteLoadArgs,
    ) -> NoteLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        _, note = await self.load_for_owner(
            uow,
            NoteCollection,
            Note,
            args.ref_id,
            context.user.ref_id,
            context.workspace.ref_id,
            ALLOWED_NOTE_OWNER_TYPES,
            AccessLevel.READER,
            allow_archived=allow_archived,
        )
        owner_ref_ids_by_entity = await OwnerUserRefIdsForEntitiesService().do_it(
            uow, [note.owner]
        )
        owner_user_ref_id = owner_ref_ids_by_entity.get(
            note.owner.ref_id, context.user.ref_id
        )
        owners = await uow.get(UserRepository).find_all_light_by_ref_ids(
            [owner_user_ref_id]
        )
        owner = owners[0]
        access_status = (
            await GetAccessLevelForEntityService().do_it(
                uow, note.owner, context.user.ref_id
            )
            if note.owner.ref_id in owner_ref_ids_by_entity
            else None
        )
        return NoteLoadResult(
            note=note,
            owner=owner,
            access_status=access_status,
        )
