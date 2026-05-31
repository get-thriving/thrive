import type {
  Contact,
  EntityId,
  NamedEntityTag,
  SearchResult,
  Tag,
} from "@jupiter/webapi-client";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Dialog,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
} from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";

import type { ActionResult } from "#/core/infra/action-result";
import { isNoErrorSomeData } from "#/core/infra/action-result";
import { GlobalError } from "#/core/infra/component/errors";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { ContactsFilterPicker } from "#/core/common/sub/contacts/component/contacts-filter-picker";
import { TagsFilterPicker } from "#/core/common/sub/tags/component/tags-filter-picker";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { SearchToolFilterFields } from "#/core/search/components/search-tool-filter-fields";
import { SearchToolResults } from "#/core/search/components/search-tool-results";

const WORKSPACE_SEARCH_DEFAULT_LIMIT = 30;

type WorkspaceSearchInstantPayload = {
  query: string | undefined;
  limit: string | undefined;
  offset: string | undefined;
  includeArchived: boolean;
  filterEntityTags: NamedEntityTag[] | undefined;
  filterTagRefIds: EntityId[] | undefined;
  filterContactRefIds: EntityId[] | undefined;
  filterCreatedTimeAfter: string | undefined;
  filterCreatedTimeBefore: string | undefined;
  filterLastModifiedTimeAfter: string | undefined;
  filterLastModifiedTimeBefore: string | undefined;
  filterArchivedTimeAfter: string | undefined;
  filterArchivedTimeBefore: string | undefined;
  result: SearchResult | undefined;
};

type WorkspaceSearchInstantResponse =
  ActionResult<WorkspaceSearchInstantPayload>;

const WORKSPACE_SEARCH_INSTANT_ROUTE = "/app/workspace/search-instant";

const SEARCH_INPUT_DEBOUNCE_MS = 300;

interface SearchWidgetProps {
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
}

