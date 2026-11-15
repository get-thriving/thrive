import { Box, Stack } from "@mui/material";
import { Form } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import type { JSX, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";
import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import { strataMakeCommand } from "#/core/infra/component/layout/strata-make-command";
import { useStrataCommands } from "#/core/infra/component/layout/use-strata-commands";
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
  /**
   * The section is collapsed until it is opened, instead of open until it is
   * collapsed, as History and Sharing are (ADR 0021).
   */
  startsCollapsed?: boolean;
  /**
   * Draw the body only once the section has been opened or split out, and keep
   * it after, so what it loads is loaded when it is wanted and not on the page.
   */
  lazy?: boolean;
  /**
   * The body has forms of its own, so the section does not wrap it in one: a
   * form cannot be inside a form.
   */
  bare?: boolean;
}

interface SectionFormProps {
  bare?: boolean;
  method: "get" | "post";
  onSubmit: ReturnType<typeof useInterceptedSubmit>;
}

// The form a section's header and body are in, unless the body brings its own.
function SectionForm(props: PropsWithChildren<SectionFormProps>) {
  if (props.bare === true) {
    return <div data-strata-section-form>{props.children}</div>;
  }
  return (
    <Form
      method={props.method}
      onSubmit={props.onSubmit}
      data-strata-section-form
    >
      {props.children}
    </Form>
  );
}

// A section's column is M unless it says otherwise.
const DEFAULT_SPLIT_SIZE = 2;

/**
 * One section of a stack: a header with the title, a summary and the section's
 * actions, over a body. In a `StrataSectionStack` the header collapses the body
 * to just the header and its summary, and a section that offers a `split` can
 * be pulled out into a column of its own: its body is then drawn into that
 * column, from here, so its data, forms and fetchers stay as they are, and a
 * placeholder row stays in its place. The column is never given up for lack of
 * room: it narrows to a peek or a spine, as any column does. The body stays
 * mounted while collapsed, so a form in it keeps what was typed and still
 * submits.
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
  const isSplit =
    splittable && columns.splits.some((split) => split.id === props.id);
  const host = splittable ? columns.splitHost(props.id) : null;
  const inColumn = isSplit && host !== null;

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

  const startsCollapsed = props.startsCollapsed === true;
  const collapsible = stack !== null && props.fixed !== true;
  const collapsed = collapsible && stack.isCollapsed(props.id, startsCollapsed);
  const bodyId = `${props.id}-body`;

  // How the section is laid out is offered to the menu of commands as the last
  // of its commands (ADR 0021): the same things `z`, `c` and `⇧c` do, and the
  // `▾` and `⇥` of its header. It is where the section is on screen: in its
  // stack, or in the column it was split out into.
  const rootRef = useRef<HTMLDivElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const layoutCommands = (): StrataCommand[] => {
    const commands: StrataCommand[] = [];
    if (inColumn) {
      commands.push(
        strataMakeCommand({
          id: "layout-fold-back",
          label: "Fold back",
          kind: StrataCommandKind.LAYOUT,
          run: () => setSplitRef.current?.(props.id, false),
        }),
      );
      return commands;
    }
    if (collapsible) {
      commands.push(
        strataMakeCommand({
          id: "layout-collapse",
          label: collapsed ? "Expand" : "Collapse",
          kind: StrataCommandKind.LAYOUT,
          run: () => stack?.toggle(props.id, startsCollapsed),
        }),
      );
    }
    if (splittable) {
      commands.push(
        strataMakeCommand({
          id: "layout-split",
          label: "Split out",
          kind: StrataCommandKind.LAYOUT,
          run: () => stack?.setSplit(props.id, true),
        }),
      );
    }
    return commands;
  };
  useStrataCommands(
    () => (inColumn ? columnRef.current : rootRef.current),
    layoutCommands,
  );
  const hasLayout = inColumn || collapsible || splittable;

  // A lazy body is drawn from the first time it is wanted, and kept.
  const wanted = !collapsed || inColumn;
  const [wasWanted, setWasWanted] = useState(false);
  useEffect(() => {
    if (wanted) {
      setWasWanted(true);
    }
  }, [wanted]);
  const body =
    props.lazy === true && !wanted && !wasWanted ? null : props.children;

  const layoutAttribute = hasLayout ? { "data-strata-layout": "true" } : {};
  const sectionAttributes = {
    "data-strata-section": props.id,
    "data-strata-section-title": props.title,
    "data-strata-section-panel": stack?.panelId,
    "data-strata-section-fixed": props.fixed === true ? "true" : undefined,
    "data-strata-splittable": splittable ? "true" : undefined,
    "data-strata-section-starts-collapsed": startsCollapsed
      ? "true"
      : undefined,
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
            ref={columnRef}
            {...sectionAttributes}
            {...layoutAttribute}
            data-strata-section-split="column"
            sx={{ pb: 1 }}
          >
            <SectionForm
              bare={props.bare}
              method={props.method ?? "post"}
              onSubmit={handleSubmit}
            >
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
              <Box id={bodyId} sx={{ px: 1, pt: 1.75 }}>
                <Stack spacing={1.25}>{body}</Stack>
                {bodyActionsBelow}
              </Box>
            </SectionForm>
          </Box>,
          host,
        )}
      </Box>
    );
  }

  return (
    <Box
      id={props.id}
      ref={rootRef}
      {...sectionAttributes}
      {...layoutAttribute}
      tabIndex={stack ? -1 : undefined}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        pb: 1,
        // `j` and `k` put the keyboard focus on the section itself.
        "&:focus": { outline: "none" },
        // The mark is on the heading only, not the whole body.
        "&:focus > [data-strata-section-form] > [data-strata-section-header]": {
          boxShadow: `inset 1px 0 0 ${strataColors.amber}`,
        },
      }}
    >
      <SectionForm
        bare={props.bare}
        method={props.method ?? "post"}
        onSubmit={handleSubmit}
      >
        <SectionHeader
          bodyId={bodyId}
          title={props.title}
          summary={props.summary}
          collapsed={collapsible ? collapsed : undefined}
          onToggle={
            collapsible
              ? () => stack?.toggle(props.id, startsCollapsed)
              : undefined
          }
          splitAction={
            splittable
              ? {
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
        <Box id={bodyId} hidden={collapsed} sx={{ px: 1, pt: 1.75 }}>
          <Stack spacing={1.25}>{body}</Stack>
          {bodyActionsBelow}
        </Box>
      </SectionForm>
    </Box>
  );
}
