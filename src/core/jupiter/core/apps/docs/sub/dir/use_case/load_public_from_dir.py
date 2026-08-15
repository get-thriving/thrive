"""Guest readonly use case for loading a subdirectory via a published directory."""

from jupiter.core.apps.docs.sub.dir.service.load import DirLoadResult, DirLoadService
from jupiter.core.apps.docs.sub.dir.service.published import DirPublishedLoadService
from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.crown_entity_reader import UnrestrictedCrownEntityReader
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DirLoadPublicFromDirArgs(UseCaseArgsBase):
    """DirLoadPublicFromDir args."""

    external_id: PublishExternalId
    ref_id: EntityId


class DirLoadPublicFromDirUseCase(
    JupiterGuestReadonlyUseCase[DirLoadPublicFromDirArgs, DirLoadResult]
):
    """Load a subdirectory through a published directory."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: DirLoadPublicFromDirArgs,
    ) -> DirLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            service = DirPublishedLoadService()
            published = await service.load_context(uow, args.external_id)
            dir_entity = await service.load_dir_under_published_root(
                uow,
                published,
                args.ref_id,
            )

            return await DirLoadService().do_it(
                uow,
                published.doc_collection.workspace.ref_id,
                dir_entity,
                crown_entity_reader=UnrestrictedCrownEntityReader(uow),
                allow_archived=False,
                include_publish_entity=False,
            )
