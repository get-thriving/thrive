import {
  ApiError,
  NamedEntityTag,
  type SearchArgs,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { CheckboxAsString, parseQuery } from "zodix";
import {
  fixSelectOutputToEnum,
  selectZod,
} from "@jupiter/core/common/select-form";
import {
  noErrorSomeData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";

import { getLoggedInApiClient } from "~/api-clients.server";

const WORKSPACE_SEARCH_DEFAULT_LIMIT = 30;

const WorkspaceSearchQuerySchema = z.object({
  query: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
  includeArchived: CheckboxAsString,
  filterEntityTags: selectZod(z.nativeEnum(NamedEntityTag)).optional(),
  filterCreatedTimeAfter: z.string().optional(),
  filterCreatedTimeBefore: z.string().optional(),
  filterLastModifiedTimeAfter: z.string().optional(),
  filterLastModifiedTimeBefore: z.string().optional(),
  filterArchivedTimeAfter: z.string().optional(),
  filterArchivedTimeBefore: z.string().optional(),
});

type WorkspaceSearchParsedQuery = z.infer<typeof WorkspaceSearchQuerySchema>;

function parseWorkspaceSearchQuery(request: Request) {
  return parseQuery(request, WorkspaceSearchQuerySchema);
}

function workspaceSearchArgsFromParsedQuery(
  query: WorkspaceSearchParsedQuery,
): SearchArgs | undefined {
  if (query.query === undefined || query.query.trim() === "") {
    return undefined;
  }

  const parsedOffset =
    query.offset !== undefined && query.offset.trim() !== ""
      ? parseInt(query.offset, 10)
      : undefined;

  return {
    query: query.query,
    limit: query.limit
      ? parseInt(query.limit, 10)
      : WORKSPACE_SEARCH_DEFAULT_LIMIT,
    ...(parsedOffset !== undefined && !Number.isNaN(parsedOffset)
      ? { offset: parsedOffset }
      : {}),
    include_archived: query.includeArchived,
    filter_entity_tags: fixSelectOutputToEnum<NamedEntityTag>(
      query.filterEntityTags,
    ),
    filter_created_time_after: query.filterCreatedTimeAfter || undefined,
    filter_created_time_before: query.filterCreatedTimeBefore || undefined,
    filter_last_modified_time_after:
      query.filterLastModifiedTimeAfter || undefined,
    filter_last_modified_time_before:
      query.filterLastModifiedTimeBefore || undefined,
    filter_archived_time_after: query.filterArchivedTimeAfter || undefined,
    filter_archived_time_before: query.filterArchivedTimeBefore || undefined,
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseWorkspaceSearchQuery(request);
  const searchArgs = workspaceSearchArgsFromParsedQuery(query);

  const emptyPayload = {
    query: query.query,
    limit: query.limit,
    offset: query.offset,
    includeArchived: query.includeArchived,
    filterEntityTags: fixSelectOutputToEnum<NamedEntityTag>(
      query.filterEntityTags,
    ),
    filterCreatedTimeAfter: query.filterCreatedTimeAfter,
    filterCreatedTimeBefore: query.filterCreatedTimeBefore,
    filterLastModifiedTimeAfter: query.filterLastModifiedTimeAfter,
    filterLastModifiedTimeBefore: query.filterLastModifiedTimeBefore,
    filterArchivedTimeAfter: query.filterArchivedTimeAfter,
    filterArchivedTimeBefore: query.filterArchivedTimeBefore,
    result: undefined,
  };

  if (searchArgs === undefined) {
    return json(noErrorSomeData(emptyPayload));
  }

  try {
    const searchResponse = await apiClient.search.search(searchArgs);

    return json(
      noErrorSomeData({
        ...emptyPayload,
        result: searchResponse,
      }),
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export default function SearchInstantRoute() {
  return null;
}
