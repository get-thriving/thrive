import {
  bigPlanStatusIcon,
  bigPlanStatusName
} from "/build/_shared/chunk-P7WFXMQY.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/big_plans/component/status-tag.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function BigPlanStatusTag(props) {
  const format = props.format ?? "name";
  const tagName = format === "name" ? bigPlanStatusName(props.status) : bigPlanStatusIcon(props.status);
  const tagClass = statusToClass(props.status);
  if (format === "name") {
    return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
      fileName: "../core/jupiter/core/big_plans/component/status-tag.tsx",
      lineNumber: 19,
      columnNumber: 12
    }, this);
  } else {
    return /* @__PURE__ */ jsxDEV("span", { style: { paddingRight: "0.5rem" }, children: tagName }, void 0, false, {
      fileName: "../core/jupiter/core/big_plans/component/status-tag.tsx",
      lineNumber: 21,
      columnNumber: 12
    }, this);
  }
}
function statusToClass(status) {
  switch (status) {
    case import_webapi_client.BigPlanStatus.NOT_STARTED:
      return "info";
    case import_webapi_client.BigPlanStatus.IN_PROGRESS:
      return "warning";
    case import_webapi_client.BigPlanStatus.BLOCKED:
      return "warning";
    case import_webapi_client.BigPlanStatus.DONE:
      return "success";
    case import_webapi_client.BigPlanStatus.NOT_DONE:
      return "error";
  }
}

export {
  BigPlanStatusTag
};
//# sourceMappingURL=/build/_shared/chunk-W6KI7GPI.js.map
