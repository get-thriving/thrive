import {
  CardActions_default,
  CardContent_default,
  Card_default,
  Chip_default,
  Stack_default,
  styled_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Form
} from "/build/_shared/chunk-VVGD4GL7.js";

// ../core/jupiter/core/infra/component/section-card.tsx
function SectionCard(props) {
  const actionsPosition = props.actionsPosition ?? 0 /* ABOVE */;
  return /* @__PURE__ */ jsxDEV(StyledCard, { id: props.id, children: /* @__PURE__ */ jsxDEV(Form, { method: props.method ?? "post", children: [
    /* @__PURE__ */ jsxDEV(SectionHeader, { children: [
      /* @__PURE__ */ jsxDEV(SectionHeaderContent, { children: /* @__PURE__ */ jsxDEV(SectionTitle, { label: props.title }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-card.tsx",
        lineNumber: 33,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/section-card.tsx",
        lineNumber: 32,
        columnNumber: 11
      }, this),
      actionsPosition === 0 /* ABOVE */ && props.actions
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/infra/component/section-card.tsx",
      lineNumber: 31,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(CardContent_default, { children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, children: props.children }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-card.tsx",
      lineNumber: 38,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-card.tsx",
      lineNumber: 37,
      columnNumber: 9
    }, this),
    actionsPosition === 1 /* BELOW */ && /* @__PURE__ */ jsxDEV(CardActions_default, { children: props.actions }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/section-card.tsx",
      lineNumber: 41,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/infra/component/section-card.tsx",
    lineNumber: 30,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/section-card.tsx",
    lineNumber: 29,
    columnNumber: 5
  }, this);
}
var SectionHeader = styled_default("div")(() => ({
  display: "flex",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "center",
  height: "3rem",
  width: "100%"
}));
var StyledCard = styled_default(Card_default)(() => ({
  position: "relative",
  overflow: "visible"
}));
var SectionHeaderContent = styled_default("div")(() => ({
  display: "flex",
  flex: "1 1 auto",
  minWidth: "0",
  flexWrap: "nowrap",
  justifyContent: "space-between",
  alignItems: "center",
  height: "3rem"
}));
var SectionTitle = styled_default(Chip_default)(() => ({
  position: "relative",
  top: "-0.05rem",
  fontSize: "1.5rem",
  fontVariant: "small-caps",
  height: "100%",
  left: "-0.05rem",
  paddingTop: "0.05rem",
  paddingBottom: "0.05rem",
  paddingRight: "2rem",
  paddingLeft: "0.5rem",
  borderRadius: "0px",
  borderBottomRightRadius: "4px"
}));

export {
  SectionCard
};
//# sourceMappingURL=/build/_shared/chunk-5BGG5EU6.js.map
