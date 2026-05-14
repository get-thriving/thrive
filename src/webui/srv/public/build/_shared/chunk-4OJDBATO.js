import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  ArrowDropDown_default,
  Bolt_default,
  CheckBoxOutlineBlank_default,
  CheckBox_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Autocomplete_default,
  Box_default,
  ButtonGroup_default,
  Button_default,
  Checkbox_default,
  ClickAwayListener,
  DialogActions_default,
  DialogContent_default,
  DialogTitle_default,
  Dialog_default,
  FormControl_default,
  Grow_default,
  InputLabel_default,
  MenuItem_default,
  MenuList_default,
  Paper_default,
  Popper_default,
  Select_default,
  Stack_default,
  TextField_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/component/autocomplete-sx.ts
var autocompleteSingleLineSx = {
  "& .MuiAutocomplete-inputRoot": {
    flexWrap: "nowrap",
    overflowX: "auto",
    overflowY: "hidden",
    alignItems: "center",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" }
  },
  "& .MuiAutocomplete-tag": {
    maxWidth: 140,
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  "& .MuiAutocomplete-input": {
    minWidth: 60,
    flexGrow: 1
  }
};

// ../core/jupiter/core/infra/component/section-actions.tsx
var import_react2 = __toESM(require_react(), 1);
function isSingleAction(action) {
  return action.kind === "nav-single" || action.kind === "action-single" || action.kind === "button-single";
}
function NavSingle(desc) {
  return {
    kind: "nav-single",
    ...desc
  };
}
function NavMultipleSpread(desc) {
  return {
    kind: "nav-multiple",
    approach: "spread",
    ...desc
  };
}
function NavMultipleCompact(desc) {
  return {
    kind: "nav-multiple",
    approach: "compact",
    ...desc
  };
}
function ActionSingle(desc) {
  return {
    kind: "action-single",
    ...desc
  };
}
function ActionMultipleSpread(desc) {
  return {
    kind: "action-multiple",
    approach: "spread",
    ...desc
  };
}
function ButtonSingle(desc) {
  return {
    kind: "button-single",
    ...desc
  };
}
function FilterFewOptionsSpread(title, defaultOption, options, onSelect) {
  return {
    kind: "filter-few-options",
    approach: "spread",
    title,
    defaultOption,
    options,
    onSelect,
    hideIfOneOption: true
  };
}
function FilterFewOptionsCompact(title, defaultOption, options, onSelect) {
  return {
    kind: "filter-few-options",
    approach: "compact",
    title,
    defaultOption,
    options,
    onSelect,
    hideIfOneOption: true
  };
}
function FilterManyOptions(title, options, onSelect) {
  return {
    kind: "filter-many-options",
    title,
    options,
    onSelect,
    hideIfOneOption: true
  };
}
function SectionActions(props) {
  const isBigScreen = useBigScreen();
  const expansion = props.expansion ?? 2 /* ADAPT */;
  let actions;
  let extraActions;
  if (props.actions.length === 1 && props.extraActions?.length === 0) {
    actions = props.actions;
    extraActions = [];
  } else if (expansion === 1 /* ALWAYS_COMPACT */) {
    actions = [];
    extraActions = props.actions.concat(props.extraActions ?? []);
  } else if (expansion === 2 /* ADAPT */ && !isBigScreen) {
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
  return /* @__PURE__ */ jsxDEV(
    Stack_default,
    {
      id: props.id,
      direction: "row",
      spacing: 1,
      sx: { padding: "0.25rem", height: "fit-content" },
      children: [
        actions.map((action, index) => /* @__PURE__ */ jsxDEV(
          ActionView,
          {
            topLevelInfo: props.topLevelInfo,
            isInDialog: false,
            inputsEnabled: props.inputsEnabled,
            orientation: "horizontal",
            action
          },
          `action-${props.id}-${index}`,
          false,
          {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 282,
            columnNumber: 9
          },
          this
        )),
        (actions.length == 0 && extraActions.length > 0 || extraActions.length > 1) && /* @__PURE__ */ jsxDEV(
          SectionActionsWithDialog,
          {
            id: props.id,
            topLevelInfo: props.topLevelInfo,
            inputsEnabled: props.inputsEnabled,
            actions: extraActions
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 294,
            columnNumber: 9
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 275,
      columnNumber: 5
    },
    this
  );
}
function SectionActionsWithDialog(props) {
  const [showExtraActionsDialog, setShowExtraActionsDialog] = (0, import_react2.useState)(false);
  if (props.actions.length === 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 316,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Button_default,
      {
        disabled: !props.inputsEnabled,
        variant: "outlined",
        size: "medium",
        color: "primary",
        sx: { margin: "0.25rem" },
        onClick: () => setShowExtraActionsDialog(true),
        children: /* @__PURE__ */ jsxDEV(Bolt_default, {}, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 329,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 321,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      Dialog_default,
      {
        onClose: () => setShowExtraActionsDialog(false),
        open: showExtraActionsDialog,
        disablePortal: true,
        children: [
          /* @__PURE__ */ jsxDEV(DialogTitle_default, { children: "Actions" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 337,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(DialogContent_default, { children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: props.actions.map((action, index) => /* @__PURE__ */ jsxDEV(
            ActionView,
            {
              topLevelInfo: props.topLevelInfo,
              inputsEnabled: props.inputsEnabled,
              isInDialog: true,
              orientation: "vertical",
              action
            },
            `action-${props.id}-${index}`,
            false,
            {
              fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
              lineNumber: 341,
              columnNumber: 15
            },
            this
          )) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 339,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 338,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(DialogActions_default, { children: /* @__PURE__ */ jsxDEV(Button_default, { onClick: () => setShowExtraActionsDialog(false), children: "Close" }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 353,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 352,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 332,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 320,
    columnNumber: 5
  }, this);
}
function ActionView(props) {
  switch (props.action.kind) {
    case "nav-single":
      return /* @__PURE__ */ jsxDEV(
        NavSingleView,
        {
          id: props.action.id,
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          isInDialog: props.isInDialog,
          action: props.action
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 374,
          columnNumber: 9
        },
        this
      );
    case "nav-multiple":
      return /* @__PURE__ */ jsxDEV(
        NavMultipleView,
        {
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          orientation: props.orientation,
          isInDialog: props.isInDialog,
          action: props.action
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 385,
          columnNumber: 9
        },
        this
      );
    case "action-single":
      return /* @__PURE__ */ jsxDEV(
        ActionSingleView,
        {
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          isInDialog: props.isInDialog,
          action: props.action
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 396,
          columnNumber: 9
        },
        this
      );
    case "action-multiple":
      return /* @__PURE__ */ jsxDEV(
        ActionMultipleView,
        {
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          orientation: props.orientation,
          isInDialog: props.isInDialog,
          action: props.action
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 406,
          columnNumber: 9
        },
        this
      );
    case "button-single":
      return /* @__PURE__ */ jsxDEV(
        ButtonSingleView,
        {
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          isInDialog: props.isInDialog,
          action: props.action
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 417,
          columnNumber: 9
        },
        this
      );
    case "filter-few-options":
      return /* @__PURE__ */ jsxDEV(
        FilterFewOptionsView,
        {
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          orientation: props.orientation,
          isInDialog: props.isInDialog,
          action: props.action
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 427,
          columnNumber: 9
        },
        this
      );
    case "filter-many-options":
      return /* @__PURE__ */ jsxDEV(
        FilterManyOptionsView,
        {
          topLevelInfo: props.topLevelInfo,
          inputsEnabled: props.inputsEnabled,
          orientation: props.orientation,
          isInDialog: props.isInDialog,
          action: props.action
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 438,
          columnNumber: 9
        },
        this
      );
  }
}
function NavSingleView(props) {
  const isBigScreen = useBigScreen();
  if (props.action.gatedOn) {
    const workspace = props.topLevelInfo.workspace;
    if (!isWorkspaceFeatureAvailable(workspace, props.action.gatedOn)) {
      return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 463,
        columnNumber: 14
      }, this);
    }
  }
  if (props.action.text === void 0) {
    throw new Error("A nav needs to have either a text");
  }
  return /* @__PURE__ */ jsxDEV(
    Button_default,
    {
      id: props.action.id,
      variant: "outlined",
      component: Link,
      disabled: !props.inputsEnabled || props.action.disabled,
      startIcon: props.action.icon,
      to: props.action.link,
      children: getRealText(props.action.text, props.isInDialog, isBigScreen)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 472,
      columnNumber: 5
    },
    this
  );
}
function NavMultipleView(props) {
  switch (props.action.approach) {
    case "spread":
      return /* @__PURE__ */ jsxDEV(NavMultipleSpreadView, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 496,
        columnNumber: 14
      }, this);
    case "compact":
      return /* @__PURE__ */ jsxDEV(NavMultipleCompactView, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 498,
        columnNumber: 14
      }, this);
  }
}
function NavMultipleSpreadView(props) {
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(ButtonGroup_default, { orientation: props.orientation, children: props.action.navs.map((nav, index) => {
    if (nav.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, nav.gatedOn)) {
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, {}, `nav-multiple-${index}`, false, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 511,
          columnNumber: 20
        }, this);
      }
    }
    if (nav.text === void 0) {
      throw new Error("An nav needs to have either a text");
    }
    return /* @__PURE__ */ jsxDEV(
      Button_default,
      {
        variant: nav.highlight ? "contained" : "outlined",
        component: Link,
        disabled: !props.inputsEnabled || nav.disabled,
        startIcon: nav.icon,
        to: nav.link,
        children: getRealText(nav.text, props.isInDialog, isBigScreen)
      },
      `nav-multiple-${index}`,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 520,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 506,
    columnNumber: 5
  }, this);
}
function NavMultipleCompactView(props) {
  const [open, setOpen] = (0, import_react2.useState)(false);
  const anchorRef = (0, import_react2.useRef)(null);
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  const realActions = [];
  for (const action of props.action.navs) {
    if (action.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, action.gatedOn)) {
        continue;
      }
    }
    realActions.push(action);
  }
  const selectedIndex = Math.max(
    0,
    realActions.findIndex((nav) => nav.highlight)
  );
  function handleMenuItemClick() {
    setOpen(false);
  }
  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }
  if (realActions.length === 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 574,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(ButtonGroup_default, { ref: anchorRef, children: [
      /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          sx: { flexGrow: 10 },
          disabled: !props.inputsEnabled || realActions[selectedIndex].disabled,
          component: Link,
          startIcon: realActions[selectedIndex].icon,
          to: realActions[selectedIndex].link,
          children: getRealText(
            realActions[selectedIndex].text || "",
            props.isInDialog,
            isBigScreen
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 580,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          id: "section-action-nav-multiple-compact-button",
          sx: { flexGrow: 1 },
          size: "small",
          disabled: !props.inputsEnabled,
          onClick: () => setOpen((prevOpen) => !prevOpen),
          children: /* @__PURE__ */ jsxDEV(ArrowDropDown_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 600,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 593,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 579,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Popper_default,
      {
        sx: {
          zIndex: theme.zIndex.appBar + 2e3,
          backgroundColor: theme.palette.background.paper
        },
        open,
        anchorEl: anchorRef.current,
        disablePortal: !isBigScreen,
        children: /* @__PURE__ */ jsxDEV(Paper_default, { children: /* @__PURE__ */ jsxDEV(ClickAwayListener, { onClickAway: handleClose, children: /* @__PURE__ */ jsxDEV(MenuList_default, { id: "split-button-menu", autoFocusItem: true, children: realActions.map((option, index) => /* @__PURE__ */ jsxDEV(
          MenuItem_default,
          {
            selected: index === selectedIndex,
            component: Link,
            to: option.link,
            disabled: !props.inputsEnabled || option.disabled,
            onClick: handleMenuItemClick,
            children: option.text
          },
          `nav-multiple-${index}`,
          false,
          {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 616,
            columnNumber: 17
          },
          this
        )) }, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 614,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 613,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 612,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 603,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 578,
    columnNumber: 5
  }, this);
}
function ActionSingleView(props) {
  const isBigScreen = useBigScreen();
  if (props.action.gatedOn) {
    const workspace = props.topLevelInfo.workspace;
    if (!isWorkspaceFeatureAvailable(workspace, props.action.gatedOn)) {
      return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 648,
        columnNumber: 14
      }, this);
    }
  }
  if (props.action.text === void 0 && props.action.icon === void 0) {
    throw new Error("An action needs to have either a text or an icon");
  }
  return /* @__PURE__ */ jsxDEV(
    Button_default,
    {
      variant: props.action.highlight ? "contained" : "outlined",
      disabled: !props.inputsEnabled || props.action.disabled,
      startIcon: props.action.icon,
      type: "submit",
      name: "intent",
      value: props.action.value,
      id: props.action.id,
      children: getRealText(props.action.text || "", props.isInDialog, isBigScreen)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 657,
      columnNumber: 5
    },
    this
  );
}
function ActionMultipleView(props) {
  switch (props.action.approach) {
    case "spread":
      return /* @__PURE__ */ jsxDEV(ActionMultipleSpreadView, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 682,
        columnNumber: 14
      }, this);
    case "compact":
      return /* @__PURE__ */ jsxDEV(ActionMultipleCompactView, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 684,
        columnNumber: 14
      }, this);
  }
}
function ActionMultipleSpreadView(props) {
  const isBigScreen = useBigScreen();
  return /* @__PURE__ */ jsxDEV(ButtonGroup_default, { orientation: props.orientation, children: props.action.actions.map((action, index) => {
    if (action.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, action.gatedOn)) {
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, {}, `action-multiple-${index}`, false, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 697,
          columnNumber: 20
        }, this);
      }
    }
    if (action.text === void 0 && action.icon === void 0) {
      throw new Error("An action needs to have either a text or an icon");
    }
    return /* @__PURE__ */ jsxDEV(
      Button_default,
      {
        variant: action.highlight ? "contained" : "outlined",
        disabled: !props.inputsEnabled || action.disabled,
        startIcon: action.icon,
        type: "submit",
        name: "intent",
        value: action.value,
        id: action.id,
        children: getRealText(action.text || "", props.isInDialog, isBigScreen)
      },
      `action-multiple-${index}`,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 706,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 692,
    columnNumber: 5
  }, this);
}
function ActionMultipleCompactView(props) {
  const [open, setOpen] = (0, import_react2.useState)(false);
  const anchorRef = (0, import_react2.useRef)(null);
  const [selectedIndex, setSelectedIndex] = (0, import_react2.useState)(0);
  const theme = useTheme();
  const isBigScreen = useBigScreen();
  const realActions = [];
  for (const action of props.action.actions) {
    if (action.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, action.gatedOn)) {
        continue;
      }
    }
    realActions.push(action);
  }
  function handleMenuItemClick(index) {
    setSelectedIndex(index);
    setOpen(false);
  }
  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }
  if (realActions.length === 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 759,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(ButtonGroup_default, { ref: anchorRef, children: [
      /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          disabled: !props.inputsEnabled || realActions[selectedIndex].disabled,
          startIcon: realActions[selectedIndex].icon,
          type: "submit",
          name: "intent",
          value: realActions[selectedIndex].value,
          id: realActions[selectedIndex].id,
          children: getRealText(
            realActions[selectedIndex].text || "",
            props.isInDialog,
            isBigScreen
          )
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 765,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          size: "small",
          disabled: !props.inputsEnabled,
          onClick: () => setOpen((prevOpen) => !prevOpen),
          children: /* @__PURE__ */ jsxDEV(ArrowDropDown_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 784,
            columnNumber: 11
          }, this)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 779,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 764,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Popper_default,
      {
        sx: {
          zIndex: theme.zIndex.appBar + 20,
          backgroundColor: theme.palette.background.paper
        },
        open,
        anchorEl: anchorRef.current,
        disablePortal: !isBigScreen,
        transition: true,
        children: ({ TransitionProps, placement }) => /* @__PURE__ */ jsxDEV(
          Grow_default,
          {
            ...TransitionProps,
            style: {
              transformOrigin: placement === "bottom" ? "center top" : "center bottom"
            },
            children: /* @__PURE__ */ jsxDEV(Paper_default, { children: /* @__PURE__ */ jsxDEV(ClickAwayListener, { onClickAway: handleClose, children: /* @__PURE__ */ jsxDEV(MenuList_default, { id: "split-button-menu", autoFocusItem: true, children: realActions.map((option, index) => /* @__PURE__ */ jsxDEV(
              MenuItem_default,
              {
                id: option.id,
                selected: index === selectedIndex,
                disabled: !props.inputsEnabled || option.disabled,
                onClick: () => handleMenuItemClick(index),
                children: option.text
              },
              `action-multiple-${index}`,
              false,
              {
                fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
                lineNumber: 809,
                columnNumber: 21
              },
              this
            )) }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
              lineNumber: 807,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
              lineNumber: 806,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
              lineNumber: 805,
              columnNumber: 13
            }, this)
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 798,
            columnNumber: 11
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 787,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 763,
    columnNumber: 5
  }, this);
}
function ButtonSingleView(props) {
  const isBigScreen = useBigScreen();
  if (props.action.gatedOn) {
    const workspace = props.topLevelInfo.workspace;
    if (!isWorkspaceFeatureAvailable(workspace, props.action.gatedOn)) {
      return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 842,
        columnNumber: 14
      }, this);
    }
  }
  return /* @__PURE__ */ jsxDEV(
    Button_default,
    {
      variant: props.action.highlight ? "contained" : "outlined",
      disabled: !props.inputsEnabled || props.action.disabled,
      startIcon: props.action.icon,
      onClick: props.action.onClick,
      children: getRealText(props.action.text || "", props.isInDialog, isBigScreen)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 847,
      columnNumber: 5
    },
    this
  );
}
function FilterFewOptionsView(props) {
  switch (props.action.approach) {
    case "spread":
      return /* @__PURE__ */ jsxDEV(FilterFewOptionsSpreadView, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 869,
        columnNumber: 14
      }, this);
    case "compact":
      return /* @__PURE__ */ jsxDEV(FilterFewOptionsCompactView, { ...props }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 871,
        columnNumber: 14
      }, this);
  }
}
function FilterFewOptionsSpreadView(props) {
  const isBigScreen = useBigScreen();
  const [selected, setSelected] = (0, import_react2.useState)(props.action.defaultOption);
  const realOptions = [];
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
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 891,
      columnNumber: 12
    }, this);
  }
  if (props.action.hideIfOneOption && realOptions.length === 1) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 895,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(ButtonGroup_default, { orientation: props.orientation, children: props.action.options.map((option, index) => {
    if (option.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, option.gatedOn)) {
        return /* @__PURE__ */ jsxDEV(import_react2.Fragment, {}, `filter-few-options-${index}`, false, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 904,
          columnNumber: 20
        }, this);
      }
    }
    return /* @__PURE__ */ jsxDEV(
      Button_default,
      {
        variant: option.value === selected ? "contained" : "outlined",
        disabled: !props.inputsEnabled || option.disabled,
        startIcon: option.icon,
        onClick: () => {
          setSelected(option.value);
          props.action.onSelect(option.value);
        },
        children: getRealText(option.text, props.isInDialog, isBigScreen)
      },
      `filter-few-options-${index}`,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 909,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 899,
    columnNumber: 5
  }, this);
}
function FilterFewOptionsCompactView(props) {
  const realOptions = [];
  for (const option of props.action.options) {
    if (option.gatedOn) {
      const workspace = props.topLevelInfo.workspace;
      if (!isWorkspaceFeatureAvailable(workspace, option.gatedOn)) {
        continue;
      }
    }
    realOptions.push(option);
  }
  const [selectedIndex, setSelectedIndex] = (0, import_react2.useState)(
    Math.max(
      0,
      realOptions.findIndex((opt) => opt.value === props.action.defaultOption)
    )
  );
  if (realOptions.length === 0) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 947,
      columnNumber: 12
    }, this);
  }
  if (props.action.hideIfOneOption && realOptions.length === 1) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 951,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(FormControl_default, { size: "small", children: [
    /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "section-action-filter-few-multiple-compact-label", children: props.action.title }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 956,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      Select_default,
      {
        labelId: "section-action-filter-few-multiple-compact-label",
        id: "section-action-filter-few-multiple-compact",
        label: props.action.title,
        readOnly: !props.inputsEnabled,
        value: selectedIndex,
        onChange: (e) => {
          setSelectedIndex(e.target.value);
          props.action.onSelect(realOptions[e.target.value].value);
        },
        renderValue: () => /* @__PURE__ */ jsxDEV(Box_default, { sx: { display: "flex", flexWrap: "wrap", gap: 0.5 }, children: [
          realOptions[selectedIndex].icon,
          " ",
          realOptions[selectedIndex].text
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 970,
          columnNumber: 11
        }, this),
        children: realOptions.map((option, index) => /* @__PURE__ */ jsxDEV(
          MenuItem_default,
          {
            value: index,
            disabled: option.disabled,
            children: [
              option.icon,
              " ",
              option.text
            ]
          },
          `filter-few-multiple-${index}`,
          true,
          {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 976,
            columnNumber: 11
          },
          this
        ))
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 959,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 955,
    columnNumber: 5
  }, this);
}
function FilterManyOptionsView(props) {
  const icon = /* @__PURE__ */ jsxDEV(CheckBoxOutlineBlank_default, { fontSize: "small" }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 998,
    columnNumber: 16
  }, this);
  const checkedIcon = /* @__PURE__ */ jsxDEV(CheckBox_default, { fontSize: "small" }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
    lineNumber: 999,
    columnNumber: 23
  }, this);
  const [selected, setSelected] = (0, import_react2.useState)([]);
  const realOptions = [];
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
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 1015,
      columnNumber: 12
    }, this);
  }
  if (props.action.hideIfOneOption && realOptions.length === 1) {
    return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 1019,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(
    Autocomplete_default,
    {
      multiple: true,
      disableCloseOnSelect: true,
      size: "small",
      options: realOptions,
      limitTags: 2,
      getOptionLabel: (option) => option.text,
      value: selected,
      onChange: (_, selected2) => {
        setSelected(selected2);
        props.action.onSelect(selected2.map((option) => option.value));
      },
      isOptionEqualToValue: (option, value) => option.value === value.value,
      getOptionDisabled: (option) => option.disabled || false,
      renderOption: (props2, option, { selected: selected2 }) => /* @__PURE__ */ jsxDEV("li", { ...props2, children: [
        /* @__PURE__ */ jsxDEV(
          Checkbox_default,
          {
            icon,
            checkedIcon,
            style: { marginRight: 8 },
            checked: selected2,
            disabled: option.disabled || false
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
            lineNumber: 1039,
            columnNumber: 11
          },
          this
        ),
        option.text
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
        lineNumber: 1038,
        columnNumber: 9
      }, this),
      sx: [autocompleteSingleLineSx, { minWidth: "180px" }],
      renderInput: (params) => /* @__PURE__ */ jsxDEV(
        TextField_default,
        {
          ...params,
          multiline: false,
          label: props.action.title,
          placeholder: props.action.title
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
          lineNumber: 1051,
          columnNumber: 9
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/section-actions.tsx",
      lineNumber: 1023,
      columnNumber: 5
    },
    this
  );
}
function getRealText(text, isInDialog, isBigScreen) {
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

export {
  autocompleteSingleLineSx,
  NavSingle,
  NavMultipleSpread,
  NavMultipleCompact,
  ActionSingle,
  ActionMultipleSpread,
  ButtonSingle,
  FilterFewOptionsSpread,
  FilterFewOptionsCompact,
  FilterManyOptions,
  SectionActions
};
//# sourceMappingURL=/build/_shared/chunk-4OJDBATO.js.map
