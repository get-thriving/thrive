"""A service that checks for cycles in the docs folder tree."""

from jupiter.core.docs.sub.dir.root import Dir
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork


class DirTreeHasCyclesError(Exception):
    """Exception raised when the folder tree has cycles."""


class DirCheckCyclesService:
    """A service that checks for cycles in the docs folder graph."""

    async def check_for_cycles(self, uow: DomainUnitOfWork, dir_entity: Dir) -> None:
        """Check for cycles in the folder tree."""
        if dir_entity.is_root:
            return

        current_ref_id: EntityId | None = dir_entity.parent_dir_ref_id

        while current_ref_id is not None:
            if current_ref_id == dir_entity.ref_id:
                raise DirTreeHasCyclesError
            current_dir = await uow.get_for(Dir).load_by_id(current_ref_id)
            current_ref_id = current_dir.parent_dir_ref_id
