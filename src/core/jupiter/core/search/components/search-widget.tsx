import type { NamedEntityTag, SearchResult } from "@jupiter/webapi-client";
import { Close as CloseIcon } from "@mui/icons-material";
import { Search as SearchIcon } from "@mui/icons-material";
import { Settings as SettingsIcon } from "@mui/icons-material";
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
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { SearchToolFilterFields } from "#/core/search/components/search-tool-filter-fields";
import { SearchToolResults } from "#/core/search/components/search-tool-results";

const WORKSPACE_SEARCH_DEFAULT_LIMIT = 30;

type WorkspaceSearchInstantPayload = {
  query: string | undefined;
  limit: string | undefined;
  includeArchived: boolean;
  filterEntityTags: NamedEntityTag[] | undefined;
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

function buildSearchInstantUrl(state: {
  searchQuery: string;
  searchLimit: string | undefined;
  searchIncludeArchived: boolean;
  searchFilterEntityTags: NamedEntityTag[];
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
  if (state.searchIncludeArchived) {
    params.set("includeArchived", "on");
  }
  if (state.searchFilterEntityTags.length > 0) {
    params.set("filterEntityTags", state.searchFilterEntityTags.join(","));
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

export function SearchWidget() {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const searchFetcher = useFetcher<WorkspaceSearchInstantResponse>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLimit, setSearchLimit] = useState<string | undefined>(undefined);
  const [searchIncludeArchived, setSearchIncludeArchived] = useState(false);
  const [searchFilterEntityTags, setSearchFilterEntityTags] = useState<
    NamedEntityTag[]
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
          searchIncludeArchived,
          searchFilterEntityTags,
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
    searchIncludeArchived,
    searchFilterEntityTags,
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
    setSettingsOpen(false);
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
        maxWidth={false}
        PaperProps={{
          elevation: 8,
          sx: {
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            m: { xs: "0.5rem", sm: "2rem" },
            width: {
              xs: "calc(100vw - 1rem)",
              sm: "min(56rem, calc(100vw - 4rem))",
            },
            height: {
              xs: "calc(100 * var(--vh, 1vh) - 1rem)",
              sm: "min(80vh, calc(100 * var(--vh, 1vh) - 4rem))",
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

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <TextField
              inputRef={searchInputRef}
              fullWidth
              size="small"
              label="Query"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton
              id="instant-search-settings"
              aria-label="Search filters"
              color={settingsOpen ? "primary" : "default"}
              onClick={() => setSettingsOpen((s) => !s)}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              id="instant-search-close"
              aria-label="Close search"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <GlobalError actionResult={instantAction} />

          <Collapse in={settingsOpen}>
            <Box sx={{ py: 1, maxHeight: "40vh", overflow: "auto" }}>
              <SearchToolFilterFields
                topLevelInfo={topLevelInfo}
                isBigScreen={isBigScreen}
                inputsEnabled={inputsEnabled}
                actionResult={instantAction}
                searchLimit={searchLimit}
                setSearchLimit={setSearchLimit}
                searchIncludeArchived={searchIncludeArchived}
                setSearchIncludeArchived={setSearchIncludeArchived}
                searchFilterEntityTags={searchFilterEntityTags}
                setSearchFilterEntityTags={setSearchFilterEntityTags}
                searchFilterCreatedTimeAfter={searchFilterCreatedTimeAfter}
                setSearchFilterCreatedTimeAfter={
                  setSearchFilterCreatedTimeAfter
                }
                searchFilterCreatedTimeBefore={searchFilterCreatedTimeBefore}
                setSearchFilterCreatedTimeBefore={
                  setSearchFilterCreatedTimeBefore
                }
                searchFilterLastModifiedTimeAfter={
                  searchFilterLastModifiedTimeAfter
                }
                setSearchFilterLastModifiedTimeAfter={
                  setSearchFilterLastModifiedTimeAfter
                }
                searchFilterLastModifiedTimeBefore={
                  searchFilterLastModifiedTimeBefore
                }
                setSearchFilterLastModifiedTimeBefore={
                  setSearchFilterLastModifiedTimeBefore
                }
                searchFilterArchivedTimeAfter={searchFilterArchivedTimeAfter}
                setSearchFilterArchivedTimeAfter={
                  setSearchFilterArchivedTimeAfter
                }
                searchFilterArchivedTimeBefore={searchFilterArchivedTimeBefore}
                setSearchFilterArchivedTimeBefore={
                  setSearchFilterArchivedTimeBefore
                }
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
                  limitAsked={limitAsked}
                  onNavigateFromResult={handleClose}
                />
              )}
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
