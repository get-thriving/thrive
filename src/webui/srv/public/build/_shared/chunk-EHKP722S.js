import {
  occasionTimeEventName
} from "/build/_shared/chunk-24RA7B23.js";
import {
  parseEntityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/sub/time_events/sub/full_days_block/component/card.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function TimeEventFullDaysBlockCard(props) {
  let name = null;
  const { theType } = parseEntityLinkStd(props.entry.time_event.owner);
  switch (theType) {
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS: {
      const entry = props.entry.entry;
      name = entry.event.name;
      break;
    }
    case import_webapi_client.NamedEntityTag.OCCASION: {
      const entry = props.entry.entry;
      name = occasionTimeEventName(
        entry.occasion_time_event,
        entry.contact,
        entry.occasion
      );
      break;
    }
    case import_webapi_client.NamedEntityTag.VACATION: {
      const entry = props.entry.entry;
      name = entry.vacation.name;
      break;
    }
    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
  }
  return /* @__PURE__ */ jsxDEV(
    EntityCard,
    {
      entityId: `time-event-full-days-block-${props.entry.time_event.ref_id}`,
      showAsArchived: props.entry.time_event.archived,
      children: /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/time-event/full-days-block/${props.entry.time_event.ref_id}`,
          children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name }, void 0, false, {
            fileName: "../core/jupiter/core/common/sub/time_events/sub/full_days_block/component/card.tsx",
            lineNumber: 58,
            columnNumber: 9
          }, this)
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/sub/full_days_block/component/card.tsx",
          lineNumber: 55,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/time_events/sub/full_days_block/component/card.tsx",
      lineNumber: 51,
      columnNumber: 5
    },
    this
  );
}

// ../core/jupiter/core/common/sub/time_events/sub/full_days_block/component/stack.tsx
function TimeEventFullDaysBlockStack(props) {
  const actions = void 0;
  return /* @__PURE__ */ jsxDEV(
    SectionCard,
    {
      id: "time-event-full-days-block-stack",
      title: props.title,
      actions,
      children: props.entries.map((entry) => /* @__PURE__ */ jsxDEV(
        TimeEventFullDaysBlockCard,
        {
          entry
        },
        `time-event-full-days-block-${entry.time_event.ref_id}`,
        false,
        {
          fileName: "../core/jupiter/core/common/sub/time_events/sub/full_days_block/component/stack.tsx",
          lineNumber: 25,
          columnNumber: 9
        },
        this
      ))
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/sub/time_events/sub/full_days_block/component/stack.tsx",
      lineNumber: 19,
      columnNumber: 5
    },
    this
  );
}

export {
  TimeEventFullDaysBlockStack
};
//# sourceMappingURL=/build/_shared/chunk-EHKP722S.js.map
