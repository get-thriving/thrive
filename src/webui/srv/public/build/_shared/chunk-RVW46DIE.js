import {
  userFeatureName,
  workspaceFeatureName
} from "/build/_shared/chunk-W2LTCAXB.js";
import {
  isWidgetDimensionFlex,
  isWidgetDimensionKSized,
  widgetDimensionRows,
  widgetTypeName
} from "/build/_shared/chunk-4ZSHFYIG.js";
import {
  InboxTasksNoTasksCard
} from "/build/_shared/chunk-Y2XMZIJC.js";
import {
  actionableTimeToDateTime
} from "/build/_shared/chunk-GKFPZ6TR.js";
import {
  InboxTaskStack
} from "/build/_shared/chunk-IFDICYHD.js";
import {
  filterInboxTasksForDisplay,
  sortInboxTasksByEisenAndDifficulty
} from "/build/_shared/chunk-RTB3GZDR.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  PERSON_OCCASION
} from "/build/_shared/chunk-ZFIM7NDI.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  Box_default,
  Button_default,
  CardActions_default,
  CardContent_default,
  CardHeader_default,
  Card_default,
  Typography_default
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

// ../core/jupiter/core/home/component/common.tsx
var WIDGET_HEIGHT_IN_REM_BASE = 14;
function WidgetContainer(props) {
  const isBigScreen = useBigScreen();
  let heightInRem;
  let minHeightInRem;
  let maxHeightInRem;
  if (isWidgetDimensionKSized(props.geometry.dimension)) {
    heightInRem = void 0;
    minHeightInRem = void 0;
    maxHeightInRem = void 0;
  } else {
    if (isWidgetDimensionFlex(props.geometry.dimension)) {
      heightInRem = void 0;
      minHeightInRem = `${WIDGET_HEIGHT_IN_REM_BASE}rem`;
      maxHeightInRem = `${widgetDimensionRows(props.geometry.dimension) * WIDGET_HEIGHT_IN_REM_BASE}rem`;
    } else {
      heightInRem = `${widgetDimensionRows(props.geometry.dimension) * WIDGET_HEIGHT_IN_REM_BASE}rem`;
      minHeightInRem = `${widgetDimensionRows(props.geometry.dimension) * WIDGET_HEIGHT_IN_REM_BASE}rem`;
      maxHeightInRem = `${widgetDimensionRows(props.geometry.dimension) * WIDGET_HEIGHT_IN_REM_BASE}rem`;
    }
  }
  return /* @__PURE__ */ jsxDEV(
    Box_default,
    {
      sx: {
        width: isBigScreen ? "100%" : "calc(100% - 2 * 0.4rem)",
        height: heightInRem,
        minHeight: minHeightInRem,
        maxHeight: maxHeightInRem,
        border: (theme) => `2px dotted ${theme.palette.primary.main}`,
        borderRadius: "4px",
        margin: "0.2rem",
        padding: "0.4rem",
        overflowY: !isWidgetDimensionKSized(props.geometry.dimension) ? "scroll" : void 0
      },
      children: props.children
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/home/component/common.tsx",
      lineNumber: 175,
      columnNumber: 5
    },
    this
  );
}
function WidgetFeatureNotAvailableBanner(props) {
  const { widgetType, missingWorkspaceFeatures, missingUserFeatures } = props;
  const workspaceFeatureNames = missingWorkspaceFeatures.map(workspaceFeatureName);
  const userFeatureNames = missingUserFeatures.map(userFeatureName);
  const allFeatureNames = [...workspaceFeatureNames, ...userFeatureNames];
  const hasWorkspaceFeatures = missingWorkspaceFeatures.length > 0;
  const hasUserFeatures = missingUserFeatures.length > 0;
  return /* @__PURE__ */ jsxDEV(Card_default, { children: [
    /* @__PURE__ */ jsxDEV(CardHeader_default, { title: `${widgetTypeName(widgetType)} Not Available` }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/common.tsx",
      lineNumber: 216,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CardContent_default, { children: /* @__PURE__ */ jsxDEV(Typography_default, { variant: "body1", children: [
      "This widget requires the following features to be enabled:",
      " ",
      allFeatureNames.join(", ")
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/home/component/common.tsx",
      lineNumber: 218,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "../core/jupiter/core/home/component/common.tsx",
      lineNumber: 217,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(CardActions_default, { children: [
      hasWorkspaceFeatures && /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          size: "small",
          component: Link,
          to: "/app/workspace/settings",
          children: "Enable Workspace Features"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/home/component/common.tsx",
          lineNumber: 225,
          columnNumber: 11
        },
        this
      ),
      hasUserFeatures && /* @__PURE__ */ jsxDEV(
        Button_default,
        {
          variant: "contained",
          size: "small",
          component: Link,
          to: "/app/workspace/account",
          children: "Enable User Features"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/home/component/common.tsx",
          lineNumber: 235,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "../core/jupiter/core/home/component/common.tsx",
      lineNumber: 223,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/home/component/common.tsx",
    lineNumber: 215,
    columnNumber: 5
  }, this);
}
function getDeterministicRandomElement(array, date) {
  if (array.length === 0) {
    throw new Error("Cannot select random element from empty array");
  }
  const seed = date.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = Math.abs(seed) % array.length;
  return array[index];
}

// ../core/jupiter/core/prm/sub/person/component/upcoming-birthdays-widget.tsx
var import_webapi_client = __toESM(require_dist(), 1);
function UpcomingBirthdaysWidget(props) {
  const personTasks = props.personTasks;
  const today = aDateToDate(props.topLevelInfo.today).endOf("day");
  const threeMonthsFromNow = today.plus({ months: 3 }).endOf("day");
  const actionableTime = actionableTimeToDateTime(
    "one-week" /* ONE_WEEK */,
    props.topLevelInfo.user.timezone
  );
  const sortedInboxTasks = sortInboxTasksByEisenAndDifficulty(
    personTasks.personInboxTasks
  );
  const upcomingBirthdays = filterInboxTasksForDisplay(
    sortedInboxTasks,
    personTasks.personEntriesByRefId,
    personTasks.optimisticUpdates,
    {
      allowSources: [PERSON_OCCASION],
      allowStatuses: [
        import_webapi_client.InboxTaskStatus.NOT_STARTED,
        import_webapi_client.InboxTaskStatus.IN_PROGRESS,
        import_webapi_client.InboxTaskStatus.BLOCKED
      ],
      includeIfNoActionableDate: true,
      actionableDateEnd: actionableTime,
      dueDateEnd: threeMonthsFromNow
    }
  );
  if (upcomingBirthdays.length === 0) {
    return /* @__PURE__ */ jsxDEV(
      InboxTasksNoTasksCard,
      {
        parent: "person",
        parentLabel: "New Person",
        parentNewLocations: "/app/workspace/prm/persons/new"
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/prm/sub/person/component/upcoming-birthdays-widget.tsx",
        lineNumber: 49,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDEV(
    InboxTaskStack,
    {
      topLevelInfo: props.topLevelInfo,
      showOptions: {
        showStatus: true,
        showDueDate: true,
        showHandleMarkDone: true,
        showHandleMarkNotDone: true
      },
      label: "Upcoming Birthdays",
      inboxTasks: upcomingBirthdays,
      optimisticUpdates: personTasks.optimisticUpdates,
      moreInfoByRefId: personTasks.personEntriesByRefId,
      onCardMarkDone: personTasks.onCardMarkDone,
      onCardMarkNotDone: personTasks.onCardMarkNotDone
    },
    "upcoming-birthdays",
    false,
    {
      fileName: "../core/jupiter/core/prm/sub/person/component/upcoming-birthdays-widget.tsx",
      lineNumber: 58,
      columnNumber: 5
    },
    this
  );
}

export {
  WidgetContainer,
  WidgetFeatureNotAvailableBanner,
  getDeterministicRandomElement,
  UpcomingBirthdaysWidget
};
//# sourceMappingURL=/build/_shared/chunk-RVW46DIE.js.map
