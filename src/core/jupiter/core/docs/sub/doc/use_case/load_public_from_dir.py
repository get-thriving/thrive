"""Guest readonly use case for loading a doc via a published directory."""

from jupiter.core.common.sub.publish.sub.entity.external_id import PublishExternalId
from jupiter.core.config import (
    JupiterGuestReadonlyContext,
    JupiterGuestReadonlyUseCase,
)
from jupiter.core.docs.sub.dir.service.published import DirPublishedLoadService
from jupiter.core.docs.sub.doc.service.load import DocLoadResult, DocLoadService
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class DocLoadPublicFromDirArgs(UseCaseArgsBase):
    """DocLoadPublicFromDir args."""

    external_id: PublishExternalId
    dir_ref_id: EntityId
    ref_id: EntityId


class DocLoadPublicFromDirUseCase(
    JupiterGuestReadonlyUseCase[DocLoadPublicFromDirArgs, DocLoadResult]
):
    """Load a doc through a published directory."""

    async def _execute(
        self,
        context: JupiterGuestReadonlyContext,
        args: DocLoadPublicFromDirArgs,
    ) -> DocLoadResult:
        """Execute the use case."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            service = DirPublishedLoadService()
            published = await service.load_context(uow, args.external_id)
            doc = await service.load_doc_under_published_dir(
                uow,
                published,
                args.dir_ref_id,
                args.ref_id,
            )

            return await DocLoadService().do_it(
                uow,
                doc,
                allow_archived=False,
                include_publish_entity=False,
            )
