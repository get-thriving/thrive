import {
  ApiError,
  DocsHelpSubject,
  type DirLoadResultEntry,
  type DirLoadSubdirEntry,
  type Tag,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import {
  CreateNewFolder as CreateNewFolderIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { AnimatePresence } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useMemo, useState } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { isDirRoot } from "@jupiter/core/docs/sub/dir/root";
import { EntityNameOneLineComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS,
  noteContentPreviewPlainText,
} from "@jupiter/core/common/sub/notes/note-content-plain-text";
import { TagTag } from "@jupiter/core/common/sub/tags/component/tag-tag";
import { TimeDiffTag } from "@jupiter/core/common/component/time-diff-tag";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  dirId: z.string(),
});

enum DocsSortOrder {
  CREATED_ASC = "created_asc",
  CREATED_DESC = "created_desc",
  MODIFIED_ASC = "modified_asc",
  MODIFIED_DESC = "modified_desc",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
}

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { dirId } = parseParams(params, ParamsSchema);

  try {
    const [dirLoad, allTags] = await Promise.all([
      apiClient.docs.dirLoad({
        ref_id: dirId,
        allow_archived: false,
        filter_ref_ids: null,
      }),
      apiClient.tags.tagFind({
        allow_archived: false,
      }),
    ]);

    return json({
      dirLoad,
      allTags: allTags.tags,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function DocsInFolder() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const compactDocCardLayout = !isBigScreen;

  const { dirLoad } = loaderData;
  const dirId = dirLoad.dir.ref_id;

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<DocsSortOrder>(
    DocsSortOrder.MODIFIED_DESC,
  );

  const filteredSubdirs =
    selectedTagsRefId.length === 0
      ? dirLoad.subdirs
      : dirLoad.subdirs.filter((entry) =>
          entry.tags.some((tag: Tag) => selectedTagsRefId.includes(tag.ref_id)),
        );

  const filteredEntries =
    selectedTagsRefId.length === 0
      ? dirLoad.entries
      : dirLoad.entries.filter((entry) =>
          entry.tags.some((tag: Tag) => selectedTagsRefId.includes(tag.ref_id)),
        );

  const sortedFilteredSubdirs = useMemo(
    () => sortSubdirEntries(filteredSubdirs, sortOrder),
    [filteredSubdirs, sortOrder],
  );

  const sortedFilteredEntries = useMemo(
    () => sortDocEntries(filteredEntries, sortOrder),
    [filteredEntries, sortOrder],
  );

  const showParentLink = !isDirRoot(dirLoad.dir);
  const parentHref =
    dirLoad.dir.parent_dir_ref_id !== undefined &&
    dirLoad.dir.parent_dir_ref_id !== null
      ? `/app/workspace/docs/${dirLoad.dir.parent_dir_ref_id}`
      : "/app/workspace/docs";

  const listIsEmpty =
    sortedFilteredSubdirs.length === 0 && sortedFilteredEntries.length === 0;

  return (
    <TrunkPanel
      key={`docs-dir-${dirId}`}
      createLocation={`/app/workspace/docs/${dirId}/doc/new`}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="docs-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavSingle({
              id: "docs-new-folder",
              text: "New Folder",
              link: `/app/workspace/docs/${dirId}/new`,
              icon: <CreateNewFolderIcon />,
            }),
            ...(!isDirRoot(dirLoad.dir)
              ? [
                  NavSingle({
                    id: "docs-folder-settings",
                    text: "Settings",
                    link: `/app/workspace/docs/${dirId}/settings`,
                    icon: <SettingsIcon />,
                  }),
                ]
              : []),
            FilterFewOptionsCompact(
              "Sort",
              sortOrder,
              [
                {
                  value: DocsSortOrder.CREATED_ASC,
                  text: "Creation date (oldest first)",
                },
                {
                  value: DocsSortOrder.CREATED_DESC,
                  text: "Creation date (newest first)",
                },
                {
                  value: DocsSortOrder.MODIFIED_ASC,
                  text: "Last modified (oldest first)",
                },
                {
                  value: DocsSortOrder.MODIFIED_DESC,
                  text: "Last modified (newest first)",
                },
                {
                  value: DocsSortOrder.NAME_ASC,
                  text: "Name (A–Z)",
                },
                {
                  value: DocsSortOrder.NAME_DESC,
                  text: "Name (Z–A)",
                },
              ],
              setSortOrder,
            ),
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {listIsEmpty && !showParentLink && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no folders or docs to show here. Use the + button for a new doc or New Folder in the actions bar."
            newEntityLocations={`/app/workspace/docs/${dirId}/doc/new`}
            helpSubject={DocsHelpSubject.DOCS}
          />
        )}

        <EntityStack>
          {showParentLink && (
            <EntityCard key="docs-parent" entityId="docs-parent">
              <EntityLink to={parentHref} singleLine>
                <DocCardRoot>
                  <DocCardTitleRow>
                    <DocCardTitleSlot>
                      <Typography variant="body1" component="span">
                        ..
                      </Typography>
                    </DocCardTitleSlot>
                  </DocCardTitleRow>
                </DocCardRoot>
              </EntityLink>
            </EntityCard>
          )}
          {sortedFilteredSubdirs.map((entry) => {
            const rowTags = entry.tags;
            return (
              <EntityCard
                key={`dir-${entry.dir.ref_id}`}
                entityId={`dir-${entry.dir.ref_id}`}
              >
                <EntityLink
                  to={`/app/workspace/docs/${entry.dir.ref_id}`}
                  singleLine
                >
                  <DocCardRoot>
                    <DocCardTitleRow>
                      <DocCardTitleSlot>
                        <DocCardTitleTextWrap>
                          <DirTitleWithFolderGlyph>
                            <DirFolderGlyph aria-hidden>📁</DirFolderGlyph>
                            <EntityNameOneLineComponent name={entry.dir.name} />
                          </DirTitleWithFolderGlyph>
                        </DocCardTitleTextWrap>
                      </DocCardTitleSlot>
                      {!compactDocCardLayout &&
                        rowTags.map((tag: Tag) => (
                          <DocCardTitleAffix key={tag.ref_id}>
                            <TagTag tag={tag} />
                          </DocCardTitleAffix>
                        ))}
                      <DocCardTitleAffix>
                        <TimeDiffTag
                          today={topLevelInfo.today}
                          labelPrefix="Last modified"
                          collectionTime={entry.dir.last_modified_time}
                          compact={compactDocCardLayout}
                        />
                      </DocCardTitleAffix>
                    </DocCardTitleRow>
                    {compactDocCardLayout && rowTags.length > 0 && (
                      <DocCardTagsRow>
                        {rowTags.map((tag: Tag) => (
                          <TagTag key={tag.ref_id} tag={tag} />
                        ))}
                      </DocCardTagsRow>
                    )}
                  </DocCardRoot>
                </EntityLink>
              </EntityCard>
            );
          })}
          {sortedFilteredEntries.map((entry) => {
            const preview = noteContentPreviewPlainText(
              entry.note,
              DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS,
            );
            const rowTags = entry.tags;
            return (
              <EntityCard
                key={`doc-${entry.doc.ref_id}`}
                entityId={`doc-${entry.doc.ref_id}`}
              >
                <EntityLink
                  to={`/app/workspace/docs/${dirId}/doc/${entry.doc.ref_id}`}
                  singleLine
                >
                  <DocCardRoot>
                    <DocCardTitleRow>
                      <DocCardTitleSlot>
                        <DocCardTitleTextWrap>
                          <EntityNameOneLineComponent name={entry.doc.name} />
                        </DocCardTitleTextWrap>
                      </DocCardTitleSlot>
                      {!compactDocCardLayout &&
                        rowTags.map((tag: Tag) => (
                          <DocCardTitleAffix key={tag.ref_id}>
                            <TagTag tag={tag} />
                          </DocCardTitleAffix>
                        ))}
                      <DocCardTitleAffix>
                        <TimeDiffTag
                          today={topLevelInfo.today}
                          labelPrefix="Last modified"
                          collectionTime={entry.doc.last_modified_time}
                          compact={compactDocCardLayout}
                        />
                      </DocCardTitleAffix>
                    </DocCardTitleRow>
                    {compactDocCardLayout && rowTags.length > 0 && (
                      <DocCardTagsRow>
                        {rowTags.map((tag: Tag) => (
                          <TagTag key={tag.ref_id} tag={tag} />
                        ))}
                      </DocCardTagsRow>
                    )}
                    {preview && (
                      <DocCardPreview variant="body2">{preview}</DocCardPreview>
                    )}
                  </DocCardRoot>
                </EntityLink>
              </EntityCard>
            );
          })}
        </EntityStack>
      </NestingAwareBlock>
      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

const DocCardRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 0,
  maxWidth: "100%",
  width: "100%",
  gap: theme.spacing(0.75),
}));

const DocCardTitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: theme.spacing(0.5),
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  overflow: "hidden",
}));

const DocCardTitleSlot = styled(Box)({
  flex: "1 1 0%",
  flexBasis: 0,
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
});

const DocCardTitleTextWrap = styled(Box)({
  display: "block",
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  "& .MuiTypography-root": {
    width: "100%",
  },
});

const DirTitleWithFolderGlyph = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(0.5),
  minWidth: 0,
  maxWidth: "100%",
  overflow: "hidden",
  "& .MuiTypography-root": {
    width: "100%",
  },
}));

const DirFolderGlyph = styled(Box)({
  flexShrink: 0,
  lineHeight: 1,
});

const DocCardTitleAffix = styled(Box)({
  flexShrink: 0,
});

const DocCardTagsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: theme.spacing(0.5),
  width: "100%",
}));

const DocCardPreview = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  lineHeight: 1.35,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  width: "100%",
  color: theme.palette.text.secondary,
}));

function sortDocEntries(
  entries: DirLoadResultEntry[],
  order: DocsSortOrder,
): DirLoadResultEntry[] {
  const sorted = [...entries];
  const byCreatedAsc = (a: DirLoadResultEntry, b: DirLoadResultEntry) =>
    a.doc.created_time.localeCompare(b.doc.created_time);
  const byModifiedAsc = (a: DirLoadResultEntry, b: DirLoadResultEntry) =>
    a.doc.last_modified_time.localeCompare(b.doc.last_modified_time);
  const byNameAsc = (a: DirLoadResultEntry, b: DirLoadResultEntry) =>
    a.doc.name.localeCompare(b.doc.name);
  switch (order) {
    case DocsSortOrder.CREATED_ASC:
      sorted.sort(byCreatedAsc);
      break;
    case DocsSortOrder.CREATED_DESC:
      sorted.sort((a, b) => byCreatedAsc(b, a));
      break;
    case DocsSortOrder.MODIFIED_ASC:
      sorted.sort(byModifiedAsc);
      break;
    case DocsSortOrder.MODIFIED_DESC:
      sorted.sort((a, b) => byModifiedAsc(b, a));
      break;
    case DocsSortOrder.NAME_ASC:
      sorted.sort(byNameAsc);
      break;
    case DocsSortOrder.NAME_DESC:
      sorted.sort((a, b) => byNameAsc(b, a));
      break;
  }
  return sorted;
}

