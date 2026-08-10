"""Guest readonly use case for loading a published directory."""

from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.crown_entity_reader import UnrestrictedCrownEntityReader
from jupiter.core.docs.sub.dir.service.load import DirLoadResult, DirLoadService
from jupiter.core.docs.sub.dir.service.published import DirPublishedLoadService
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DirLoadPublicArgs(UseCaseArgsBase):
    """DirLoadPublic args."""

    external_id: PublishExternalId


class DirLoadPublicUseCase(
    JupiterGuestReadonlyUseCase[DirLoadPublicArgs, DirLoadResult]
):
    """Load a published directory by publish external id."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: DirLoadPublicArgs,
    ) -> DirLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            published = await DirPublishedLoadService().load_context(
                uow, args.external_id
            )

            return await DirLoadService().do_it(
                uow,
                published.doc_collection.workspace.ref_id,
                published.published_dir,
                crown_entity_reader=UnrestrictedCrownEntityReader(uow),
                allow_archived=False,
                include_publish_entity=False,
            )
