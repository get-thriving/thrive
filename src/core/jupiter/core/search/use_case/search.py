"""Use case for free form searching through jupiter."""

from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterLoggedInReadonlyUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.search.limit import SearchLimit
from jupiter.core.search.offset import SearchOffset
from jupiter.core.search.query import SearchQuery
from jupiter.core.search.repository import SearchMatch
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.use_case import (
    UnavailableForContextError,
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class SearchArgs(UseCaseArgsBase):
    """Search args."""

    query: SearchQuery
    limit: SearchLimit
    include_archived: bool
    filter_entity_tags: list[NamedEntityTag] | None
    filter_tag_ref_ids: list[EntityId] | None
    filter_contact_ref_ids: list[EntityId] | None
    filter_created_time_after: ADate | None
    filter_created_time_before: ADate | None
    filter_last_modified_time_after: ADate | None
    filter_last_modified_time_before: ADate | None
    filter_archived_time_after: ADate | None
    filter_archived_time_before: ADate | None
    offset: SearchOffset | None = None


@use_case_result
class SearchResult(UseCaseResultBase):
    """Search result."""

    search_time: ADate
    matches: list[SearchMatch]
    total_match_count: int


@readonly_use_case()
class SearchUseCase(JupiterLoggedInReadonlyUseCase[SearchArgs, SearchResult]):
    """Use case for free form searching through jupiter."""

    async def _execute(
        self, context: JupiterLoggedInReadonlyContext, args: SearchArgs
    ) -> SearchResult:
        """Execute the command's action."""
        workspace = context.workspace

        filter_entity_tags = (
            args.filter_entity_tags
            if args.filter_entity_tags is not None
            else workspace.infer_entity_tags_for_enabled_features(None)
        )
        filter_entity_tags_diff = list(
            set(filter_entity_tags).difference(
                workspace.infer_entity_tags_for_enabled_features(filter_entity_tags)
            )
        )
        if len(filter_entity_tags_diff) > 0:
            raise UnavailableForContextError(
                f"Entities {','.join(s.value for s in filter_entity_tags_diff)} are not supported in this workspace"
            )

        effective_offset = SearchOffset(0) if args.offset is None else args.offset

        async with self._ports.search_storage_engine.get_unit_of_work() as uow:
            matches_page = await uow.search_repository.search(
                workspace_ref_id=workspace.ref_id,
                query=args.query,
                limit=args.limit,
                offset=effective_offset,
                include_archived=args.include_archived,
                filter_entity_tags=filter_entity_tags,
                filter_tag_ref_ids=args.filter_tag_ref_ids,
                filter_contact_ref_ids=args.filter_contact_ref_ids,
                filter_created_time_after=args.filter_created_time_after,
                filter_created_time_before=args.filter_created_time_before,
                filter_last_modified_time_after=args.filter_last_modified_time_after,
                filter_last_modified_time_before=args.filter_last_modified_time_before,
                filter_archived_time_after=args.filter_archived_time_after,
                filter_archived_time_before=args.filter_archived_time_before,
            )

        return SearchResult(
            search_time=self._time_provider.get_current_date(),
            matches=matches_page.matches,
            total_match_count=matches_page.total_match_count,
        )
