import {
  timeEventInDayBlockOwnerTheType
} from "/build/_shared/chunk-24RA7B23.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/card.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function TimeEventInDayBlockCard(props) {
  const isBigScreen = useBigScreen();
  let name = null;
  switch (timeEventInDayBlockOwnerTheType(props.entry.time_event_in_tz)) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      const entry = props.entry.entry;
      name = entry.event.name;
      break;
    }
    case import_webapi_client.NamedEntityTag.BIG_PLAN: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }
    case import_webapi_client.NamedEntityTag.TODO_TASK: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }
    case import_webapi_client.NamedEntityTag.HABIT: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }
    case import_webapi_client.NamedEntityTag.CHORE: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }
    case import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY: {
      name = `On ${props.entry.time_event_in_tz.start_date} at ${props.entry.time_event_in_tz.start_time_in_day}`;
      break;
    }
    default:
      throw new Error("Unknown time event in day owner type");
  }
  return /* @__PURE__ */ jsxDEV(
    EntityCard,
    {
      entityId: `time-event-in-day-block-${props.entry.time_event_in_tz.ref_id}`,
      showAsArchived: props.entry.time_event_in_tz.archived,
      children: /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/time-event/in-day-block/${props.entry.time_event_in_tz.ref_id}?date=${props.entry.time_event_in_tz.start_date}&period=${isBigScreen ? "weekly" : "daily"}`,
          children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name }, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/card.tsx",
            lineNumber: 69,
            columnNumber: 9
          }, this)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/card.tsx",
          lineNumber: 62,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/card.tsx",
      lineNumber: 58,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/stack.tsx
function TimeEventInDayBlockStack(props) {
  let actions = void 0;
  if (props.createLocation) {
    actions = /* @__PURE__ */ jsxDEV(
      SectionActions,
      {
        id: "time-event-in-day-block-stack",
        topLevelInfo: props.topLevelInfo,
        inputsEnabled: props.inputsEnabled,
        actions: [
          NavSingle({
            text: "Add",
            link: props.createLocation,
            highlight: true
          })
        ]
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/stack.tsx",
        lineNumber: 22,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDEV(
    SectionCard,
    {
      id: "time-event-in-day-block-stack",
      title: props.title,
      actions,
      children: props.entries.map((entry) => /* @__PURE__ */ jsxDEV(
        TimeEventInDayBlockCard,
        {
          entry,
          userTimezone: props.topLevelInfo.user.timezone
        },
        `time-event-in-days-block-${entry.time_event_in_tz.ref_id}`,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/stack.tsx",
          lineNumber: 44,
          columnNumber: 9
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/time_events/sub/in_day_block/component/stack.tsx",
      lineNumber: 38,
      columnNumber: 5
    },
    this
  );
}

export {
  TimeEventInDayBlockStack
};
//# sourceMappingURL=/build/_shared/chunk-H3GNRCKI.js.map
