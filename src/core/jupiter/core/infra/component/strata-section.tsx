import { Box, Stack } from "@mui/material";
import { Form } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import type { JSX, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

import { StrataBarContext } from "#/core/infra/component/layout/strata-bar-context";
import {
  strataHeaderLeadKey,
  useStrataHeaderSlot,
} from "#/core/infra/component/layout/strata-header-slot";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";
import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import { strataMakeCommand } from "#/core/infra/component/layout/strata-make-command";
import { useStrataCommands } from "#/core/infra/component/layout/use-strata-commands";
import { useInterceptedSubmit } from "#/core/infra/component/intent-interceptor";
import { SectionHeader } from "#/core/infra/component/section-header";
import { ActionsPosition } from "#/core/infra/component/section-card";
import { StrataSectionPlaceholder } from "#/core/infra/component/strata-section-placeholder";
import {
  strataColors,
  strataSize,
  strataType,
} from "#/core/infra/component/strata-tokens";
import { StrataSectionFormContext } from "#/core/infra/component/strata-section-form-context";
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
  /** The id of the form, which controls drawn apart from it name. */
  id: string;
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
      id={props.id}
      method={props.method}
      onSubmit={props.onSubmit}
      data-strata-section-form
    >
      {props.children}
    </Form>
  );
}

