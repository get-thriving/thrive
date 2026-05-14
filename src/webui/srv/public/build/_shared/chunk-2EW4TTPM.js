import {
  HelpCenter_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  IconButton_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/infra/component/docs-help.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);
function DocsHelp(props) {
  const serviceProperties = (0, import_react.useContext)(ServicePropertiesContext);
  const helpUrl = new URL(
    subjectToUrl(props.subject),
    serviceProperties.docsUrl
  );
  return /* @__PURE__ */ jsxDEV(
    IconButton_default,
    {
      id: props.theId,
      component: "a",
      size: props.size,
      disableRipple: true,
      color: "inherit",
      href: helpUrl.toString(),
      target: "_blank",
      children: /* @__PURE__ */ jsxDEV(HelpCenter_default, { fontSize: props.size }, void 0, false, {
        fileName: "../core/jupiter/core/infra/component/docs-help.tsx",
        lineNumber: 32,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/docs-help.tsx",
      lineNumber: 23,
      columnNumber: 5
    },
    this
  );
}
function subjectToUrl(subject) {
  switch (subject) {
    case import_webapi_client.DocsHelpSubject.ROOT:
      return "";
    case import_webapi_client.DocsHelpSubject.HOME:
      return "concepts/home";
    case import_webapi_client.DocsHelpSubject.GAMIFICATION:
      return "concepts/gamification";
    case import_webapi_client.DocsHelpSubject.TODOS:
      return "concepts/todos";
    case import_webapi_client.DocsHelpSubject.WORKING_MEM:
      return "concepts/working-mem";
    case import_webapi_client.DocsHelpSubject.TIME_PLANS:
      return "concepts/time-plans";
    case import_webapi_client.DocsHelpSubject.SCHEDULE:
      return "concepts/calendar";
    case import_webapi_client.DocsHelpSubject.HABITS:
      return "concepts/habits";
    case import_webapi_client.DocsHelpSubject.CHORES:
      return "concepts/chores";
    case import_webapi_client.DocsHelpSubject.DOCS:
      return "concepts/docs";
    case import_webapi_client.DocsHelpSubject.BIG_PLANS:
      return "concepts/big-plans";
    case import_webapi_client.DocsHelpSubject.JOURNALS:
      return "concepts/journals";
    case import_webapi_client.DocsHelpSubject.VACATIONS:
      return "concepts/vacations";
    case import_webapi_client.DocsHelpSubject.LIFE_PLAN:
      return "concepts/life-plan";
    case import_webapi_client.DocsHelpSubject.LIFE_PLAN_ASPECTS:
      return "concepts/life-plan/aspects";
    case import_webapi_client.DocsHelpSubject.LIFE_PLAN_CHAPTERS:
      return "concepts/life-plan/chapters";
    case import_webapi_client.DocsHelpSubject.LIFE_PLAN_GOALS:
      return "concepts/life-plan/goals";
    case import_webapi_client.DocsHelpSubject.LIFE_PLAN_MILESTONES:
      return "concepts/life-plan/milestones";
    case import_webapi_client.DocsHelpSubject.LIFE_PLAN_VISIONS:
      return "concepts/life-plan/visions";
    case import_webapi_client.DocsHelpSubject.SMART_LISTS:
      return "concepts/smart-lists";
    case import_webapi_client.DocsHelpSubject.METRICS:
      return "concepts/metrics";
    case import_webapi_client.DocsHelpSubject.PRM:
      return "concepts/prm/prm";
    case import_webapi_client.DocsHelpSubject.PRM_CIRCLES:
      return "concepts/prm/circles";
    case import_webapi_client.DocsHelpSubject.PRM_PERSONS:
      return "concepts/prm/persons";
    case import_webapi_client.DocsHelpSubject.PRM_OCCASIONS:
      return "concepts/prm/occasions";
    case import_webapi_client.DocsHelpSubject.SLACK_TASKS:
      return "concepts/slack-tasks";
    case import_webapi_client.DocsHelpSubject.EMAIL_TASKS:
      return "concepts/email-tasks";
    case import_webapi_client.DocsHelpSubject.API:
      return "concepts/api";
    case import_webapi_client.DocsHelpSubject.MCP:
      return "concepts/mcp";
    case import_webapi_client.DocsHelpSubject.SELF_HOSTING:
      return "how-tos/self-hosting";
  }
}

export {
  DocsHelp
};
//# sourceMappingURL=/build/_shared/chunk-2EW4TTPM.js.map
