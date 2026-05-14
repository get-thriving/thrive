import {
  Divider_default,
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/infra/component/standard-divider.tsx
function StandardDivider(props) {
  return /* @__PURE__ */ jsxDEV(
    Divider_default,
    {
      variant: "fullWidth",
      sx: {
        "& .MuiDivider-wrapper": {
          width: "100%"
        }
      },
      children: /* @__PURE__ */ jsxDEV(
        Typography_default,
        {
          variant: props.size === "small" ? "subtitle2" : props.size === "medium" ? "subtitle2" : "h6",
          sx: {
            overflow: "hidden",
            textOverflow: "ellipsis"
          },
          children: props.title
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/infra/component/standard-divider.tsx",
          lineNumber: 18,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/standard-divider.tsx",
      lineNumber: 10,
      columnNumber: 5
    },
    this
  );
}

export {
  StandardDivider
};
//# sourceMappingURL=/build/_shared/chunk-PE4INIRM.js.map
