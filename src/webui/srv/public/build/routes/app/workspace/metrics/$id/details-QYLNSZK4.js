import {
  MetricDirectionSelect
} from "/build/_shared/chunk-KCYYLC34.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  RecurringTaskGenParamsBlock
} from "/build/_shared/chunk-WKUBLS6Z.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  IconSelector
} from "/build/_shared/chunk-IU4ODRE6.js";
import {
  InboxTaskStack
} from "/build/_shared/chunk-IFDICYHD.js";
import "/build/_shared/chunk-YVDLHOTH.js";
import "/build/_shared/chunk-ZNIVMWFF.js";
import "/build/_shared/chunk-BOZSZ6DZ.js";
import "/build/_shared/chunk-Q4OQDEZG.js";
import "/build/_shared/chunk-U5MVWZEK.js";
import "/build/_shared/chunk-HGSZOXV4.js";
import {
  IsKeySelect
} from "/build/_shared/chunk-SWYHSSUT.js";
import "/build/_shared/chunk-T6GSSEVE.js";
import {
  sortInboxTasksNaturally
} from "/build/_shared/chunk-RTB3GZDR.js";
import "/build/_shared/chunk-DNXYZ7BB.js";
import "/build/_shared/chunk-5CBAK2HS.js";
import "/build/_shared/chunk-NVWDLS2H.js";
import "/build/_shared/chunk-4TWETDNJ.js";
import "/build/_shared/chunk-NBD44M5V.js";
import "/build/_shared/chunk-NLPUBZ3T.js";
import {
  standardShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-FUGZILJZ.js";
import "/build/_shared/chunk-43PAR6MS.js";
import {
  FormControl_default,
  FormLabel_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import "/build/_shared/chunk-YEJBW4GC.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_dist as require_dist2
} from "/build/_shared/chunk-ZZL6WUOE.js";
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
  useFetcher,
  useNavigation,
  useParams
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

// app/routes/app/workspace/metrics/$id/details.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/metrics/$id/details.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/metrics/$id/details.tsx"
  );
  import.meta.hot.lastModified = "1777213342595.2146";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var QuerySchema = external_exports.object({
  collectionTasksRetrieveOffset: external_exports.string().transform((s) => parseInt(s, 10)).optional()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  isKey: import_zodix.CheckboxAsString,
  icon: external_exports.string().optional(),
  metricDirection: external_exports.nativeEnum(import_webapi_client.MetricDirection),
  collectionPeriod: external_exports.union([external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod), external_exports.literal("none")]).optional(),
  collectionEisen: external_exports.nativeEnum(import_webapi_client.Eisen).optional(),
  collectionDifficulty: external_exports.nativeEnum(import_webapi_client.Difficulty).optional(),
  collectionActionableFromDay: external_exports.string().optional(),
  collectionActionableFromMonth: external_exports.string().optional(),
  collectionDueAtDay: external_exports.string().optional(),
  collectionDueAtMonth: external_exports.string().optional()
}), external_exports.object({
  intent: external_exports.literal("regen")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
}), external_exports.object({
  intent: external_exports.literal("create-note")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = standardShouldRevalidate;
function MetricDetails() {
  _s();
  const {
    id
  } = useParams();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const inputsEnabled = navigation.state === "idle" && !loaderData.metric.archived;
  const sortedCollectionTasks = loaderData.collectionTasks ? sortInboxTasksNaturally(loaderData.collectionTasks, {
    dueDateAscending: false
  }) : void 0;
  const cardActionFetcher = useFetcher();
  function handleCardMarkDone(it) {
    cardActionFetcher.submit({
      id: it.ref_id,
      status: import_webapi_client.InboxTaskStatus.DONE
    }, {
      method: "post",
      action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
    });
  }
  function handleCardMarkNotDone(it) {
    cardActionFetcher.submit({
      id: it.ref_id,
      status: import_webapi_client.InboxTaskStatus.NOT_DONE
    }, {
      method: "post",
      action: "/app/workspace/core/inbox-tasks/update-status-and-eisen"
    });
  }
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.METRIC, entityRefId: loaderData.metric.ref_id, fakeKey: `metric-${id}/details`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.metric.archived, returnLocation: `/app/workspace/metrics/${id}`, children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 260,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "metric-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    }), ActionSingle({
      text: "Regen",
      value: "regen",
      highlight: false
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 261,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
            lineNumber: 274,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: loaderData.metric.name }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
            lineNumber: 275,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
            lineNumber: 276,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 271,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", label: null, aloneOnLine: !isBigScreen, allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.METRIC, loaderData.metric.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 282,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 279,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: loaderData.metric.is_key, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
            lineNumber: 288,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_key" }, void 0, false, {
            fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
            lineNumber: 289,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 285,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
        lineNumber: 270,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "icon", children: "Icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 294,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(IconSelector, { readOnly: !inputsEnabled, defaultIcon: loaderData.metric.icon }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 295,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/icon" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 296,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
        lineNumber: 293,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormLabel_default, { id: "metricDirection", children: "Direction" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 300,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(MetricDirectionSelect, { name: "metricDirection", defaultValue: loaderData.metric.metric_direction, inputsEnabled }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 301,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/metric_direction" }, void 0, false, {
          fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
          lineNumber: 302,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
        lineNumber: 299,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Collection", size: "large" }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
        lineNumber: 305,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(RecurringTaskGenParamsBlock, { namePrefix: "collection", fieldsPrefix: "collection", allowNonePeriod: true, period: loaderData.metric.collection_params?.period || "none", eisen: loaderData.metric.collection_params?.eisen, difficulty: loaderData.metric.collection_params?.difficulty, actionableFromDay: loaderData.metric.collection_params?.actionable_from_day, actionableFromMonth: loaderData.metric.collection_params?.actionable_from_month, dueAtDay: loaderData.metric.collection_params?.due_at_day, dueAtMonth: loaderData.metric.collection_params?.due_at_month, inputsEnabled, actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
        lineNumber: 307,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 261,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chore-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 310,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 317,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 316,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 310,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Collection Tasks", children: sortedCollectionTasks && /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
      showStatus: true,
      showDueDate: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, inboxTasks: sortedCollectionTasks, withPages: {
      retrieveOffsetParamName: "collectionTasksRetrieveOffset",
      totalCnt: loaderData.collectionTasksTotalCnt,
      pageSize: loaderData.collectionTasksPageSize
    }, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 322,
      columnNumber: 35
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
      lineNumber: 321,
      columnNumber: 7
    }, this)
  ] }, `metric-${id}/details`, true, {
    fileName: "app/routes/app/workspace/metrics/$id/details.tsx",
    lineNumber: 259,
    columnNumber: 10
  }, this);
}
_s(MetricDetails, "3HpMfOASLvfzpMYjPQhXVPReHNk=", false, function() {
  return [useParams, useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen, useFetcher];
});
_c = MetricDetails;
var ErrorBoundary = makeLeafErrorBoundary(_c2 = (params) => `/app/workspace/metrics/${params.id}`, ParamsSchema, {
  notFound: (params) => `Could not find metric details for #${params.id}!`,
  error: (params) => `There was an error loading metric details for #${params.id}! Please try again!`
});
_c3 = ErrorBoundary;
var _c;
var _c2;
var _c3;
$RefreshReg$(_c, "MetricDetails");
$RefreshReg$(_c2, "ErrorBoundary$makeLeafErrorBoundary");
$RefreshReg$(_c3, "ErrorBoundary");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  MetricDetails as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/metrics/$id/details-QYLNSZK4.js.map
