import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { KeyboardAction } from "@jupiter/webapi-client";
import { ButtonBase, IconButton, styled } from "@mui/material";
import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

import { BarControls } from "#/core/infra/component/layout/bar-controls";
import { StrataHeaderSlotOutlet } from "#/core/infra/component/layout/strata-header-slot-outlet";
import { ColumnClose } from "#/core/infra/component/layout/column-close";
import type { ColumnChip } from "#/core/infra/component/layout/column-chip";
import { ColumnMenu } from "#/core/infra/component/layout/column-menu";
import type { ColumnMenuEntry } from "#/core/infra/component/layout/column-menu-entry";
import { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";
import { strataMakeCommand } from "#/core/infra/component/layout/strata-make-command";
import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import { strataScrollColumn } from "#/core/infra/component/layout/strata-scroll-column";
import { useStrataCommands } from "#/core/infra/component/layout/use-strata-commands";
import type { StrataColumnPosition } from "#/core/infra/component/layout/use-strata-position";
import { useStrataColumnFocused } from "#/core/infra/component/layout/strata-column-focus-context";
import { strataSize, strataType } from "#/core/infra/component/strata-tokens";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import { strataKeyBindingLabel } from "#/core/infra/strata/strata-key-binding";

/** What closes a column, for the control at the right end of its header. */
interface ColumnHeaderClose {
  /** A route column goes to where it came from. */
  to?: string;
  /** A split column closes, or folds back, by this. */
  onClick?: () => void;
  label: string;
  title: string;
  /** `⇤`, for a section folding back into its column. */
  fold?: boolean;
}

interface ColumnHeaderProps {
  id: string;
  /** The subject, set in mono capitals: `Habit #344`, or a section's name. */
  title: string;
  /** A section split out of a column is `↳` and its name. */
  kind?: "route" | "split";
  /** How many items a list holds after its filters. */
  count?: number;
  /**
   * An item's place in its collection, `12/63`, with the buttons that replace
   * it with the one before and the one after. Left out where it has none.
   */
  position?: StrataColumnPosition | null;
  /** What is so about the subject, such as that it is published. */
  chips?: readonly ColumnChip[];
  /**
   * The buttons that open an entity's history and who it is shared with, until
   * the sections for them replace them.
   */
  views?: ReactNode;
  /**
   * What else the panel offers, such as a list's filters and grouping: drawn
   * small in the room between the chips and the actions, and folded into one
   * button when the column is too narrow for them.
   */
  controls?: ReactNode;
  /**
   * The key of the column, when its first section draws its own controls
   * into this header: the header of the column is that section's header, so
   * its Save and the like sit among the controls, with the menu and the close
   * control, and the section has no row of its own.
   */
  slot?: string;
  /** The commands of the column, behind `⋯`. */
  menu?: readonly ColumnMenuEntry[];
  /** Left out where the column cannot be closed. */
  close?: ColumnHeaderClose;
}

/**
 * The one header of a Strata column (ADR 0021), a single 36px row made of fixed
 * parts, each shown only when it has something to show:
 *
 * `[title] [count or position] [chips] ── [controls] [views] [⋯] [× or ⇤]`
 *
 * It is also the header of the first section of its column, when the column is
 * a stack of sections: that section's own controls are drawn among the
 * `controls`, and it has no header row of its own (the `slot`).
 *
 * Clicking the title scrolls the column to its top. The count, the position
 * and the menu are in every column, whichever one is focused, so the header
 * keeps its width as the focus moves, and a mouse user can reach them and close
 * a column. What else a panel offers goes in the controls, which are small and
 * fold away when there is no room for them.
 */
export function ColumnHeader(props: ColumnHeaderProps) {
  const focused = useStrataColumnFocused();
  const menu = props.menu ?? [];
  const chips = props.chips ?? [];
  const header = useRef<HTMLDivElement>(null);
  const keyBindings = useStrataKeyBindings();
  const keyLabel = (action: KeyboardAction) =>
    strataKeyBindingLabel(keyBindings[action]);

  // The entries of the menu are commands of the column (ADR 0021). Adding an
  // item is not one of them: each panel offers its own, among its controls.
  useStrataCommands(
    () => header.current,
    () => {
      const commands: StrataCommand[] = [];
      // The way along the collection is the arrows beside the count, which the
      // keys do as well; here they are listed first in the column's menu.
      const position = props.position;
      if (focused && position !== undefined && position !== null) {
        commands.push(
          strataMakeCommand({
            id: "position-previous",
            label: "Previous item",
            kind: StrataCommandKind.POSITION,
            disabled: !position.hasPrevious,
            run: () => position.go(-1),
          }),
          strataMakeCommand({
            id: "position-next",
            label: "Next item",
            kind: StrataCommandKind.POSITION,
            disabled: !position.hasNext,
            run: () => position.go(1),
          }),
        );
      }
      for (const entry of menu) {
        commands.push(
          strataMakeCommand({
            id: entry.id,
            label: entry.label,
            kind: StrataCommandKind.MENU,
            disabled: entry.disabled === true,
            danger: entry.danger === true,
            ruleBefore: entry.divided === true,
            run: entry.onSelect,
          }),
        );
      }
      return commands;
    },
  );

  function handleTitle(event: MouseEvent<HTMLElement>) {
    const column = event.currentTarget.closest("[data-strata-column]");
    if (column !== null) {
      strataScrollColumn(column, "top");
    }
  }

  return (
    <Header id={props.id} ref={header} data-strata-header>
      {props.slot !== undefined && (
        <StrataHeaderSlotOutlet columnKey={props.slot} lead />
      )}
      <Title
        type="button"
        data-strata-title
        title="Scroll to the top"
        onClick={handleTitle}
      >
        {props.kind === "split" && <span aria-hidden>↳ </span>}
        {props.title}
      </Title>
      {props.count !== undefined && (
        <Count data-strata-count>{props.count}</Count>
      )}
      {props.position !== undefined && props.position !== null && (
        <Position data-strata-position>
          <span
            title={`Item ${props.position.number} of ${props.position.total}`}
          >
            {props.position.number}/{props.position.total}
          </span>
          <IconButton
            size="small"
            data-strata-position-previous
            aria-label="Previous item"
            title={`Previous item (${keyLabel(KeyboardAction.POSITION_PREVIOUS)})`}
            disabled={!props.position.hasPrevious}
            onClick={() => props.position?.go(-1)}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
          <IconButton
            size="small"
            data-strata-position-next
            aria-label="Next item"
            title={`Next item (${keyLabel(KeyboardAction.POSITION_NEXT)})`}
            disabled={!props.position.hasNext}
            onClick={() => props.position?.go(1)}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </Position>
      )}
      {chips.map((chip) => (
        <Chip
          key={chip.id}
          type="button"
          data-strata-chip={chip.id}
          title={chip.title}
          aria-label={chip.title}
          live={chip.live === true}
          onClick={chip.onClick}
        >
          {chip.live === true && <span aria-hidden>● </span>}
          {chip.label}
        </Chip>
      ))}
      {(props.controls !== undefined || props.slot !== undefined) && (
        <BarControls>
          {props.controls}
          {props.slot !== undefined && (
            <StrataHeaderSlotOutlet columnKey={props.slot} />
          )}
        </BarControls>
      )}
      <Actions grow={props.controls === undefined && props.slot === undefined}>
        {props.views}
        {menu.length > 0 && <ColumnMenu headerId={props.id} entries={menu} />}
        {props.close !== undefined && <ColumnClose {...props.close} />}
      </Actions>
    </Header>
  );
}

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flex: "none",
  height: strataSize.columnHeader,
  boxSizing: "border-box",
  paddingInline: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

// The column's name, mono capitals, amber while the column is focused. It is a
// button because it scrolls the column to the top, and looks like a label.
const Title = styled(ButtonBase)(({ theme }) => ({
  flex: "0 1 auto",
  minWidth: 0,
  // A block, not the button's own flex row, so that a title that is too long is
  // cut with an ellipsis instead of running on.
  display: "block",
  textAlign: "left",
  maxWidth: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: strataType.label.size,
  letterSpacing: strataType.label.letterSpacing,
  textTransform: strataType.label.textTransform,
  color: theme.palette.text.secondary,
  // The frame says which column is focused.
  "[data-focused='true'] &, [data-alone='true'] &": {
    color: theme.palette.primary.main,
  },
  "&:hover": { color: theme.palette.text.primary },
  "&:focus-visible": {
    outline: `1px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

// A status, in mono: `● published` in the colour of good news, `shared` plain.
// It is a button because it opens the section that says more.
const Chip = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "live",
})<{ live: boolean }>(({ theme, live }) => ({
  flex: "none",
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: strataType.meta.size,
  whiteSpace: "nowrap",
  paddingInline: theme.spacing(0.75),
  borderRadius: 3,
  border: `1px solid ${theme.palette.divider}`,
  color: live ? theme.palette.success.main : theme.palette.text.secondary,
  "&:hover": { borderColor: theme.palette.text.secondary },
  "&:focus-visible": {
    outline: `1px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

// `12/63` and the arrows that move along the collection, close together.
const Position = styled("span")(({ theme }) => ({
  flex: "none",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.25),
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: strataType.meta.size,
  color: theme.palette.text.secondary,
  "& .MuiIconButton-root": {
    width: strataSize.controlSmall,
    height: strataSize.controlSmall,
    minHeight: 0,
    padding: 0,
  },
  "& .MuiSvgIcon-root": { fontSize: 16 },
}));

const Count = styled("span")(({ theme }) => ({
  flex: "none",
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: strataType.meta.size,
  color: theme.palette.text.secondary,
}));

// The panels bring their own controls; this only makes them fit a 36px row.
const Actions = styled("div", {
  shouldForwardProp: (prop) => prop !== "grow",
})<{ grow: boolean }>(({ theme, grow }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: grow ? 1 : "none",
  minWidth: "fit-content",
  gap: theme.spacing(0.5),
  // Small buttons: as tall as the main action.
  "& .MuiIconButton-root": {
    width: strataSize.controlSmall,
    height: strataSize.controlSmall,
    minHeight: 0,
    padding: 0,
  },
  "& .MuiSvgIcon-root": { fontSize: 16 },
  "& .MuiButton-root": {
    minWidth: 0,
    height: strataSize.controlSmall,
    minHeight: 0,
    paddingBlock: 0,
    paddingInline: theme.spacing(1),
  },
}));
