import {
  TimeDiffTag
} from "/build/_shared/chunk-YNGTC4PW.js";
import {
  SlimChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  EntityFakeLink,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/component/entity-summary-link.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function EntitySummaryLink({
  summary,
  today,
  hideModifiedTime,
  removed
}) {
  const commonSequence = /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(MatchSnippet, { snippet: summary.name }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
      lineNumber: 23,
      columnNumber: 7
    }, this),
    summary.archived && summary.archived_time && /* @__PURE__ */ jsxDEV(
      TimeDiffTag,
      {
        today,
        labelPrefix: "Archived",
        collectionTime: summary.archived_time
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 25,
        columnNumber: 9
      },
      this
    ),
    !summary.archived && summary.last_modified_time && !hideModifiedTime && /* @__PURE__ */ jsxDEV(
      TimeDiffTag,
      {
        today,
        labelPrefix: "Modified",
        collectionTime: summary.last_modified_time
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 32,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
    lineNumber: 22,
    columnNumber: 5
  }, this);
  if (removed) {
    return /* @__PURE__ */ jsxDEV(EntityFakeLink, { children: [
      /* @__PURE__ */ jsxDEV(SlimChip, { label: "Removed Entity", color: "primary" }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      commonSequence
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
      lineNumber: 43,
      columnNumber: 7
    }, this);
  }
  if (summary.entity_tag === import_webapi_client.NamedEntityTag.TODO_TASK) {
    return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/todos/${summary.ref_id}`, children: [
      /* @__PURE__ */ jsxDEV(SlimChip, { label: "Todo Task", color: "primary" }, void 0, false, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 53,
        columnNumber: 9
      }, this),
      commonSequence
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
      lineNumber: 52,
      columnNumber: 7
    }, this);
  }
  switch (summary.entity_tag) {
    case import_webapi_client.NamedEntityTag.SCORE_LOG_ENTRY:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: "/nowhere", block: true, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Score Log Entry", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 63,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.WORKING_MEM:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/working-mem`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Working Mem", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 70,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 69,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.TIME_PLAN:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/time-plans/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Time Plan", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 77,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 76,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.TIME_PLAN_ACTIVITY:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/time-plans/no-parent/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Time Plan Activity", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 86,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 83,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.SCHEDULE_STREAM:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/stream/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Stream", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 95,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 92,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.SCHEDULE_EXPORT:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/export/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Export", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 104,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 101,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/event-in-day/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Event In Day", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 113,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 110,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/calendar/schedule/event-full-days/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Schedule Event Full Days", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 122,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 119,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.SCHEDULE_EXTERNAL_SYNC_LOG:
      return /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 127,
        columnNumber: 14
      }, this);
    case import_webapi_client.NamedEntityTag.HABIT:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/habits/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Habit", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 130,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.CHORE:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/chores/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Chore", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 138,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 137,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.BIG_PLAN:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/big-plans/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Big Plan", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 145,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 144,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.JOURNAL:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/journals/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Journal", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 152,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 151,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.DIR:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/docs/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Folder", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 159,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 158,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.DOC:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/docs/no-parent/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Doc", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 166,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 165,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.VACATION:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/vacations/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Vacation", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 173,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 172,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.ASPECT:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/aspects/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Aspect", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 180,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 179,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.CHAPTER:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/chapters/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Chapter", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 187,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 186,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.GOAL:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/goals/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Goal", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 194,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 193,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.MILESTONE:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/life-plan/milestones/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Milestone", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 203,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 200,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.VISION:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/life-plan/visions/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Vision", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 210,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 209,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.SMART_LIST:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/smart-lists/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Smart List", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 217,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 216,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.SMART_LIST_ITEM:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/smart-lists/no-parent/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Smart List Item", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 226,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 223,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.METRIC:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/metrics/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Metric", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 233,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 232,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.METRIC_ENTRY:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/metrics/no-parent/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Metric Entry", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 240,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 239,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.PERSON:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/prm/persons/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Persons", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 247,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 246,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.CIRCLE:
      return /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/prm/circles/${summary.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(SlimChip, { label: "Circle", color: "primary" }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 254,
          columnNumber: 11
        }, this),
        commonSequence
      ] }, void 0, true, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 253,
        columnNumber: 9
      }, this);
    case import_webapi_client.NamedEntityTag.SLACK_TASK:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/push-integrations/slack-tasks/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Slack Tasks", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 263,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 260,
          columnNumber: 9
        },
        this
      );
    case import_webapi_client.NamedEntityTag.EMAIL_TASK:
      return /* @__PURE__ */ jsxDEV(
        EntityLink,
        {
          to: `/app/workspace/push-integrations/email-tasks/${summary.ref_id}`,
          children: [
            /* @__PURE__ */ jsxDEV(SlimChip, { label: "Email Tasks", color: "primary" }, void 0, false, {
              fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
              lineNumber: 272,
              columnNumber: 11
            }, this),
            commonSequence
          ]
        },
        void 0,
        true,
        {
          fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
          lineNumber: 269,
          columnNumber: 9
        },
        this
      );
  }
}
function MatchSnippet({ snippet }) {
  const matchSnippetArr = [];
  let currentStr = "";
  let bold = false;
  for (let i = 0; i < snippet.length; i++) {
    if (bold === false && snippet.startsWith("[found]", i)) {
      if (currentStr.length > 0) {
        matchSnippetArr.push({
          text: currentStr,
          bold: false
        });
      }
      i += 6;
      currentStr = "";
      bold = true;
    } else if (bold === true && snippet.startsWith("[/found]", i)) {
      if (currentStr.length > 0) {
        matchSnippetArr.push({
          text: currentStr,
          bold: true
        });
      }
      i += 7;
      currentStr = "";
      bold = false;
    } else {
      currentStr += snippet[i];
    }
  }
  if (currentStr.length > 0) {
    matchSnippetArr.push({
      text: currentStr,
      bold
    });
  }
  return /* @__PURE__ */ jsxDEV("div", { children: matchSnippetArr.map((item, idx) => {
    if (item.bold) {
      return /* @__PURE__ */ jsxDEV("strong", { children: item.text }, idx, false, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 325,
        columnNumber: 18
      }, this);
    } else {
      return /* @__PURE__ */ jsxDEV("span", { children: item.text }, idx, false, {
        fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
        lineNumber: 327,
        columnNumber: 18
      }, this);
    }
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/entity-summary-link.tsx",
    lineNumber: 322,
    columnNumber: 5
  }, this);
}

export {
  EntitySummaryLink
};
//# sourceMappingURL=/build/_shared/chunk-ZK23STK3.js.map
