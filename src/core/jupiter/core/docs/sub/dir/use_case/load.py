"""Load a directory with its docs (notes and tags), and immediate child directories."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.publish.sub.entity.root import PublishEntity
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
)
from jupiter.core.crown_entity_support import (
    JupiterLoadCrownEntityArgs,
    JupiterLoadCrownEntityUseCase,
)
from jupiter.core.docs.sub.dir.root import Dir
from jupiter.core.docs.sub.doc.root import Doc
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class DirLoadArgs(JupiterLoadCrownEntityArgs):
    """Arguments for loading a directory listing."""

    ref_id: EntityId
    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class DirLoadResultEntry(UseCaseResultBase):
    """One doc in the loaded directory."""

    doc: Doc
    tags: list[Tag]
    note: Note


@use_case_result_part
class DirLoadSubdirEntry(UseCaseResultBase):
    """One subdirectory row (tags only; no note body)."""

    dir: Dir
    tags: list[Tag]


@use_case_result
class DirLoadResult(UseCaseResultBase):
    """Loaded directory, its docs, and immediate child directories."""

    dir: Dir
    entries: list[DirLoadResultEntry]
    subdirs: list[DirLoadSubdirEntry]
    publish_entity: PublishEntity | None


@readonly_use_case(WorkspaceFeature.DOCS, exclude_component=[AppCore.CLI])
class DirLoadUseCase(JupiterLoadCrownEntityUseCase[DirLoadArgs, DirLoadResult]):
    """Load a directory with docs (notes and tags always included) and child dirs."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: DirLoadArgs,
    ) -> DirLoadResult:
        """Execute the command's action."""
        from jupiter.core.docs.sub.dir.service.load import DirLoadService

        allow_archived = args.allow_archived or False
        workspace = context.workspace

        dir_entity = await self.load_entity(
            uow,
            context.user.ref_id,
            Dir,
            args.ref_id,
            allow_archived,
        )

        return await DirLoadService().do_it(
            uow,
            workspace.ref_id,
            dir_entity,
            crown_entity_reader=self.crown_entity_reader(uow, context.user.ref_id),
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
            include_publish_entity=True,
        )
