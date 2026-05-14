import {
  motion,
  useMotionValue,
  useTransform
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  CheckCircle_default,
  Delete_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  CardActions_default,
  CardContent_default,
  Card_default,
  IconButton_default,
  styled_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";

// ../core/jupiter/core/infra/component/standard-link.tsx
var StandardLink = styled_default(
  Link
)(({ theme, light, singleline, inline }) => ({
  textDecoration: "none",
  width: inline === "true" ? void 0 : "100%",
  minWidth: inline === "true" ? void 0 : 0,
  maxWidth: inline === "true" ? void 0 : "100%",
  boxSizing: "border-box",
  color: light === "true" ? theme.palette.info.contrastText : theme.palette.info.dark,
  ":visited": {
    color: light === "true" ? theme.palette.info.contrastText : theme.palette.info.dark
  },
  display: "flex",
  gap: "0.5rem",
  flexGrow: inline === "true" ? void 0 : "1",
  flexWrap: singleline === "true" ? void 0 : "wrap",
  padding: inline === "true" ? void 0 : "16px",
  alignItems: "center",
  WebkitTapHighlightColor: "transparent"
}));
var FakeLink = styled_default("span")(
  ({ theme, inline, singleline, light }) => ({
    textDecoration: "none",
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    boxSizing: "border-box",
    color: light === "true" ? theme.palette.info.contrastText : theme.palette.info.dark,
    ":visited": {
      color: light === "true" ? theme.palette.info.contrastText : theme.palette.info.dark
    },
    display: "flex",
    gap: "0.5rem",
    flexWrap: singleline === "true" ? void 0 : "wrap",
    padding: inline === "true" ? void 0 : "16px",
    alignItems: "center",
    WebkitTapHighlightColor: "transparent"
  })
);

// ../core/jupiter/core/infra/component/entity-card.tsx
var SWIPE_THRESHOLD = 200;
var SWIPE_COMPLETE_THRESHOLD = 150;
function EntityCard(props) {
  const isBigScreen = useBigScreen();
  const backgroundHint = props.backgroundHint || "neutral";
  const theme = useTheme();
  function markDoneHandler() {
    if (props.allowMarkDone && props.onMarkDone) {
      props.onMarkDone();
    }
  }
  function markNotDoneHandler() {
    if (props.allowMarkNotDone && props.onMarkNotDone) {
      props.onMarkNotDone();
    }
  }
  function onDragEnd(event, info) {
    if (info.offset.x < -SWIPE_COMPLETE_THRESHOLD) {
      if (props.allowMarkDone && props.onMarkDone) {
        props.onMarkDone();
      }
    } else if (info.offset.x < SWIPE_COMPLETE_THRESHOLD) {
    } else {
      if (props.allowMarkNotDone && props.onMarkNotDone) {
        props.onMarkNotDone();
      }
    }
  }
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-SWIPE_COMPLETE_THRESHOLD, 0, SWIPE_COMPLETE_THRESHOLD],
    [
      theme.palette.success.light,
      theme.palette.background.paper,
      theme.palette.warning.light
    ]
  );
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      drag: props.allowSwipe ? "x" : false,
      whileDrag: { scale: 1.1 },
      dragSnapToOrigin: true,
      dragElastic: 0.1,
      dragConstraints: {
        left: props.allowMarkDone ? -SWIPE_THRESHOLD : 0,
        right: props.allowMarkNotDone ? SWIPE_THRESHOLD : 0
      },
      onDragEnd,
      style: { x, background },
      animate: { opacity: 1 },
      exit: { opacity: 0, height: "0px", marginTop: "0px" },
      transition: { duration: 1 },
      children: /* @__PURE__ */ jsxDEV(
        Card_default,
        {
          id: props.entityId,
          sx: {
            display: "flex",
            marginLeft: props.indent ? `${props.indent}rem` : "0",
            justifyContent: "space-between",
            alignItems: "center",
            touchAction: "pan-y",
            position: "relative",
            boxShadow: props.allowSelect && props.selected ? `inset 0 0 4px ${theme.palette.primary.main};` : void 0,
            backgroundColor: backgroundHint === "neutral" ? props.showAsArchived ? theme.palette.action.hover : "transparent" : backgroundHint === "success" ? `${theme.palette.success.light}22` : backgroundHint === "warning" ? `${theme.palette.warning.light}22` : `${theme.palette.error.light}22`
          },
          onClick: props.onClick,
          children: [
            /* @__PURE__ */ jsxDEV(
              CardContent_default,
              {
                sx: {
                  flexGrow: "1",
                  minWidth: 0,
                  padding: "0px",
                  boxSizing: "border-box"
                },
                children: props.children
              },
              void 0,
              false,
              {
                fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
                lineNumber: 127,
                columnNumber: 9
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              CardActions_default,
              {
                sx: {
                  display: "flex",
                  flexDirection: props.markButtonsStyle || "row",
                  alignItems: "flex-end",
                  padding: "0px"
                },
                children: [
                  props.extraControls,
                  isBigScreen && props.allowMarkDone && /* @__PURE__ */ jsxDEV(IconButton_default, { size: "medium", color: "success", onClick: markDoneHandler, children: /* @__PURE__ */ jsxDEV(CheckCircle_default, { fontSize: "medium" }, void 0, false, {
                    fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
                    lineNumber: 149,
                    columnNumber: 15
                  }, this) }, void 0, false, {
                    fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
                    lineNumber: 148,
                    columnNumber: 13
                  }, this),
                  props.allowMarkNotDone && /* @__PURE__ */ jsxDEV(
                    IconButton_default,
                    {
                      size: "medium",
                      color: "warning",
                      onClick: markNotDoneHandler,
                      children: /* @__PURE__ */ jsxDEV(Delete_default, { fontSize: "medium" }, void 0, false, {
                        fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
                        lineNumber: 158,
                        columnNumber: 15
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
                      lineNumber: 153,
                      columnNumber: 13
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
                lineNumber: 138,
                columnNumber: 9
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
          lineNumber: 101,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
      lineNumber: 86,
      columnNumber: 5
    },
    this
  );
}
function EntityLink(props) {
  if (!(props.block === true)) {
    return /* @__PURE__ */ jsxDEV(
      StandardLink,
      {
        onMouseDown: (e) => e.preventDefault(),
        to: props.to,
        inline: props.inline === true ? "true" : "false",
        light: props.light === true ? "true" : "false",
        singleline: props.singleLine ? "true" : "false",
        children: props.children
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
        lineNumber: 178,
        columnNumber: 7
      },
      this
    );
  } else {
    return /* @__PURE__ */ jsxDEV(
      EntityFakeLink,
      {
        inline: props.inline,
        light: props.light,
        singleLine: props.singleLine,
        children: props.children
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
        lineNumber: 190,
        columnNumber: 7
      },
      this
    );
  }
}
function EntityFakeLink(props) {
  return /* @__PURE__ */ jsxDEV(
    FakeLink,
    {
      inline: props.inline ? "true" : "false",
      light: props.light ? "true" : "false",
      singleline: props.singleLine === true ? "true" : "false",
      children: props.children
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/entity-card.tsx",
      lineNumber: 209,
      columnNumber: 5
    },
    this
  );
}

export {
  StandardLink,
  EntityCard,
  EntityLink,
  EntityFakeLink
};
//# sourceMappingURL=/build/_shared/chunk-MY6WUQK6.js.map
