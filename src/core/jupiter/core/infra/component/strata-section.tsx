import { Box, Stack } from "@mui/material";
import { Form } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import type { JSX, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { useInterceptedSubmit } from "#/core/infra/component/intent-interceptor";
import { SectionHeader } from "#/core/infra/component/section-header";
import { ActionsPosition } from "#/core/infra/component/section-card";
import { StrataSectionPlaceholder } from "#/core/infra/component/strata-section-placeholder";
import { strataColors } from "#/core/infra/component/strata-tokens";
import { useStrataSections } from "#/core/infra/component/strata-sections-context";
import { strataSplitKey } from "#/core/infra/strata/strata-columns-with-splits";

interface StrataSectionSplit {
  /** Units the section's column takes. */
  size: 1 | 2 | 3;
  /** May take spare units. */
  grow?: boolean;
  /** The size its parent has while this section is split out of it. */
  parentSize?: 1 | 2 | 3;
}

interface StrataSectionProps {
  /** Unique in its stack. It is the section's DOM id and what the URL keeps. */
  id: string;
  title: string;
  /** A short summary or count, kept visible while the section is collapsed. */
  summary?: string;
  actions?: JSX.Element;
  actionsPosition?: ActionsPosition;
  method?: "get" | "post";
  /**
   * The section a stack opens with, which is always there: it can't be
   * collapsed, and it can't be pulled out into a column of its own.
   */
  fixed?: boolean;
  /**
   * How much the section holds: how many items of a list, or 1 for a single
   * thing worth a column of its own, such as a note. Only a section with
   * something in it can be split out into a column; left out, or 0, it can't,
   * as for a calendar or a summary, which gain nothing from one.
   */
  items?: number;
  /** The size of its column, when it isn't the default (M). */
  split?: StrataSectionSplit;
}

// A section's column is M unless it says otherwise.
const DEFAULT_SPLIT_SIZE = 2;

/**
 * One section of a stack: a header with the title, a summary and the section's
 * actions, over a body. In a `StrataSectionStack` the header collapses the body
 * to just the header and its summary, and a section that offers a `split` can
 * be pulled out into a column of its own: its body is then drawn into that
 * column, from here, so its data, forms and fetchers stay as they are, and a
 * placeholder row stays in its place. When there is no room for the column the
 * section comes back, collapsed, with a tag saying so. The body stays mounted
 * while collapsed, so a form in it keeps what was typed and still submits.
 */
export function StrataSection(props: PropsWithChildren<StrataSectionProps>) {
  const actionsPosition = props.actionsPosition ?? ActionsPosition.ABOVE;
  const handleSubmit = useInterceptedSubmit();
  const stack = useStrataSections();
  const columns = useContext(StrataColumnsContext);

  const parentKey = stack?.parentKey ?? null;
  const splittable =
    stack !== null &&
    props.fixed !== true &&
    props.items !== undefined &&
    props.items > 0 &&
    parentKey !== null &&
    columns !== null &&
    !columns.phone;
  const registerSplit = columns?.registerSplit;
  const splitState = splittable
    ? (columns.splits.find((split) => split.id === props.id)?.state ?? "none")
    : "none";
  const host = splittable ? columns.splitHost(props.id) : null;
  const inColumn = splitState === "active" && host !== null;
  const folded = splitState === "folded";

  // Offer the section as a column while it is on screen. The control of the
  // column calls the latest `setSplit`, not the one of the render it left.
  const setSplitRef = useRef(stack?.setSplit);
  setSplitRef.current = stack?.setSplit;
  const size = props.split?.size ?? DEFAULT_SPLIT_SIZE;
  const grow = props.split?.grow;
  const parentSize = props.split?.parentSize;
  useEffect(() => {
    if (!splittable || registerSplit === undefined) {
      return;
    }
    return registerSplit(
      {
        id: props.id,
        parentKey,
        title: props.title,
        size,
        grow,
        parentSize,
      },
      () => setSplitRef.current?.(props.id, false),
    );
  }, [
    splittable,
    registerSplit,
    props.id,
    parentKey,
    props.title,
    size,
    grow,
    parentSize,
  ]);

  // A section folded back comes back collapsed; the user may open it.
  const [openWhileFolded, setOpenWhileFolded] = useState(false);
  useEffect(() => setOpenWhileFolded(false), [folded]);

  const collapsible = stack !== null && props.fixed !== true;
  const collapsed =
    collapsible &&
    (folded ? !openWhileFolded : stack.collapsed.includes(props.id));
  const bodyId = `${props.id}-body`;

  function handleToggle() {
    if (folded) {
      setOpenWhileFolded((open) => !open);
    } else {
      stack?.toggle(props.id);
    }
  }

  const sectionAttributes = {
    "data-strata-section": props.id,
    "data-strata-section-panel": stack?.panelId,
    "data-strata-section-fixed": props.fixed === true ? "true" : undefined,
    "data-strata-splittable": splittable ? "true" : undefined,
  };

  const bodyActionsBelow = actionsPosition === ActionsPosition.BELOW && (
    <Box sx={{ pt: 1 }}>{props.actions}</Box>
  );

  if (inColumn) {
    return (
      <Box
        id={props.id}
        {...sectionAttributes}
        data-strata-section-split="active"
        sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}
      >
        <StrataSectionPlaceholder
          title={props.title}
          onClick={() => columns?.focusColumn(strataSplitKey(props.id))}
        />
        {createPortal(
          <Box
            {...sectionAttributes}
            data-strata-section-split="column"
            sx={{ pb: 1 }}
          >
            <Form method={props.method ?? "post"} onSubmit={handleSubmit}>
              <SectionHeader
                bodyId={bodyId}
                title={props.title}
                hideTitle
                summary={props.summary}
                actions={
                  actionsPosition === ActionsPosition.ABOVE
                    ? props.actions
                    : undefined
                }
              />
              <Box id={bodyId} sx={{ px: 1 }}>
                <Stack spacing={2}>{props.children}</Stack>
                {bodyActionsBelow}
              </Box>
            </Form>
          </Box>,
          host,
        )}
      </Box>
    );
  }

  return (
    <Box
      id={props.id}
      {...sectionAttributes}
      tabIndex={stack ? -1 : undefined}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        pb: 1,
        // `j` and `k` put the keyboard focus on the section itself.
        "&:focus": { outline: "none" },
        // The mark is on the heading only, not the whole body.
        "&:focus > form > [data-strata-section-header]": {
          boxShadow: `inset 1px 0 0 ${strataColors.amber}`,
        },
      }}
    >
      <Form method={props.method ?? "post"} onSubmit={handleSubmit}>
        <SectionHeader
          bodyId={bodyId}
          title={props.title}
          summary={props.summary}
          collapsed={collapsible ? collapsed : undefined}
          onToggle={collapsible ? handleToggle : undefined}
          tag={folded ? "folded back · no room" : undefined}
          splitAction={
            splittable
              ? folded
                ? {
                    kind: "fold",
                    label: `Stop splitting ${props.title}`,
                    onClick: () => stack?.setSplit(props.id, false),
                  }
                : {
                    kind: "split",
                    label: `Split ${props.title} into its own column`,
                    onClick: () => stack?.setSplit(props.id, true),
                  }
              : undefined
          }
          actions={
            actionsPosition === ActionsPosition.ABOVE
              ? props.actions
              : undefined
          }
        />
        <Box id={bodyId} hidden={collapsed} sx={{ px: 1 }}>
          <Stack spacing={2}>{props.children}</Stack>
          {bodyActionsBelow}
        </Box>
      </Form>
    </Box>
  );
}
