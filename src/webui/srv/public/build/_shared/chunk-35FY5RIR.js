import {
  DocsHelp
} from "/build/_shared/chunk-2EW4TTPM.js";
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
  Form,
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";

// ../core/jupiter/core/infra/component/entity-no-nothing-card.tsx
function EntityNoNothingCard(props) {
  return /* @__PURE__ */ jsxDEV(Card_default, { children: [
    /* @__PURE__ */ jsxDEV(CardHeader_default, { title: props.title }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
      lineNumber: 25,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CardContent_default, { children: [
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: props.message }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
        lineNumber: 27,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: [
        "Or you can learn more in our docs",
        /* @__PURE__ */ jsxDEV(DocsHelp, { subject: props.helpSubject, size: "small" }, void 0, false, {
          fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
          lineNumber: 31,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
        lineNumber: 29,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CardActions_default, { children: [
      props.newEntityLocations && /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          size: "small",
          component: Link,
          to: props.newEntityLocations,
          children: "Add New"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
          lineNumber: 36,
          columnNumber: 11
        },
        this
      ),
      props.newEntityAction && /* @__PURE__ */ jsxDEV(Form, { method: "post", children: /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          size: "small",
          type: "submit",
          name: "intent",
          value: props.newEntityAction,
          children: "Add New"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
          lineNumber: 47,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
        lineNumber: 46,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
      lineNumber: 34,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/entity-no-nothing-card.tsx",
    lineNumber: 24,
    columnNumber: 5
  }, this);
}

export {
  EntityNoNothingCard
};
//# sourceMappingURL=/build/_shared/chunk-35FY5RIR.js.map