export function SearchWidget({ allTags, allContacts }: SearchWidgetProps) {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const searchFetcher = useFetcher<WorkspaceSearchInstantResponse>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLimit, setSearchLimit] = useState<string | undefined>(undefined);
  const [searchOffset, setSearchOffset] = useState(0);
  const [searchIncludeArchived, setSearchIncludeArchived] = useState(false);
  const [searchFilterEntityTags, setSearchFilterEntityTags] = useState<
    NamedEntityTag[]
  >([]);
  const [searchFilterTagRefIds, setSearchFilterTagRefIds] = useState<
    EntityId[]
  >([]);
  const [searchFilterContactRefIds, setSearchFilterContactRefIds] = useState<
    EntityId[]
  >([]);
  const [searchFilterCreatedTimeAfter, setSearchFilterCreatedTimeAfter] =
    useState<string | undefined>(undefined);
  const [searchFilterCreatedTimeBefore, setSearchFilterCreatedTimeBefore] =
    useState<string | undefined>(undefined);
  const [
    searchFilterLastModifiedTimeAfter,
    setSearchFilterLastModifiedTimeAfter,
  ] = useState<string | undefined>(undefined);
  const [
    searchFilterLastModifiedTimeBefore,
    setSearchFilterLastModifiedTimeBefore,
  ] = useState<string | undefined>(undefined);
  const [searchFilterArchivedTimeAfter, setSearchFilterArchivedTimeAfter] =
    useState<string | undefined>(undefined);
  const [searchFilterArchivedTimeBefore, setSearchFilterArchivedTimeBefore] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handle = window.setTimeout(() => {
      searchFetcher.load(
        buildSearchInstantUrl({
          searchQuery,
          searchLimit,
          searchOffset,
          searchIncludeArchived,
          searchFilterEntityTags,
          searchFilterTagRefIds,
          searchFilterContactRefIds,
          searchFilterCreatedTimeAfter,
          searchFilterCreatedTimeBefore,
          searchFilterLastModifiedTimeAfter,
          searchFilterLastModifiedTimeBefore,
          searchFilterArchivedTimeAfter,
          searchFilterArchivedTimeBefore,
        }),
      );
    }, SEARCH_INPUT_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
    // `searchFetcher` from `useFetcher` is stable; listing it triggers redundant runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- searchFetcher.load only
  }, [
    open,
    searchQuery,
    searchLimit,
    searchOffset,
    searchIncludeArchived,
    searchFilterEntityTags,
    searchFilterTagRefIds,
    searchFilterContactRefIds,
    searchFilterCreatedTimeAfter,
    searchFilterCreatedTimeBefore,
    searchFilterLastModifiedTimeAfter,
    searchFilterLastModifiedTimeBefore,
    searchFilterArchivedTimeAfter,
    searchFilterArchivedTimeBefore,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const id = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setFiltersOpen(false);
    setSearchOffset(0);
  };

  const inputsEnabled = searchFetcher.state === "idle";

  const instantAction = searchFetcher.data as
    | WorkspaceSearchInstantResponse
    | undefined;

  const limitAsked =
    instantAction !== undefined &&
    isNoErrorSomeData(instantAction) &&
    instantAction.data.limit
      ? parseInt(instantAction.data.limit, 10)
      : WORKSPACE_SEARCH_DEFAULT_LIMIT;

  return (
    <>
      <IconButton
        id="open-instant-search"
        size="large"
        color="inherit"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <SearchIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        fullScreen={!isBigScreen}
        maxWidth={false}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              position: "fixed",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              m: { xs: 0, sm: "2rem" },
              width: {
                sm: "min(56rem, calc(100vw - 4rem))",
              },
              height: {
                sm: "min(80vh, calc(100 * var(--vh, 1vh) - 4rem))",
              },
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flex: 1,
          }}
        >
          {searchFetcher.state !== "idle" && (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                borderTopLeftRadius: 1,
                borderTopRightRadius: 1,
              }}
            />
          )}

          <Box sx={{ mb: 1 }}>
            {/* Mobile row 1: close button + search bar */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "flex", sm: "none" }, mb: 1 }}
            >
              <TextField
                inputRef={searchInputRef}
                fullWidth
                size="small"
                label="Query"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchOffset(0);
                  setSearchQuery(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <IconButton
                id="instant-search-close"
                aria-label="Close search"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            {/* Mobile row 2: tags + contacts + settings */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
                <TagsFilterPicker
                  allTags={allTags}
                  value={searchFilterTagRefIds}
                  onChange={(next) => {
                    setSearchOffset(0);
                    setSearchFilterTagRefIds(next);
                  }}
                  inputsEnabled={inputsEnabled}
                  label="Tags"
                  size="small"
                />
              </Box>
              <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
                <ContactsFilterPicker
                  allContacts={allContacts}
                  value={searchFilterContactRefIds}
                  onChange={(next) => {
                    setSearchOffset(0);
                    setSearchFilterContactRefIds(next);
                  }}
                  inputsEnabled={inputsEnabled}
                  label="Contacts"
                  size="small"
                />
              </Box>
              <IconButton
                id="instant-search-filters"
                aria-label="Search filters"
                color={filtersOpen ? "primary" : "default"}
                onClick={() => setFiltersOpen((s) => !s)}
              >
                <TuneIcon />
              </IconButton>
            </Stack>

            {/* Desktop: single row */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <TextField
                inputRef={searchInputRef}
                fullWidth
                size="small"
                label="Query"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchOffset(0);
                  setSearchQuery(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  minWidth: 180,
                  maxWidth: 280,
                  flex: "1 1 auto",
                }}
              >
                <TagsFilterPicker
                  allTags={allTags}
                  value={searchFilterTagRefIds}
                  onChange={(next) => {
                    setSearchOffset(0);
                    setSearchFilterTagRefIds(next);
                  }}
                  inputsEnabled={inputsEnabled}
                  label="Tags"
                  size="small"
                />
              </Box>
              <Box
                sx={{
                  minWidth: 180,
                  maxWidth: 280,
                  flex: "1 1 auto",
                }}
              >
                <ContactsFilterPicker
                  allContacts={allContacts}
                  value={searchFilterContactRefIds}
                  onChange={(next) => {
                    setSearchOffset(0);
                    setSearchFilterContactRefIds(next);
                  }}
                  inputsEnabled={inputsEnabled}
                  label="Contacts"
                  size="small"
                />
              </Box>
              <IconButton
                id="instant-search-filters"
                aria-label="Search filters"
                color={filtersOpen ? "primary" : "default"}
                onClick={() => setFiltersOpen((s) => !s)}
              >
                <TuneIcon />
              </IconButton>
              <IconButton
                id="instant-search-close"
                aria-label="Close search"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <GlobalError actionResult={instantAction} />

          <Collapse in={filtersOpen}>
            <Box sx={{ py: 1, maxHeight: "40vh", overflow: "auto" }}>
              <SearchToolFilterFields
                topLevelInfo={topLevelInfo}
                isBigScreen={isBigScreen}
                inputsEnabled={inputsEnabled}
                actionResult={instantAction}
                searchLimit={searchLimit}
                setSearchLimit={(v) => {
                  setSearchOffset(0);
                  setSearchLimit(v);
                }}
                searchIncludeArchived={searchIncludeArchived}
                setSearchIncludeArchived={(v) => {
                  setSearchOffset(0);
                  setSearchIncludeArchived(v);
                }}
                searchFilterEntityTags={searchFilterEntityTags}
                setSearchFilterEntityTags={(v) => {
                  setSearchOffset(0);
                  setSearchFilterEntityTags(v);
                }}
                searchFilterCreatedTimeAfter={searchFilterCreatedTimeAfter}
                setSearchFilterCreatedTimeAfter={(v) => {
                  setSearchOffset(0);
                  setSearchFilterCreatedTimeAfter(v);
                }}
                searchFilterCreatedTimeBefore={searchFilterCreatedTimeBefore}
                setSearchFilterCreatedTimeBefore={(v) => {
                  setSearchOffset(0);
                  setSearchFilterCreatedTimeBefore(v);
                }}
                searchFilterLastModifiedTimeAfter={
                  searchFilterLastModifiedTimeAfter
                }
                setSearchFilterLastModifiedTimeAfter={(v) => {
                  setSearchOffset(0);
                  setSearchFilterLastModifiedTimeAfter(v);
                }}
                searchFilterLastModifiedTimeBefore={
                  searchFilterLastModifiedTimeBefore
                }
                setSearchFilterLastModifiedTimeBefore={(v) => {
                  setSearchOffset(0);
                  setSearchFilterLastModifiedTimeBefore(v);
                }}
                searchFilterArchivedTimeAfter={searchFilterArchivedTimeAfter}
                setSearchFilterArchivedTimeAfter={(v) => {
                  setSearchOffset(0);
                  setSearchFilterArchivedTimeAfter(v);
                }}
                searchFilterArchivedTimeBefore={searchFilterArchivedTimeBefore}
                setSearchFilterArchivedTimeBefore={(v) => {
                  setSearchOffset(0);
                  setSearchFilterArchivedTimeBefore(v);
                }}
              />
            </Box>
          </Collapse>

          <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pt: 1 }}>
            {instantAction !== undefined &&
              isNoErrorSomeData(instantAction) &&
              instantAction.data.result && (
                <SearchToolResults
                  topLevelInfo={topLevelInfo}
                  result={instantAction.data.result}
                  pageSize={limitAsked}
                  resultOffset={searchOffset}
                  onResultOffsetChange={setSearchOffset}
                  onNavigateFromResult={handleClose}
                />
              )}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