// The gap above the body of a section whose header is the column's. The panel
// already pads its content under the header, so the body asks for little more,
// where it is a whole row (of 14px) under a section's own header.
const BODY_UNDER_COLUMN_HEADER = 0.25;

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

  // The header of the column the section is in is its header, when it is the
  // first of the stack (the fixed one) or the one in a column of its own: its
  // controls are drawn there, among the column's own, and it has no row.
  const formId = `${props.id}-form`;
  const slot = useStrataHeaderSlot(
    inColumn
      ? strataSplitKey(props.id)
      : props.fixed === true && stack !== null
        ? stack.parentKey
        : null,
  );
  const lends =
    (inColumn || (props.fixed === true && stack?.lendsToHeader === true)) &&
    actionsPosition === ActionsPosition.ABOVE;
  const hasSummary = props.summary !== undefined && props.summary !== "";
  const lent =
    lends && slot !== null && (props.actions !== undefined || hasSummary)
      ? createPortal(
          <StrataBarContext.Provider value={slot.bar}>
            <StrataSectionFormContext.Provider
              value={props.bare === true ? null : formId}
            >
              {hasSummary && (
                <Box
                  component="span"
                  data-strata-section-summary
                  sx={(theme) => ({
                    flex: "none",
                    fontFamily: theme.typography.caption.fontFamily,
                    fontSize: strataType.meta.size,
                    color: theme.palette.text.secondary,
                    whiteSpace: "nowrap",
                  })}
                >
                  {props.summary}
                </Box>
              )}
              {props.actions}
            </StrataSectionFormContext.Provider>
          </StrataBarContext.Provider>,
          slot.element,
        )
      : null;

  const startsCollapsed = props.startsCollapsed === true;
  // The first section of a stack has no row of its own, so it is collapsed with
  // a `▾` in the header of the column, ahead of its name.
  const lentFixed = lends && !inColumn;
  const collapsible = stack !== null && (props.fixed !== true || lentFixed);
  const collapsed = collapsible && stack.isCollapsed(props.id, startsCollapsed);
  const leadSlot = useStrataHeaderSlot(
    lentFixed && stack?.parentKey != null
      ? strataHeaderLeadKey(stack.parentKey)
      : null,
  );
  const leadToggle =
    lentFixed && leadSlot !== null
      ? createPortal(
          <Box
            component="button"
            type="button"
            data-strata-section-toggle
            onClick={() => stack?.toggle(props.id, startsCollapsed)}
            aria-expanded={!collapsed}
            aria-controls={`${props.id}-body`}
            aria-label={`${collapsed ? "Expand" : "Collapse"} ${props.title}`}
            title={`${collapsed ? "Expand" : "Collapse"} ${props.title}`}
            sx={(theme) => ({
              flex: "none",
              // Close to the name that follows it, as the `▾` of a section's
              // header is close to its title.
              marginRight: -0.75,
              width: 14,
              height: strataSize.controlSmall,
              p: 0,
              border: 0,
              background: "none",
              cursor: "pointer",
              fontFamily: theme.typography.caption.fontFamily,
              fontSize: strataType.label.size,
              color: theme.palette.text.secondary,
              "&:hover": { color: strataColors.amber },
              "&:focus-visible": {
                outline: `1px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            })}
          >
            {collapsed ? "▸" : "▾"}
          </Box>,
          leadSlot.element,
        )
      : null;
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
    // Its header is the column's, so the column is what is selected, not it.
    "data-strata-section-lent": lentFixed ? "true" : undefined,
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
              id={formId}
              bare={props.bare}
              method={props.method ?? "post"}
              onSubmit={handleSubmit}
            >
              <SectionHeader
                bodyId={bodyId}
                title={props.title}
                hideTitle
                summary={lends ? undefined : props.summary}
                actions={
                  actionsPosition === ActionsPosition.ABOVE && !lends
                    ? props.actions
                    : undefined
                }
              />
              <Box
                id={bodyId}
                sx={{ px: 1, pt: lends ? BODY_UNDER_COLUMN_HEADER : 1.75 }}
              >
                <Stack spacing={1.25}>{body}</Stack>
                {bodyActionsBelow}
              </Box>
            </SectionForm>
          </Box>,
          host,
        )}
        {lent}
      </Box>
    );
  }

  return (
    <Box
      id={props.id}
      ref={rootRef}
      {...sectionAttributes}
      {...layoutAttribute}
      tabIndex={stack && !lentFixed ? -1 : undefined}
      sx={{
        // As wide as the column, edge to edge, like the column's own header:
        // the panel pads its content, which this takes back.
        // Said three times over, as the `Stack` the sections are in sets their
        // margins to nothing, and would win otherwise.
        "&&&": { marginLeft: "-0.5rem", marginRight: "-0.5rem" },
        position: "relative",
        borderBottom: 1,
        borderColor: "divider",
        pb: collapsed ? 0 : 1,
        // The line on top, as a column has one: strong and quiet, amber while
        // the section is the one `j` and `k` put the keyboard focus on. The
        // first section sits right under the column's own line, so it has
        // none until it is the one marked.
        "&::before": {
          content: '""',
          position: "absolute",
          // Over the line under the section above, so the two are one 1px
          // line, half the thickness of a column's, and not a 2px one. A
          // string, as a bare 1 would be all of the height.
          top: -1,
          left: 0,
          right: 0,
          height: "1px",
          backgroundColor: strataColors.lineStrong,
          pointerEvents: "none",
        },
        "&:first-child:not(:focus)::before": { display: "none" },
        "&:focus": { outline: "none" },
        "&:focus::before": { backgroundColor: strataColors.amber },
      }}
    >
      <SectionForm
        id={formId}
        bare={props.bare}
        method={props.method ?? "post"}
        onSubmit={handleSubmit}
      >
        <SectionHeader
          bodyId={bodyId}
          title={props.title}
          hideTitle={lends}
          summary={lends ? undefined : props.summary}
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
            actionsPosition === ActionsPosition.ABOVE && !lends
              ? props.actions
              : undefined
          }
        />
        <Box
          id={bodyId}
          hidden={collapsed}
          sx={{ px: "1rem", pt: lends ? BODY_UNDER_COLUMN_HEADER : 1.75 }}
        >
          <Stack spacing={1.25}>{body}</Stack>
          {bodyActionsBelow}
        </Box>
      </SectionForm>
      {lent}
      {leadToggle}
    </Box>
  );
}
