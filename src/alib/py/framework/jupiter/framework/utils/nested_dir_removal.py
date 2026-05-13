"""Support removal of ``Dir`` rows with a self-FK on ``parent_dir_ref_id``.

``DocCollection`` lists all dirs flat via ``ContainsMany``; generic removers must still delete
deepest dirs first so PostgreSQL does not reject deletes that leave children pointing at the row.
"""

from collections.abc import Awaitable, Callable
from typing import cast

from jupiter.framework.entity import CrownEntity
from jupiter.framework.storage.repository import DomainUnitOfWork


async def remove_nested_dirs_first(
    uow: DomainUnitOfWork,
    entity: CrownEntity,
    recurse: Callable[[CrownEntity], Awaitable[None]],
) -> None:
    """Depth-first: remove descendant dirs before processing ``entity`` (same order as production DirRemove)."""
    if type(entity).__name__ != "Dir":
        return
    doc_col = getattr(entity, "doc_collection", None)
    if doc_col is None:
        return
    repo = uow.get_for(type(entity))
    child_dirs = await repo.find_all_generic(
        parent_ref_id=doc_col.ref_id,
        allow_archived=True,
        parent_dir_ref_id=[entity.ref_id],
    )
    for child in child_dirs:
        await recurse(cast(CrownEntity, child))
