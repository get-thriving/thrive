import {
  DocsHelpSubject,
  type DirLoadResult,
  type DirLoadResultEntry,
  type DirLoadSubdirEntry,
  type Tag,
} from "@jupiter/webapi-client";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useMemo, useState } from "react";

import { EntityNameOneLineComponent } from "#/core/common/component/entity-name";
import { TimeDiffTag } from "#/core/common/component/time-diff-tag";
import {
  DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS,
  noteContentPreviewPlainText,
} from "#/core/common/sub/notes/note-content-plain-text";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { isDirRoot } from "#/core/docs/sub/dir/root";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { SectionCard } from "#/core/infra/component/section-card";
import {
  FilterFewOptionsCompact,
  FilterManyOptions,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { useLeafNeedsToShowLeaflet } from "#/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "#/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

enum DocsSortOrder {
  CREATED_ASC = "created_asc",
  CREATED_DESC = "created_desc",
  MODIFIED_ASC = "modified_asc",
  MODIFIED_DESC = "modified_desc",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
}

interface PublishedDocDirPanelProps {
  externalId: string;
  publishedRootDirRefId: string;
  dirLoad: DirLoadResult;
  allTags: Tag[];
  returnLocation: string;
}

export function PublishedDocDirPanel(props: PublishedDocDirPanelProps) {
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const compactDocCardLayout = !isBigScreen;

  const { dirLoad, externalId, publishedRootDirRefId } = props;
  const dirId = dirLoad.dir.ref_id;
  const basePath = `/app/public/published/doc/dirtree/${externalId}`;

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

  const showParentLink =
    !isDirRoot(dirLoad.dir) && dirId !== publishedRootDirRefId;
  const parentHref =
    dirLoad.dir.parent_dir_ref_id === publishedRootDirRefId
      ? `${basePath}/${publishedRootDirRefId}`
      : `${basePath}/${dirLoad.dir.parent_dir_ref_id}`;

  const listIsEmpty =
    sortedFilteredSubdirs.length === 0 && sortedFilteredEntries.length === 0;

  return (
    <LeafPanel
      key={`published-docs-dir-${dirId}`}
      fakeKey={`published-docs-dir-${dirId}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation={props.returnLocation}
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
      shouldShowALeaflet={shouldShowALeaflet}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <SectionCard
          title={dirLoad.dir.name}
          actions={
            <SectionActions
              id="published-docs-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={false}
              actions={[
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
                  props.allTags.map((tag) => ({
                    value: tag.ref_id,
                    text: tag.name,
                  })),
                  setSelectedTagsRefId,
                ),
              ]}
            />
          }
        >
          {listIsEmpty && !showParentLink && (
            <EntityNoNothingCard
              title="Empty Folder"
              message="This published folder has no subfolders or docs to show."
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
            {sortedFilteredSubdirs.map((entry) => (
              <EntityCard
                key={`dir-${entry.dir.ref_id}`}
                entityId={`dir-${entry.dir.ref_id}`}
              >
                <EntityLink to={`${basePath}/${entry.dir.ref_id}`} singleLine>
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
                        entry.tags.map((tag: Tag) => (
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
                    {compactDocCardLayout && entry.tags.length > 0 && (
                      <DocCardTagsRow>
                        {entry.tags.map((tag: Tag) => (
                          <TagTag key={tag.ref_id} tag={tag} />
                        ))}
                      </DocCardTagsRow>
                    )}
                  </DocCardRoot>
                </EntityLink>
              </EntityCard>
            ))}
            {sortedFilteredEntries.map((entry) => (
              <EntityCard
                key={`doc-${entry.doc.ref_id}`}
                entityId={`doc-${entry.doc.ref_id}`}
              >
                <EntityLink
                  to={`${basePath}/${dirId}/${entry.doc.ref_id}`}
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
                        entry.tags.map((tag: Tag) => (
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
                    {compactDocCardLayout && entry.tags.length > 0 && (
                      <DocCardTagsRow>
                        {entry.tags.map((tag: Tag) => (
                          <TagTag key={tag.ref_id} tag={tag} />
                        ))}
                      </DocCardTagsRow>
                    )}
                    {noteContentPreviewPlainText(
                      entry.note,
                      DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS,
                    ) && (
                      <DocCardPreview variant="body2">
                        {noteContentPreviewPlainText(
                          entry.note,
                          DEFAULT_NOTE_CONTENT_PREVIEW_MAX_CHARS,
                        )}
                      </DocCardPreview>
                    )}
                  </DocCardRoot>
                </EntityLink>
              </EntityCard>
            ))}
          </EntityStack>
        </SectionCard>
      </NestingAwareBlock>
      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
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