function sortSubdirEntries(
  entries: DirLoadSubdirEntry[],
  order: DocsSortOrder,
): DirLoadSubdirEntry[] {
  const sorted = [...entries];
  const byCreatedAsc = (a: DirLoadSubdirEntry, b: DirLoadSubdirEntry) =>
    a.dir.created_time.localeCompare(b.dir.created_time);
  const byModifiedAsc = (a: DirLoadSubdirEntry, b: DirLoadSubdirEntry) =>
    a.dir.last_modified_time.localeCompare(b.dir.last_modified_time);
  const byNameAsc = (a: DirLoadSubdirEntry, b: DirLoadSubdirEntry) =>
    a.dir.name.localeCompare(b.dir.name);
  switch (order) {
    case DocsSortOrder.CREATED_ASC:
      sorted.sort(byCreatedAsc);
      break;
    case DocsSortOrder.CREATED_DESC:
      sorted.sort((a, b) => byCreatedAsc(b, a));
      break;
    case DocsSortOrder.MODIFIED_ASC:
      sorted.sort(byModifiedAsc);
      break;
    case DocsSortOrder.MODIFIED_DESC:
      sorted.sort((a, b) => byModifiedAsc(b, a));
      break;
    case DocsSortOrder.NAME_ASC:
      sorted.sort(byNameAsc);
      break;
    case DocsSortOrder.NAME_DESC:
      sorted.sort((a, b) => byNameAsc(b, a));
      break;
  }
  return sorted;
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the docs! Please try again!`,
});
