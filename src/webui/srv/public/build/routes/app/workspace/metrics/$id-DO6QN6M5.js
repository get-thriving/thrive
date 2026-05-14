import {
  ContactTag
} from "/build/_shared/chunk-SLZ5UQVD.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  Pe
} from "/build/_shared/chunk-BPEDSDJA.js";
import "/build/_shared/chunk-QROJZRQX.js";
import {
  EntityNoNothingCard
} from "/build/_shared/chunk-35FY5RIR.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  TimeDiffTag
} from "/build/_shared/chunk-YNGTC4PW.js";
import "/build/_shared/chunk-X6MG2JXZ.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate,
  compareADate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  BranchPanel,
  makeBranchErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Tune_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import {
  styled_default,
  useTheme
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import {
  useBranchNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet,
  useNavigation
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace/metrics/$id.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());

// ../core/jupiter/core/metrics/sub/entry/root.ts
function metricEntryName(metricEntry) {
  return `${metricEntry.value} at ${aDateToDate(
    metricEntry.collection_time
  ).toFormat("yyyy-MM-dd")}`;
}

// app/routes/app/workspace/metrics/$id.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/metrics/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/metrics/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342594.9028";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = standardShouldRevalidate;
function Metric() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const shouldShowALeaf = useBranchNeedsToShowLeaf();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = (0, import_react2.useState)([]);
  const tagsByMetricEntryRefId = /* @__PURE__ */ new Map();
  for (const et of loaderData.metricEntryTags) {
    tagsByMetricEntryRefId.set(et.metric_entry_ref_id, et.tags);
  }
  const allEntriesSorted = [...loaderData.metricEntries].sort((e1, e2) => {
    return -compareADate(e1.collection_time, e2.collection_time);
  });
  const previousEntryByRefId = /* @__PURE__ */ new Map();
  for (let i = 0; i < allEntriesSorted.length - 1; i++) {
    previousEntryByRefId.set(allEntriesSorted[i].ref_id, allEntriesSorted[i + 1]);
  }
  const sortedEntries = allEntriesSorted.filter((entry) => {
    const tags = tagsByMetricEntryRefId.get(entry.ref_id) || [];
    const tagsOk = selectedTagsRefId.length === 0 || tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));
    const contacts = loaderData.metricEntryContactsByRefId[entry.ref_id] || [];
    const contactsOk = selectedContactsRefId.length === 0 || contacts.some((contact) => selectedContactsRefId.includes(contact.ref_id));
    return tagsOk && contactsOk;
  });
  function getDirectionIndicator(entry) {
    const direction = loaderData.metric.metric_direction;
    if (direction === import_webapi_client.MetricDirection.NONE)
      return null;
    const prev = previousEntryByRefId.get(entry.ref_id);
    if (!prev)
      return null;
    const delta = entry.value - prev.value;
    const roundedDelta = Math.round(delta * 100) / 100;
    if (roundedDelta === 0)
      return null;
    const isUp = roundedDelta > 0;
    const diffStr = isUp ? `+${roundedDelta.toFixed(2)}` : `${roundedDelta.toFixed(2)}`;
    const isGood = direction === import_webapi_client.MetricDirection.UP_IS_GOOD && isUp || direction === import_webapi_client.MetricDirection.DOWN_IS_GOOD && !isUp;
    return {
      arrow: isUp ? "\u2B06" : "\u2B07",
      diff: diffStr,
      color: isGood ? "green" : "red"
    };
  }
  return /* @__PURE__ */ jsxDEV(BranchPanel, { showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.metric.archived, entityType: import_webapi_client.NamedEntityTag.METRIC, entityRefId: loaderData.metric.ref_id, createLocation: `/app/workspace/metrics/${loaderData.metric.ref_id}/entries/new`, returnLocation: "/app/workspace/metrics", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: `metric-${loaderData.metric.ref_id}-actions`, topLevelInfo, inputsEnabled, actions: [NavSingle({
    text: "Details",
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id.tsx",
      lineNumber: 197,
      columnNumber: 11
    }, this),
    link: `/app/workspace/metrics/${loaderData.metric.ref_id}/details`
  }), FilterManyOptions("Tags", loaderData.allTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId), FilterManyOptions("Contacts", loaderData.allContacts.map((contact) => ({
    value: contact.ref_id,
    text: contact.name
  })), setSelectedContactsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/metrics/$id.tsx",
    lineNumber: 195,
    columnNumber: 372
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: [
      /* @__PURE__ */ jsxDEV(MetricGraph, { sortedMetricEntries: sortedEntries }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics/$id.tsx",
        lineNumber: 207,
        columnNumber: 9
      }, this),
      sortedEntries.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no metric entries to show. You can create a new metric entry.", newEntityLocations: `/app/workspace/metrics/${loaderData.metric.ref_id}/entries/new`, helpSubject: import_webapi_client.DocsHelpSubject.METRICS }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics/$id.tsx",
        lineNumber: 209,
        columnNumber: 40
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedEntries.map((entry) => {
        const indicator = getDirectionIndicator(entry);
        return /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `metric-entry-${entry.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/metrics/${loaderData.metric.ref_id}/entries/${entry.ref_id}`, children: [
          /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: metricEntryName(entry) }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/$id.tsx",
            lineNumber: 216,
            columnNumber: 19
          }, this),
          indicator && /* @__PURE__ */ jsxDEV("span", { style: {
            color: indicator.color,
            fontWeight: "bold",
            fontSize: "0.9em",
            marginLeft: "4px"
          }, children: [
            indicator.arrow,
            " ",
            indicator.diff
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/metrics/$id.tsx",
            lineNumber: 217,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV(TimeDiffTag, { today: topLevelInfo.today, labelPrefix: "Collected", collectionTime: entry.collection_time }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/$id.tsx",
            lineNumber: 225,
            columnNumber: 19
          }, this),
          (tagsByMetricEntryRefId.get(entry.ref_id) || []).map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
            fileName: "app/routes/app/workspace/metrics/$id.tsx",
            lineNumber: 226,
            columnNumber: 80
          }, this)),
          (loaderData.metricEntryContactsByRefId[entry.ref_id] || []).map((contact) => /* @__PURE__ */ jsxDEV(ContactTag, { contact }, contact.ref_id, false, {
            fileName: "app/routes/app/workspace/metrics/$id.tsx",
            lineNumber: 227,
            columnNumber: 95
          }, this))
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/$id.tsx",
          lineNumber: 215,
          columnNumber: 17
        }, this) }, `metric-entry-${entry.ref_id}`, false, {
          fileName: "app/routes/app/workspace/metrics/$id.tsx",
          lineNumber: 214,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics/$id.tsx",
        lineNumber: 211,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/metrics/$id.tsx",
      lineNumber: 206,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id.tsx",
      lineNumber: 235,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id.tsx",
      lineNumber: 234,
      columnNumber: 7
    }, this)
  ] }, `metric-${loaderData.metric.ref_id}`, true, {
    fileName: "app/routes/app/workspace/metrics/$id.tsx",
    lineNumber: 195,
    columnNumber: 10
  }, this);
}
_s(Metric, "rXtMc10X3OqQ51HGBvEn+dMVleg=", false, function() {
  return [useLoaderDataSafeForAnimation, useBranchNeedsToShowLeaf, useNavigation];
});
_c = Metric;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/metrics", ParamsSchema, {
  notFound: (params) => `Could not find metric #${params.id}!`,
  error: (params) => `There was an error loading metric #${params.id}! Please try again!`
});
function MetricGraph({
  sortedMetricEntries
}) {
  _s2();
  const theme = useTheme();
  const nivoTheme = {
    axis: {
      ticks: {
        text: {
          fill: theme.palette.text.secondary
        }
      },
      legend: {
        text: {
          fill: theme.palette.text.primary
        }
      }
    },
    legends: {
      text: {
        fill: theme.palette.text.primary
      }
    },
    tooltip: {
      container: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary
      }
    }
  };
  const entriesForGraph = sortedMetricEntries.map((e) => ({
    x: aDateToDate(e.collection_time).toFormat("yyyy-MM-dd"),
    y: e.value,
    refId: e.ref_id
  }));
  const graphMaxValue = Math.max(...entriesForGraph.map((e) => e.y)) * 1.35;
  return /* @__PURE__ */ jsxDEV(MetricGraphDiv, { children: /* @__PURE__ */ jsxDEV(Pe, { theme: nivoTheme, curve: "monotoneX", xScale: {
    type: "time",
    format: "%Y-%m-%d",
    useUTC: false,
    precision: "day"
  }, xFormat: "time:%Y-%m-%d", yScale: {
    type: "linear",
    nice: true,
    min: 0,
    max: graphMaxValue
  }, axisBottom: {
    format: "'%y-%b-%d",
    tickValues: 7
  }, pointSize: 4, pointBorderWidth: 1, pointBorderColor: {
    from: "color",
    modifiers: [["darker", 0.3]]
  }, margin: {
    top: 20,
    right: 10,
    bottom: 50,
    left: 50
  }, useMesh: true, enableSlices: false, data: [{
    id: "metricValue",
    data: entriesForGraph
  }] }, void 0, false, {
    fileName: "app/routes/app/workspace/metrics/$id.tsx",
    lineNumber: 284,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/app/workspace/metrics/$id.tsx",
    lineNumber: 283,
    columnNumber: 10
  }, this);
}
_s2(MetricGraph, "VrMvFCCB9Haniz3VCRPNUiCauHs=", false, function() {
  return [useTheme];
});
_c2 = MetricGraph;
var MetricGraphDiv = styled_default("div")`
  height: 300px;
`;
_c3 = MetricGraphDiv;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "Metric");
$RefreshReg$(_c2, "MetricGraph");
$RefreshReg$(_c3, "MetricGraphDiv");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Metric as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/metrics/$id-DO6QN6M5.js.map
