import {
  Button_default,
  CardActions_default,
  CardContent_default,
  CardHeader_default,
  Card_default,
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";

// ../core/jupiter/core/common/sub/inbox_tasks/component/no-tasks-card.tsx
function InboxTasksNoTasksCard(props) {
  return /* @__PURE__ */ jsxDEV(Card_default, { children: [
    /* @__PURE__ */ jsxDEV(CardHeader_default, { title: "You have to start somewhere" }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-tasks-card.tsx",
      lineNumber: 20,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CardContent_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: [
      "There are no inbox tasks to show. You can generate some new tasks",
      props.parentNewLocations ? `, or create a new ${props.parent}` : "",
      "."
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-tasks-card.tsx",
      lineNumber: 22,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-tasks-card.tsx",
      lineNumber: 21,
      columnNumber: 7
    }, this),
    props.parentNewLocations && props.parentLabel && /* @__PURE__ */ jsxDEV(CardActions_default, { children: /* @__PURE__ */ jsxDEV(
      Button_default,
      {
        variant: "contained",
        size: "small",
        component: Link,
        to: props.parentNewLocations,
        children: props.parentLabel
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-tasks-card.tsx",
        lineNumber: 29,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-tasks-card.tsx",
      lineNumber: 28,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/no-tasks-card.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, this);
}

export {
  InboxTasksNoTasksCard
};
//# sourceMappingURL=/build/_shared/chunk-Y2XMZIJC.js.map
