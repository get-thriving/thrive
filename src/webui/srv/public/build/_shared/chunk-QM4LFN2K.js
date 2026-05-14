import {
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/api_key/components/api-key-view.tsx
function ApiKeyView(props) {
  const { apiKey } = props;
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: apiKey.name }, void 0, false, {
      fileName: "../core/jupiter/core/api_key/components/api-key-view.tsx",
      lineNumber: 13,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", sx: { fontFamily: "monospace" }, children: [
      "****",
      apiKey.last_four_digits
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/api_key/components/api-key-view.tsx",
      lineNumber: 14,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/api_key/components/api-key-view.tsx",
    lineNumber: 12,
    columnNumber: 5
  }, this);
}

export {
  ApiKeyView
};
//# sourceMappingURL=/build/_shared/chunk-QM4LFN2K.js.map
