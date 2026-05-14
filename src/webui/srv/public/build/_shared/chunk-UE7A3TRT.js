import {
  parseEntityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  Launch_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Button_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  Link
} from "/build/_shared/chunk-VVGD4GL7.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/time_events/component/source-link.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function TimeEventSourceLink(props) {
  const { theType, refId } = parseEntityLinkStd(props.timeEvent.owner);
  switch (theType) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 26,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/calendar/schedule/event-in-day/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 25,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.BIG_PLAN: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 40,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/big-plans/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 39,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.TODO_TASK: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 54,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/todos/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 53,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.HABIT: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 68,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/habits/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 67,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.CHORE: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 82,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/chores/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 81,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 96,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/time-plans/no-parent/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 95,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 110,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/calendar/schedule/event-full-days/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 109,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.OCCASION: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 124,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/prm/persons/${props.extraInfo?.person?.ref_id}/occasions/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 123,
          columnNumber: 9
        },
        this
      );
    }
    case import_webapi_client.NamedEntityTag.VACATION: {
      return /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          startIcon: /* @__PURE__ */ jsxDEV(Launch_default, {}, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
            lineNumber: 138,
            columnNumber: 22
          }, this),
          variant: "outlined",
          size: "small",
          component: Link,
          to: `/app/workspace/vacations/${refId}`,
          children: "Link"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/component/source-link.tsx",
          lineNumber: 137,
          columnNumber: 9
        },
        this
      );
    }
    default: {
      throw new Error(`Unknown time event owner type: ${theType}`);
    }
  }
}

export {
  TimeEventSourceLink
};
//# sourceMappingURL=/build/_shared/chunk-UE7A3TRT.js.map
