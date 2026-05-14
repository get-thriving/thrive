import {
  useHydrated
} from "/build/_shared/chunk-A6MOWSJE.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/infra/component/client-only.tsx
function ClientOnly({ children, fallback = null }) {
  const hydrated = useHydrated();
  if (!hydrated) {
    return /* @__PURE__ */ jsxDEV(Fragment, { children: fallback }, void 0, false, {
      fileName: "../core/jupiter/core/infra/component/client-only.tsx",
      lineNumber: 12,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: typeof children === "function" ? children() : children }, void 0, false, {
    fileName: "../core/jupiter/core/infra/component/client-only.tsx",
    lineNumber: 15,
    columnNumber: 10
  }, this);
}

export {
  ClientOnly
};
//# sourceMappingURL=/build/_shared/chunk-Z3RPM676.js.map
