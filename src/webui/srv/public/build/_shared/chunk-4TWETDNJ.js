import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/inbox_tasks/status.ts
var import_webapi_client = __toESM(require_dist(), 1);
function inboxTaskStatusIcon(status) {
  switch (status) {
    case import_webapi_client.InboxTaskStatus.NOT_STARTED:
      return "\u{1F4E5}";
    case import_webapi_client.InboxTaskStatus.IN_PROGRESS:
      return "\u{1F6A7}";
    case import_webapi_client.InboxTaskStatus.BLOCKED:
      return "\u{1F6A7}";
    case import_webapi_client.InboxTaskStatus.NOT_DONE:
      return "\u26D4";
    case import_webapi_client.InboxTaskStatus.DONE:
      return "\u2705";
  }
}
function inboxTaskStatusName(status) {
  switch (status) {
    case import_webapi_client.InboxTaskStatus.NOT_STARTED:
      return "Not Started";
    case import_webapi_client.InboxTaskStatus.IN_PROGRESS:
      return "In Progress";
    case import_webapi_client.InboxTaskStatus.BLOCKED:
      return "Blocked";
    case import_webapi_client.InboxTaskStatus.NOT_DONE:
      return "Not Done";
    case import_webapi_client.InboxTaskStatus.DONE:
      return "Done";
  }
}
function isCompleted(status) {
  return status === import_webapi_client.InboxTaskStatus.DONE || status === import_webapi_client.InboxTaskStatus.NOT_DONE;
}

export {
  inboxTaskStatusIcon,
  inboxTaskStatusName,
  isCompleted
};
//# sourceMappingURL=/build/_shared/chunk-4TWETDNJ.js.map
