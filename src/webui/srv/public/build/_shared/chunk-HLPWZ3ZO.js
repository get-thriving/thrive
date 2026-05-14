import {
  periodName
} from "/build/_shared/chunk-HVU6TG3B.js";
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

// ../core/jupiter/core/common/component/period-tag.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function PeriodTag(props) {
  const tagName = periodName(props.period);
  const tagClass = periodToClass(props.period);
  return /* @__PURE__ */ jsxDEV(SlimChip, { label: tagName, color: tagClass }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/period-tag.tsx",
    lineNumber: 13,
    columnNumber: 10
  }, this);
}
function periodToClass(period) {
  switch (period) {
    case import_webapi_client.RecurringTaskPeriod.DAILY:
      return "info";
    case import_webapi_client.RecurringTaskPeriod.WEEKLY:
      return "success";
    case import_webapi_client.RecurringTaskPeriod.MONTHLY:
      return "primary";
    case import_webapi_client.RecurringTaskPeriod.QUARTERLY:
      return "warning";
    case import_webapi_client.RecurringTaskPeriod.YEARLY:
      return "error";
  }
}

export {
  PeriodTag
};
//# sourceMappingURL=/build/_shared/chunk-HLPWZ3ZO.js.map
