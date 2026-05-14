import {
  inboxTaskStatusName
} from "/build/_shared/chunk-4TWETDNJ.js";
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

// ../core/jupiter/core/common/sub/inbox_tasks/component/status-tag.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function InboxTaskStatusTag(props) {
  const tagName = inboxTaskStatusName(props.status);
  const tagClass = statusToClass(props.status);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/common/sub/inbox_tasks/component/status-tag.tsx",
    lineNumber: 13,
    columnNumber: 10
  }, this);
}
function statusToClass(status) {
  switch (status) {
    case import_webapi_client.InboxTaskStatus.NOT_STARTED:
      return "primary";
    case import_webapi_client.InboxTaskStatus.IN_PROGRESS:
      return "info";
    case import_webapi_client.InboxTaskStatus.BLOCKED:
      return "warning";
    case import_webapi_client.InboxTaskStatus.DONE:
      return "success";
    case import_webapi_client.InboxTaskStatus.NOT_DONE:
      return "error";
  }
}

export {
  InboxTaskStatusTag
};
//# sourceMappingURL=/build/_shared/chunk-5CBAK2HS.js.map