function buildSearchInstantUrl(state: {
  searchQuery: string;
  searchLimit: string | undefined;
  searchOffset: number;
  searchIncludeArchived: boolean;
  searchFilterEntityTags: NamedEntityTag[];
  searchFilterTagRefIds: EntityId[];
  searchFilterContactRefIds: EntityId[];
  searchFilterCreatedTimeAfter: string | undefined;
  searchFilterCreatedTimeBefore: string | undefined;
  searchFilterLastModifiedTimeAfter: string | undefined;
  searchFilterLastModifiedTimeBefore: string | undefined;
  searchFilterArchivedTimeAfter: string | undefined;
  searchFilterArchivedTimeBefore: string | undefined;
}): string {
  const params = new URLSearchParams();
  const q = state.searchQuery.trim();
  if (q !== "") {
    params.set("query", q);
  }
  if (state.searchLimit !== undefined && state.searchLimit !== "") {
    params.set("limit", state.searchLimit);
  }
  if (state.searchOffset > 0) {
    params.set("offset", String(state.searchOffset));
  }
  if (state.searchIncludeArchived) {
    params.set("includeArchived", "on");
  }
  if (state.searchFilterEntityTags.length > 0) {
    params.set("filterEntityTags", state.searchFilterEntityTags.join(","));
  }
  if (state.searchFilterTagRefIds.length > 0) {
    params.set("filterTagRefIds", state.searchFilterTagRefIds.join(","));
  }
  if (state.searchFilterContactRefIds.length > 0) {
    params.set(
      "filterContactRefIds",
      state.searchFilterContactRefIds.join(","),
    );
  }
  if (state.searchFilterCreatedTimeAfter) {
    params.set("filterCreatedTimeAfter", state.searchFilterCreatedTimeAfter);
  }
  if (state.searchFilterCreatedTimeBefore) {
    params.set("filterCreatedTimeBefore", state.searchFilterCreatedTimeBefore);
  }
  if (state.searchFilterLastModifiedTimeAfter) {
    params.set(
      "filterLastModifiedTimeAfter",
      state.searchFilterLastModifiedTimeAfter,
    );
  }
  if (state.searchFilterLastModifiedTimeBefore) {
    params.set(
      "filterLastModifiedTimeBefore",
      state.searchFilterLastModifiedTimeBefore,
    );
  }
  if (state.searchFilterArchivedTimeAfter) {
    params.set("filterArchivedTimeAfter", state.searchFilterArchivedTimeAfter);
  }
  if (state.searchFilterArchivedTimeBefore) {
    params.set(
      "filterArchivedTimeBefore",
      state.searchFilterArchivedTimeBefore,
    );
  }
  const qs = params.toString();
  return qs.length > 0
    ? `${WORKSPACE_SEARCH_INSTANT_ROUTE}?${qs}`
    : WORKSPACE_SEARCH_INSTANT_ROUTE;
}
