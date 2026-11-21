import type { WorkspaceFeature } from "@jupiter/webapi-client";
import {
  ArrowDropDown as ArrowDropDownIcon,
  Bolt as BoltIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grow,
  InputLabel,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Select,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { Link } from "react-router";
import type { Dispatch, JSX, RefObject, SetStateAction } from "react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { useIsomorphicLayoutEffect } from "#/core/infra/component/use-isomorphic-layout-effect";
import { useStrataBar } from "#/core/infra/component/layout/strata-bar-context";
import { useStrataActionCommands } from "#/core/infra/component/layout/use-strata-action-commands";
import { sectionActionsForForm } from "#/core/infra/component/section-actions-for-form";
import { StrataSectionFormContext } from "#/core/infra/component/strata-section-form-context";
import { useSectionFiltersPreserver } from "#/core/infra/component/use-section-filter";
import { strataSize, strataType } from "#/core/infra/component/strata-tokens";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface NavSingleDesc {
  kind: "nav-single";
  id?: string;
  text?: string;
  icon?: JSX.Element;
  link: string;
  highlight?: boolean;
  gatedOn?: WorkspaceFeature;
  disabled?: boolean;
}

interface NavSeparatorDesc {
  kind: "nav-separator";
}

type NavItemDesc = NavSingleDesc | NavSeparatorDesc;

interface NavMultipleDesc {
  kind: "nav-multiple";
  approach: "spread" | "compact";
  navs: Array<NavItemDesc>;
}

interface ActionSingleDesc {
  kind: "action-single";
  id?: string;
  text?: string;
  icon?: JSX.Element;
  value: string;
  /**
   * The id of the form the button submits, for actions drawn apart from it,
   * such as a column's header with the form's fields in the body. Left out, it
   * submits the form it is in.
   */
  form?: string;
  highlight?: boolean;
  gatedOn?: WorkspaceFeature;
  disabled?: boolean;
}

interface ActionMultipleDesc {
  kind: "action-multiple";
  approach: "spread" | "compact";
  actions: Array<ActionSingleDesc>;
}

interface ButtonSingleDesc {
  kind: "button-single";
  text: string;
  icon?: JSX.Element;
  onClick: () => void;
  highlight?: boolean;
  gatedOn?: WorkspaceFeature;
  disabled?: boolean;
}

interface FilterOption<K> {
  value: K;
  text: string;
  icon?: JSX.Element;
  gatedOn?: WorkspaceFeature;
  disabled?: boolean;
}

interface FilterOptionSeparatorDesc {
  separator: true;
  key?: string;
}

type FilterManyOption<K> = FilterOption<K> | FilterOptionSeparatorDesc;

interface FilterFewOptionsDesc<K> {
  kind: "filter-few-options";
  title: string;
  approach: "spread" | "compact";
  defaultOption: K;
  options: Array<FilterOption<K>>;
  onSelect: (selected: K) => void;
  hideIfOneOption?: boolean;
}

interface FilterManyOptionsDesc<K> {
  kind: "filter-many-options";
  title: string;
  options: Array<FilterManyOption<K>>;
  selected: Array<K>;
  onSelect: (selected: Array<K>) => void;
  hideIfOneOption?: boolean;
}

export type ActionDesc =
  | NavSingleDesc // A single button, as a navigation
  | NavMultipleDesc // A group of buttons, as a navigation
  | ActionSingleDesc // A single button, as an action
  | ActionMultipleDesc // A group of buttons, as an action
  | ButtonSingleDesc // A single button, as a button
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | FilterFewOptionsDesc<any> // A group to filter on, can be a navigation or a callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | FilterManyOptionsDesc<any>; // A group to filter on, with many options

export function isSingleAction(
  action: ActionDesc,
): action is NavSingleDesc | ActionSingleDesc | ButtonSingleDesc {
  return (
    action.kind === "nav-single" ||
    action.kind === "action-single" ||
    action.kind === "button-single"
  );
}

export function NavSingle(desc: Omit<NavSingleDesc, "kind">): NavSingleDesc {
  return {
    kind: "nav-single",
    ...desc,
  };
}

export function NavSeparator(): NavSeparatorDesc {
  return {
    kind: "nav-separator",
  };
}

export function NavMultipleSpread(
  desc: Omit<Omit<NavMultipleDesc, "kind">, "approach">,
): NavMultipleDesc {
  return {
    kind: "nav-multiple",
    approach: "spread",
    ...desc,
  };
}

export function NavMultipleCompact(
  desc: Omit<Omit<NavMultipleDesc, "kind">, "approach">,
): NavMultipleDesc {
  return {
    kind: "nav-multiple",
    approach: "compact",
    ...desc,
  };
}

export function ActionSingle(
  desc: Omit<ActionSingleDesc, "kind">,
): ActionSingleDesc {
  return {
    kind: "action-single",
    ...desc,
  };
}

export function ActionMultipleSpread(
  desc: Omit<Omit<ActionMultipleDesc, "kind">, "approach">,
): ActionMultipleDesc {
  return {
    kind: "action-multiple",
    approach: "spread",
    ...desc,
  };
}

export function ButtonSingle(
  desc: Omit<ButtonSingleDesc, "kind">,
): ButtonSingleDesc {
  return {
    kind: "button-single",
    ...desc,
  };
}

export function FilterFewOptionsSpread<K>(
  title: string,
  defaultOption: K,
  options: Array<FilterOption<K>>,
  onSelect: (selected: K) => void,
): FilterFewOptionsDesc<K> {
  return {
    kind: "filter-few-options",
    approach: "spread",
    title: title,
    defaultOption: defaultOption,
    options: options,
    onSelect: onSelect,
    hideIfOneOption: true,
  };
}

export function FilterFewOptionsCompact<K>(
  title: string,
  defaultOption: K,
  options: Array<FilterOption<K>>,
  onSelect: (selected: K) => void,
): FilterFewOptionsDesc<K> {
  return {
    kind: "filter-few-options",
    approach: "compact",
    title: title,
    defaultOption: defaultOption,
    options: options,
    onSelect: onSelect,
    hideIfOneOption: true,
  };
}

export function FilterOptionSeparator(): FilterOptionSeparatorDesc {
  return {
    separator: true,
  };
}

export function FilterManyOptions<K>(
  title: string,
  options: Array<FilterManyOption<K>>,
  selected: Array<K>,
  onSelect: (selected: Array<K>) => void,
): FilterManyOptionsDesc<K> {
  return {
    kind: "filter-many-options",
    title: title,
    options: options,
    selected: selected,
    onSelect: onSelect,
    hideIfOneOption: true,
  };
}

export enum ActionsExpansion {
  ALWAYS_SHOW,
  ALWAYS_COMPACT,
  ADAPT,
}

interface SectionActionsProps {
  id: string;
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  expansion?: ActionsExpansion;
  actions: Array<ActionDesc>;
  extraActions?: Array<ActionDesc>;
}

export function SectionActions(props: SectionActionsProps) {
  // Drawn in the header of a column, they submit the section's form, not the
  // header's.
  const formId = useContext(StrataSectionFormContext);
  if (formId === null) {
    return <SectionActionsInForm {...props} />;
  }
  return (
    <SectionActionsInForm
      {...props}
      actions={sectionActionsForForm(props.actions, formId)}
      extraActions={
        props.extraActions === undefined
          ? undefined
          : sectionActionsForForm(props.extraActions, formId)
      }
    />
  );
}

function SectionActionsInForm(props: SectionActionsProps) {
  const isBigScreen = useBigScreen();
  const bar = useStrataBar();
  const expansion = props.expansion ?? ActionsExpansion.ADAPT;
  // In a bar it is the room that says how many of the actions fit; anywhere
  // else it is the screen.
  const narrow = bar === null && !isBigScreen;
  // Every action is a command of the column (ADR 0021), however the section
  // draws it: spread out, or behind a drop-down.
  const ref = useRef<HTMLDivElement>(null);
  const commands = useStrataActionCommands(
    ref,
    props.actions.concat(props.extraActions ?? []),
    props.inputsEnabled,
    props.topLevelInfo,
  );

  let actions: Array<ActionDesc>;
  let extraActions: Array<ActionDesc>;

  // A lone action has nothing to fold with, so it shows, unless even it does
  // not fit the bar.
  if (
    props.actions.length === 1 &&
    (props.extraActions?.length ?? 0) === 0 &&
    (bar === null || bar.folded === 0)
  ) {
    actions = props.actions;
    extraActions = [];
  } else if (expansion === ActionsExpansion.ALWAYS_COMPACT) {
    actions = [];
    extraActions = props.actions.concat(props.extraActions ?? []);
  } else if (expansion === ActionsExpansion.ADAPT && bar !== null) {
    // As many as fit, from the first; the bar folds the rest, with the extra
    // ones, into the button.
    const folded = Math.min(bar.folded, props.actions.length);
    actions = props.actions.slice(0, props.actions.length - folded);
    extraActions = props.actions
      .slice(props.actions.length - folded)
      .concat(props.extraActions ?? []);
  } else if (expansion === ActionsExpansion.ADAPT && narrow) {
    if (isSingleAction(props.actions[0])) {
      actions = props.actions.slice(0, 1);
      extraActions = props.actions.concat(props.extraActions ?? []);
    } else {
      actions = [];
      extraActions = props.actions.concat(props.extraActions ?? []);
    }
  } else {
    actions = props.actions;
    extraActions = props.extraActions ?? [];
  }

  return (
    <Stack
      id={props.id}
      ref={ref}
      data-strata-actions={commands.length > 0 ? "true" : undefined}
      direction="row"
      spacing={bar !== null ? 0.5 : 1}
      sx={{
        // A bar has its own padding and aligns what it holds.
        padding: bar !== null ? 0 : "0.25rem",
        alignItems: bar !== null ? "center" : undefined,
        height: "fit-content",
      }}
    >
      {actions.map((action, index) => (
        <ActionView
          key={`action-${props.id}-${index}`}
          topLevelInfo={props.topLevelInfo}
          isInDialog={false}
          inputsEnabled={props.inputsEnabled}
          orientation="horizontal"
          action={action}
        />
      ))}

      {extraActions.length > 0 && (
        <SectionActionsWithDialog
          id={props.id}
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          actions={extraActions}
        />
      )}
    </Stack>
  );
}

interface SectionActionsWithDialogProps {
  id: string;
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  actions: Array<ActionDesc>;
}

function SectionActionsWithDialog(props: SectionActionsWithDialogProps) {
  const [showExtraActionsDialog, setShowExtraActionsDialog] = useState(false);
  const size = useBarSize(false);

  if (props.actions.length === 0) {
    return <></>;
  }

  return (
    <>
      <Button
        disabled={!props.inputsEnabled}
        variant="outlined"
        size={size ?? "medium"}
        color="primary"
        aria-label="More actions"
        title="More actions"
        sx={
          size === undefined
            ? { margin: "0.25rem", minWidth: 0 }
            : { margin: 0, minWidth: 0, width: strataSize.controlSmall, p: 0 }
        }
        onClick={() => setShowExtraActionsDialog(true)}
      >
        <BoltIcon fontSize={size === undefined ? "medium" : "small"} />
      </Button>

      <Dialog
        onClose={() => setShowExtraActionsDialog(false)}
        open={showExtraActionsDialog}
        disablePortal
      >
        <DialogTitle>Actions</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {props.actions.map((action, index) => (
              <ActionView
                key={`action-${props.id}-${index}`}
                topLevelInfo={props.topLevelInfo}
                inputsEnabled={props.inputsEnabled}
                isInDialog={true}
                orientation="vertical"
                action={action}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExtraActionsDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface ActionViewProps {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  orientation: "horizontal" | "vertical";
  action: ActionDesc;
}

function ActionView(props: ActionViewProps) {
  switch (props.action.kind) {
    case "nav-single":
      return (
        <NavSingleView
          id={props.action.id}
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          isInDialog={props.isInDialog}
          action={props.action}
        />
      );

    case "nav-multiple":
      return (
        <NavMultipleView
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          orientation={props.orientation}
          isInDialog={props.isInDialog}
          action={props.action}
        />
      );

    case "action-single":
      return (
        <ActionSingleView
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          isInDialog={props.isInDialog}
          action={props.action}
        />
      );

    case "action-multiple":
      return (
        <ActionMultipleView
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          orientation={props.orientation}
          isInDialog={props.isInDialog}
          action={props.action}
        />
      );

    case "button-single":
      return (
        <ButtonSingleView
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          isInDialog={props.isInDialog}
          action={props.action}
        />
      );

    case "filter-few-options":
      return (
        <FilterFewOptionsView
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          orientation={props.orientation}
          isInDialog={props.isInDialog}
          action={props.action}
        />
      );

    case "filter-many-options":
      return (
        <FilterManyOptionsView
          topLevelInfo={props.topLevelInfo}
          inputsEnabled={props.inputsEnabled}
          orientation={props.orientation}
          isInDialog={props.isInDialog}
          action={props.action}
        />
      );
  }
}

interface NavSingleViewProps {
  id?: string;
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  action: NavSingleDesc;
}

function NavSingleView(props: NavSingleViewProps) {
  const isBigScreen = useShowsWholeText();
  const size = useBarSize(props.isInDialog);
  const preserveFilters = useSectionFiltersPreserver();

  if (props.action.gatedOn) {
    const workspace = props.topLevelInfo.workspace;
    if (!isWorkspaceFeatureAvailable(workspace, props.action.gatedOn)) {
      return <></>;
    }
  }

  if (props.action.text === undefined) {
    throw new Error("A nav needs to have either a text");
  }

  return (
    <Button
      id={props.action.id}
      size={size}
      variant="outlined"
      component={Link}
      disabled={!props.inputsEnabled || props.action.disabled}
      startIcon={props.action.icon}
      to={preserveFilters(props.action.link)}
    >
      {getRealText(props.action.text, props.isInDialog, isBigScreen)}
    </Button>
  );
}

interface NavMultipleViewProps {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  orientation: "horizontal" | "vertical";
  action: NavMultipleDesc;
}

function NavMultipleView(props: NavMultipleViewProps) {
  switch (props.action.approach) {
    case "spread":
      return <NavMultipleSpreadView {...props} />;
    case "compact":
      return <NavMultipleCompactView {...props} />;
  }
}

function NavMultipleSpreadView(props: NavMultipleViewProps) {
  const isBigScreen = useShowsWholeText();
  const size = useBarSize(props.isInDialog);
  const preserveFilters = useSectionFiltersPreserver();
  const visibleNavs = visibleNavItems(
    props.action.navs,
    props.topLevelInfo.workspace,
  );

  return (
    <ButtonGroup orientation={props.orientation} size={size}>
      {visibleNavs.map((nav, index) => {
        if (nav.kind === "nav-separator") {
          return <Fragment key={`nav-multiple-${index}`}></Fragment>;
        }

        if (nav.text === undefined) {
          throw new Error("An nav needs to have either a text");
        }

        return (
          <Button
            key={`nav-multiple-${index}`}
            variant={nav.highlight ? "contained" : "outlined"}
            component={Link}
            disabled={!props.inputsEnabled || nav.disabled}
            startIcon={nav.icon}
            to={preserveFilters(nav.link)}
          >
            {getRealText(nav.text, props.isInDialog, isBigScreen)}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

const COMPACT_MENU_POPPER_MODIFIERS = [
  {
    name: "preventOverflow",
    options: {
      padding: 8,
      altAxis: true,
    },
  },
  {
    name: "flip",
    options: {
      padding: 8,
    },
  },
];

function useCompactMenuSurface(
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  anchorRef: RefObject<HTMLDivElement | null>,
) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

  useIsomorphicLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      return;
    }

    function updateFit() {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }

      const rect = anchor.getBoundingClientRect();
      const padding = 8;
      const spaceBelow = window.innerHeight - rect.bottom - padding;
      const spaceAbove = rect.top - padding;
      if (spaceAbove > spaceBelow) {
        setPlacement("top");
        setMaxHeight(Math.max(spaceAbove, 80));
      } else {
        setPlacement("bottom");
        setMaxHeight(Math.max(spaceBelow, 80));
      }
    }

    updateFit();
    window.addEventListener("resize", updateFit);
    return () => {
      window.removeEventListener("resize", updateFit);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Showing the menu can make a scroll container fire a scroll event without
    // anything moving (e.g. the panel adjusting to the menu), so only a scroll
    // that moves the button the menu hangs off closes it.
    const openedAnchorTop = anchorRef.current?.getBoundingClientRect().top;

    function handleScroll(event: Event) {
      if (
        paperRef.current &&
        event.target instanceof Node &&
        paperRef.current.contains(event.target)
      ) {
        return;
      }

      const anchorTop = anchorRef.current?.getBoundingClientRect().top;
      if (
        openedAnchorTop !== undefined &&
        anchorTop !== undefined &&
        Math.abs(anchorTop - openedAnchorTop) < 1
      ) {
        return;
      }

      setOpen(false);
    }

    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, setOpen, anchorRef]);

  // Focus the selected (or first) item once the menu shows, as MenuList's
  // autoFocusItem would, but without scrolling the page to it: a menu opening
  // below the fold would otherwise scroll, and the scroll would close it.
  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const paper = paperRef.current;
      if (!paper) {
        return;
      }

      const item =
        paper.querySelector<HTMLElement>('[role="menuitem"].Mui-selected') ??
        paper.querySelector<HTMLElement>(
          '[role="menuitem"]:not(.Mui-disabled)',
        );
      item?.focus({ preventScroll: true });
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [open]);

  return { paperRef, maxHeight, placement };
}

function compactMenuPaperSx(maxHeight: number | undefined) {
  return {
    maxHeight:
      maxHeight !== undefined
        ? `${maxHeight}px`
        : "min(24rem, calc(var(--vh, 1vh) * 100 - 8rem))",
    overflowY: "auto" as const,
    overscrollBehavior: "contain" as const,
  };
}

function NavMultipleCompactView(props: NavMultipleViewProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { paperRef, maxHeight, placement } = useCompactMenuSurface(
    open,
    setOpen,
    anchorRef,
  );
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  const wholeText = useShowsWholeText();
  const size = useBarSize(props.isInDialog);
  const preserveFilters = useSectionFiltersPreserver();

  const visibleNavs = visibleNavItems(
    props.action.navs,
    props.topLevelInfo.workspace,
  );
  const realActions = visibleNavs.filter(
    (nav): nav is NavSingleDesc => nav.kind === "nav-single",
  );

  const selectedIndex = Math.max(
    0,
    realActions.findIndex((nav) => nav.highlight),
  );

  function handleMenuItemClick() {
    setOpen(false);
  }

  function handleClose(event: Event) {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  }

  if (realActions.length === 0) {
    return <></>;
  }

  return (
    <>
      <ButtonGroup ref={anchorRef} size={size}>
        <Button
          sx={{ flexGrow: 10 }}
          disabled={!props.inputsEnabled || realActions[selectedIndex].disabled}
          component={Link}
          startIcon={realActions[selectedIndex].icon}
          to={preserveFilters(realActions[selectedIndex].link)}
        >
          {getRealText(
            realActions[selectedIndex].text || "",
            props.isInDialog,
            wholeText,
          )}
        </Button>
        <Button
          id="section-action-nav-multiple-compact-button"
          sx={{ flexGrow: 1 }}
          size="small"
          disabled={!props.inputsEnabled}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: theme.zIndex.appBar + 2000,
          backgroundColor: theme.palette.background.paper,
        }}
        open={open}
        anchorEl={anchorRef.current}
        placement={placement}
        disablePortal={!isBigScreen}
        modifiers={COMPACT_MENU_POPPER_MODIFIERS}
      >
        <Paper ref={paperRef} sx={compactMenuPaperSx(maxHeight)}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList id="split-button-menu">
              {visibleNavs.map((option, index) => {
                if (option.kind === "nav-separator") {
                  return <Divider key={`nav-separator-${index}`} />;
                }

                return (
                  <MenuItem
                    key={`nav-multiple-${index}`}
                    selected={option === realActions[selectedIndex]}
                    component={Link}
                    to={preserveFilters(option.link)}
                    disabled={!props.inputsEnabled || option.disabled}
                    onClick={handleMenuItemClick}
                  >
                    {option.text}
                  </MenuItem>
                );
              })}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  );
}

interface ActionSingleViewProps {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  action: ActionSingleDesc;
}

function ActionSingleView(props: ActionSingleViewProps) {
  const isBigScreen = useShowsWholeText();
  const size = useBarSize(props.isInDialog);

  if (props.action.gatedOn) {
    const workspace = props.topLevelInfo.workspace;
    if (!isWorkspaceFeatureAvailable(workspace, props.action.gatedOn)) {
      return <></>;
    }
  }

  if (props.action.text === undefined && props.action.icon === undefined) {
    throw new Error("An action needs to have either a text or an icon");
  }

  return (
    <Button
      size={size}
      variant={props.action.highlight ? "contained" : "outlined"}
      disabled={!props.inputsEnabled || props.action.disabled}
      startIcon={props.action.icon}
      type="submit"
      form={props.action.form}
      name="intent"
      value={props.action.value}
      id={props.action.id}
    >
      {getRealText(props.action.text || "", props.isInDialog, isBigScreen)}
    </Button>
  );
}

interface ActionMultipleViewProps {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  orientation: "horizontal" | "vertical";
  action: ActionMultipleDesc;
}

function ActionMultipleView(props: ActionMultipleViewProps) {
  switch (props.action.approach) {
    case "spread":
      return <ActionMultipleSpreadView {...props} />;
    case "compact":
      return <ActionMultipleCompactView {...props} />;
  }
}

function ActionMultipleSpreadView(props: ActionMultipleViewProps) {
  const isBigScreen = useShowsWholeText();
  const size = useBarSize(props.isInDialog);

  return (
    <ButtonGroup orientation={props.orientation} size={size}>
      {props.action.actions.map((action, index) => {
        if (action.gatedOn) {
          const workspace = props.topLevelInfo.workspace;
          if (!isWorkspaceFeatureAvailable(workspace, action.gatedOn)) {
            return <Fragment key={`action-multiple-${index}`}></Fragment>;
          }
        }

        if (action.text === undefined && action.icon === undefined) {
          throw new Error("An action needs to have either a text or an icon");
        }

        return (
          <Button
            key={`action-multiple-${index}`}
            variant={action.highlight ? "contained" : "outlined"}
            disabled={!props.inputsEnabled || action.disabled}
            startIcon={action.icon}
            type="submit"
            form={action.form}
            name="intent"
            value={action.value}
            id={action.id}
          >
            {getRealText(action.text || "", props.isInDialog, isBigScreen)}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

function ActionMultipleCompactView(props: ActionMultipleViewProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { paperRef, maxHeight, placement } = useCompactMenuSurface(
    open,
    setOpen,
    anchorRef,
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  const wholeText = useShowsWholeText();
  const size = useBarSize(props.isInDialog);

  const realActions: ActionSingleDesc[] = [];
  for (const action of props.action.actions) {
    if (action.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, action.gatedOn)) {
        continue;
      }
    }
    realActions.push(action);
  }

  function handleMenuItemClick(index: number) {
    setSelectedIndex(index);
    setOpen(false);
  }

  function handleClose(event: Event) {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  }

  if (realActions.length === 0) {
    return <></>;
  }

  return (
    <>
      <ButtonGroup ref={anchorRef} size={size}>
        <Button
          disabled={!props.inputsEnabled || realActions[selectedIndex].disabled}
          startIcon={realActions[selectedIndex].icon}
          type="submit"
          form={realActions[selectedIndex].form}
          name="intent"
          value={realActions[selectedIndex].value}
          id={realActions[selectedIndex].id}
        >
          {getRealText(
            realActions[selectedIndex].text || "",
            props.isInDialog,
            wholeText,
          )}
        </Button>
        <Button
          size="small"
          disabled={!props.inputsEnabled}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: theme.zIndex.appBar + 20,
          backgroundColor: theme.palette.background.paper,
        }}
        open={open}
        anchorEl={anchorRef.current}
        placement={placement}
        disablePortal={!isBigScreen}
        modifiers={COMPACT_MENU_POPPER_MODIFIERS}
        transition
      >
        {({ TransitionProps, placement: computedPlacement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                computedPlacement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper ref={paperRef} sx={compactMenuPaperSx(maxHeight)}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {realActions.map((option, index) => (
                    <MenuItem
                      id={option.id}
                      key={`action-multiple-${index}`}
                      selected={index === selectedIndex}
                      disabled={!props.inputsEnabled || option.disabled}
                      onClick={() => handleMenuItemClick(index)}
                    >
                      {option.text}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

interface ButtonSingleViewProps {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  action: ButtonSingleDesc;
}

function ButtonSingleView(props: ButtonSingleViewProps) {
  const isBigScreen = useShowsWholeText();
  const size = useBarSize(props.isInDialog);

  if (props.action.gatedOn) {
    const workspace = props.topLevelInfo.workspace;
    if (!isWorkspaceFeatureAvailable(workspace, props.action.gatedOn)) {
      return <></>;
    }
  }

  return (
    <Button
      size={size}
      variant={props.action.highlight ? "contained" : "outlined"}
      disabled={!props.inputsEnabled || props.action.disabled}
      startIcon={props.action.icon}
      onClick={props.action.onClick}
    >
      {getRealText(props.action.text || "", props.isInDialog, isBigScreen)}
    </Button>
  );
}

interface FilterFewOptionsViewProps<K> {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  orientation: "horizontal" | "vertical";
  action: FilterFewOptionsDesc<K>;
}

function FilterFewOptionsView<K>(props: FilterFewOptionsViewProps<K>) {
  switch (props.action.approach) {
    case "spread":
      return <FilterFewOptionsSpreadView {...props} />;
    case "compact":
      return <FilterFewOptionsCompactView {...props} />;
  }
}

function FilterFewOptionsSpreadView<K>(props: FilterFewOptionsViewProps<K>) {
  const isBigScreen = useShowsWholeText();
  const size = useBarSize(props.isInDialog);
  // Whoever put these buttons here is the one keeping track of which one is
  // on - so a choice made elsewhere, like going back to a page that was left
  // on another one, shows up here too.
  const selected = props.action.defaultOption;

  const realOptions: FilterOption<K>[] = [];
  for (const option of props.action.options) {
    if (option.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, option.gatedOn)) {
        continue;
      }
    }
    realOptions.push(option);
  }

  if (realOptions.length === 0) {
    return <></>;
  }

  if (props.action.hideIfOneOption && realOptions.length === 1) {
    return <></>;
  }

  return (
    <ButtonGroup orientation={props.orientation} size={size}>
      {props.action.options.map((option, index) => {
        if (option.gatedOn) {
          const workspace = props.topLevelInfo.workspace;
          if (!isWorkspaceFeatureAvailable(workspace, option.gatedOn)) {
            return <Fragment key={`filter-few-options-${index}`}></Fragment>;
          }
        }

        return (
          <Button
            key={`filter-few-options-${index}`}
            variant={option.value === selected ? "contained" : "outlined"}
            disabled={!props.inputsEnabled || option.disabled}
            startIcon={option.icon}
            onClick={() => {
              props.action.onSelect(option.value);
            }}
          >
            {getRealText(option.text, props.isInDialog, isBigScreen)}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

function FilterFewOptionsCompactView<K>(props: FilterFewOptionsViewProps<K>) {
  const realOptions: FilterOption<K>[] = [];
  for (const option of props.action.options) {
    if (option.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, option.gatedOn)) {
        continue;
      }
    }
    realOptions.push(option);
  }

  // Whoever put this select here is the one keeping track of which option is
  // on - so a choice made elsewhere, like the URL, shows up here too.
  const selectedIndex = Math.max(
    0,
    realOptions.findIndex((opt) => opt.value === props.action.defaultOption),
  );
  const selectId = `section-action-filter-few-compact-${props.action.title}`;
  // In a bar the title is not a floating label, which would not fit: the
  // control is as tall as a button and the title is its name and its tooltip.
  const dense = useBarSize(props.isInDialog) !== undefined;

  if (realOptions.length === 0) {
    return <></>;
  }

  if (props.action.hideIfOneOption && realOptions.length === 1) {
    return <></>;
  }

  return (
    <FormControl
      size="small"
      title={
        dense
          ? `${props.action.title}: ${realOptions[selectedIndex].text}`
          : undefined
      }
    >
      {!dense && (
        <InputLabel id={`${selectId}-label`}>{props.action.title}</InputLabel>
      )}
      <Select
        labelId={dense ? undefined : `${selectId}-label`}
        id={selectId}
        label={dense ? undefined : props.action.title}
        SelectDisplayProps={
          dense ? { "aria-label": props.action.title } : undefined
        }
        sx={dense ? BAR_INPUT_SX : undefined}
        readOnly={!props.inputsEnabled}
        value={selectedIndex}
        onChange={(e) => {
          props.action.onSelect(realOptions[e.target.value as number].value);
        }}
        renderValue={() => (
          <Box
            sx={{
              display: "flex",
              flexWrap: dense ? "nowrap" : "wrap",
              alignItems: "center",
              gap: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {realOptions[selectedIndex].icon} {realOptions[selectedIndex].text}
          </Box>
        )}
      >
        {realOptions.map((option, index) => (
          <MenuItem
            key={`filter-few-multiple-${index}`}
            value={index}
            disabled={option.disabled}
          >
            {option.icon} {option.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface FilterManyOptionsViewProps<K> {
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  isInDialog: boolean;
  orientation: "horizontal" | "vertical";
  action: FilterManyOptionsDesc<K>;
}

function FilterManyOptionsView<K>(props: FilterManyOptionsViewProps<K>) {
  const dense = useBarSize(props.isInDialog) !== undefined;
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const visibleOptions: FilterManyOption<K>[] = [];
  for (const [index, option] of props.action.options.entries()) {
    if (isFilterOptionSeparator(option)) {
      visibleOptions.push({ ...option, key: `separator-${index}` });
      continue;
    }
    if (option.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, option.gatedOn)) {
        continue;
      }
    }
    visibleOptions.push(option);
  }

  const realOptions = collapseFilterManyOptions(visibleOptions);
  // Whoever put this filter here keeps track of what's selected - usually in
  // the URL - so that a choice made elsewhere shows up here too.
  const selected: FilterOption<K>[] = [];
  for (const value of props.action.selected) {
    const option = realOptions.find(
      (o): o is FilterOption<K> =>
        !isFilterOptionSeparator(o) && o.value === value,
    );
    if (option !== undefined) {
      selected.push(option);
    }
  }
  const selectableCount = realOptions.filter(
    (option) => !isFilterOptionSeparator(option),
  ).length;

  if (selectableCount === 0) {
    return <></>;
  }

  if (props.action.hideIfOneOption && selectableCount === 1) {
    return <></>;
  }

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      size="small"
      options={realOptions}
      limitTags={1}
      getLimitTagsText={(more) => `+${more}`}
      getOptionLabel={(option) =>
        isFilterOptionSeparator(option) ? "" : option.text
      }
      getOptionKey={(option) =>
        isFilterOptionSeparator(option)
          ? (option.key ?? "separator")
          : String(option.value)
      }
      value={selected}
      onChange={(_, nextSelected) => {
        const realSelected = nextSelected.filter(
          (option): option is FilterOption<K> =>
            !isFilterOptionSeparator(option),
        );
        props.action.onSelect(realSelected.map((option) => option.value));
      }}
      isOptionEqualToValue={(option, value) =>
        !isFilterOptionSeparator(option) &&
        !isFilterOptionSeparator(value) &&
        option.value === value.value
      }
      getOptionDisabled={(option) =>
        isFilterOptionSeparator(option) || option.disabled || false
      }
      renderValue={(tagValue, getItemProps) => {
        if (tagValue.length === 0) {
          return null;
        }

        const extra = tagValue.length - 1;
        const { key, ...firstTagProps } = getItemProps({ index: 0 });

        return (
          <Box
            key={key}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <Chip
              size="small"
              label={
                isFilterOptionSeparator(tagValue[0]) ? "" : tagValue[0].text
              }
              {...firstTagProps}
            />
            {extra > 0 && (
              <Box
                component="span"
                sx={{
                  typography: "caption",
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                +{extra}
              </Box>
            )}
          </Box>
        );
      }}
      renderOption={(optionProps, option, { selected }) => {
        if (isFilterOptionSeparator(option)) {
          return (
            <Divider
              key={optionProps.key}
              component="li"
              role="separator"
              sx={{ pointerEvents: "none", my: 0.5 }}
            />
          );
        }

        return (
          <li {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              disabled={option.disabled || false}
            />
            {option.text}
          </li>
        );
      }}
      sx={[
        autocompleteSingleLineSx,
        dense ? BAR_INPUT_SX : {},
        {
          width: dense ? "6.75rem" : "9rem",
          minWidth: dense ? "6.75rem" : "9rem",
          maxWidth: dense ? "6.75rem" : "9rem",
          "& .MuiAutocomplete-tag": {
            maxWidth: "4.25rem",
          },
          "& .MuiAutocomplete-input": {
            minWidth: "1.25rem",
          },
        },
      ]}
      renderInput={(params) => (
        <TextField
          {...params}
          multiline={false}
          label={dense ? undefined : props.action.title}
          placeholder={props.action.title}
          title={dense ? props.action.title : undefined}
          slotProps={
            dense
              ? {
                  ...params.slotProps,
                  htmlInput: {
                    ...params.slotProps.htmlInput,
                    "aria-label": props.action.title,
                  },
                }
              : undefined
          }
        />
      )}
    />
  );
}

// A select or an autocomplete in a bar is as tall as a small button.
const BAR_INPUT_SX = {
  minHeight: strataSize.controlSmall,
  fontSize: strataType.path.size,
  "& .MuiOutlinedInput-root": { minHeight: strataSize.controlSmall },
  "& .MuiSelect-select.MuiSelect-select": {
    paddingBlock: 0,
    paddingLeft: "8px",
    paddingRight: "22px",
    display: "flex",
  },
  // The arrow of a select and of an autocomplete are as small as the text.
  "& .MuiSelect-icon": { fontSize: 18, right: 2 },
  "& .MuiAutocomplete-endAdornment": { right: 2 },
  "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator": {
    width: 20,
    height: 20,
    minHeight: 0,
    padding: 0,
    "& .MuiSvgIcon-root": { fontSize: 16 },
  },
} as const;

function isFilterOptionSeparator<K>(
  option: FilterManyOption<K>,
): option is FilterOptionSeparatorDesc {
  return "separator" in option && option.separator === true;
}

function collapseFilterManyOptions<K>(
  options: Array<FilterManyOption<K>>,
): Array<FilterManyOption<K>> {
  const collapsed: Array<FilterManyOption<K>> = [];
  for (const option of options) {
    if (isFilterOptionSeparator(option)) {
      if (collapsed.length === 0) {
        continue;
      }
      if (isFilterOptionSeparator(collapsed[collapsed.length - 1])) {
        continue;
      }
    }
    collapsed.push(option);
  }

  if (
    collapsed.length > 0 &&
    isFilterOptionSeparator(collapsed[collapsed.length - 1])
  ) {
    collapsed.pop();
  }

  return collapsed;
}

function visibleNavItems(
  navs: Array<NavItemDesc>,
  workspace: TopLevelInfo["workspace"],
): Array<NavItemDesc> {
  const visible: Array<NavItemDesc> = [];
  for (const nav of navs) {
    if (nav.kind === "nav-separator") {
      visible.push(nav);
      continue;
    }
    if (nav.gatedOn && !isWorkspaceFeatureAvailable(workspace, nav.gatedOn)) {
      continue;
    }
    visible.push(nav);
  }

  const collapsed: Array<NavItemDesc> = [];
  for (const nav of visible) {
    if (nav.kind === "nav-separator") {
      if (collapsed.length === 0) {
        continue;
      }
      if (collapsed[collapsed.length - 1].kind === "nav-separator") {
        continue;
      }
    }
    collapsed.push(nav);
  }

  if (
    collapsed.length > 0 &&
    collapsed[collapsed.length - 1].kind === "nav-separator"
  ) {
    collapsed.pop();
  }

  return collapsed;
}

/** Controls in a bar are small; those in a dialog opened from it are not. */
function useBarSize(isInDialog: boolean): "small" | undefined {
  const bar = useStrataBar();
  return bar !== null && !isInDialog ? "small" : undefined;
}

/**
 * Whether the text of a button is shown whole. A small screen shortens it, but
 * a bar does not: it folds its controls when they do not fit.
 */
function useShowsWholeText(): boolean {
  const isBigScreen = useBigScreen();
  const bar = useStrataBar();
  return isBigScreen || bar !== null;
}

function getRealText(text: string, isInDialog: boolean, isBigScreen: boolean) {
  if (isBigScreen || isInDialog) {
    return text;
  }

  if (text.length <= 6) {
    return text;
  }

  if (text.toLowerCase() === "create" || text.toLowerCase() === "new") {
    return text;
  }

  return `${text.slice(0, 6)}...`;
}
