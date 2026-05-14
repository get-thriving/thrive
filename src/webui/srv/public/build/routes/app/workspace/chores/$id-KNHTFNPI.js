import {
  TimeEventInDayBlockStack
} from "/build/_shared/chunk-H3GNRCKI.js";
import {
  LifePlanAssociations
} from "/build/_shared/chunk-OE7VPYTO.js";
import "/build/_shared/chunk-6SJK4Y2K.js";
import "/build/_shared/chunk-OIJ3E3DH.js";
import "/build/_shared/chunk-OLMKSGLM.js";
import "/build/_shared/chunk-ZFN6H2GY.js";
import {
  lifePlanBirthdayDate
} from "/build/_shared/chunk-HQECWRQJ.js";
import "/build/_shared/chunk-WCBSHJX3.js";
import "/build/_shared/chunk-37FGSNWH.js";
import {
  ContactsEditor
} from "/build/_shared/chunk-VGTT4RYC.js";
import {
  sortInboxTaskTimeEventsNaturally,
  timeEventInDayBlockToTimezone
} from "/build/_shared/chunk-24RA7B23.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import "/build/_shared/chunk-IRHCW4HP.js";
import {
  RecurringTaskGenParamsBlock
} from "/build/_shared/chunk-WKUBLS6Z.js";
import "/build/_shared/chunk-HVU6TG3B.js";
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
  basicShouldRevalidate
} from "/build/_shared/chunk-ZL2FGMVX.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import "/build/_shared/chunk-PE4INIRM.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
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
import {
  isWorkspaceFeatureAvailable
} from "/build/_shared/chunk-ZFIM7NDI.js";
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
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  FormControlLabel_default,
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  Switch_default
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

// app/routes/app/workspace/chores/$id.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/chores/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/chores/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342580.246";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var QuerySchema = external_exports.object({
  inboxTasksRetrieveOffset: external_exports.string().transform((s) => parseInt(s, 10)).optional()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  aspect: external_exports.string().optional(),
  chapter: external_exports.string().optional(),
  goal: external_exports.string().optional(),
  isKey: import_zodix.CheckboxAsString,
  period: external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod),
  eisen: external_exports.nativeEnum(import_webapi_client.Eisen),
  difficulty: external_exports.nativeEnum(import_webapi_client.Difficulty),
  actionableFromDay: external_exports.string().optional(),
  actionableFromMonth: external_exports.string().optional(),
  dueAtDay: external_exports.string().optional(),
  dueAtMonth: external_exports.string().optional(),
  mustDo: import_zodix.CheckboxAsString,
  skipRule: external_exports.string().optional(),
  startAtDate: external_exports.string().optional(),
  endAtDate: external_exports.string().optional()
}), external_exports.object({
  intent: external_exports.literal("regen")
}), external_exports.object({
  intent: external_exports.literal("create-note")
}), external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 3 /* LEAF */
};
var shouldRevalidate = basicShouldRevalidate;
function Chore() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const birthdayDate = loaderData.lifePlan ? lifePlanBirthdayDate(loaderData.lifePlan) : null;
  const inputsEnabled = navigation.state === "idle" && !loaderData.chore.archived;
  const [selectedAspect, setSelectedAspect] = (0, import_react2.useState)(loaderData.aspect?.ref_id ?? "");
  const sortedInboxTasks = sortInboxTasksNaturally(loaderData.inboxTasks, {
    dueDateAscending: false
  });
  const timeEventEntries = loaderData.timeEventBlocks.map((block) => ({
    time_event_in_tz: timeEventInDayBlockToTimezone(block, topLevelInfo.user.timezone),
    entry: {
      chore: loaderData.chore,
      time_events: [block]
    }
  }));
  const sortedTimeEventEntries = sortInboxTaskTimeEventsNaturally(timeEventEntries);
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
  (0, import_react2.useEffect)(() => {
    setSelectedAspect(loaderData.aspect?.ref_id ?? "");
  }, [loaderData]);
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.CHORE, entityRefId: loaderData.chore.ref_id, fakeKey: `chore-{loaderData.chore.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.chore.archived, returnLocation: "/app/workspace/chores", children: [
    /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 328,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chore-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Save",
      value: "update",
      highlight: true
    }), ActionSingle({
      text: "Regen",
      value: "regen",
      highlight: false
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 329,
      columnNumber: 48
    }, this), children: [
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: "row", useFlexGap: true, spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
          flexGrow: 3
        }, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 342,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: loaderData.chore.name }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 343,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 344,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 339,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 1
        }, children: [
          /* @__PURE__ */ jsxDEV(IsKeySelect, { name: "isKey", defaultValue: loaderData.chore.is_key, inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 350,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/is_key" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 351,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 347,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/$id.tsx",
        lineNumber: 338,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", useFlexGap: true, spacing: 1, children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", aloneOnLine: true, allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.CHORE, loaderData.chore.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 359,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 356,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { sx: {
          flexGrow: 2
        }, children: /* @__PURE__ */ jsxDEV(ContactsEditor, { name: "contacts_names", aloneOnLine: true, allContacts: loaderData.allContacts, defaultValue: loaderData.contacts.map((contact) => contact.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.CHORE, loaderData.chore.ref_id) }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 365,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 362,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/$id.tsx",
        lineNumber: 355,
        columnNumber: 9
      }, this),
      isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.LIFE_PLAN) && /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(LifePlanAssociations, { inputsEnabled, allAspects: loaderData.allAspects ?? [], aspectValue: selectedAspect, onAspectChange: setSelectedAspect, allChapters: loaderData.allChapters ?? [], chapterDefaultValue: loaderData.chapter?.ref_id, allGoals: loaderData.allGoals ?? [], goalDefaultValue: loaderData.goal?.ref_id, birthday: birthdayDate, today: aDateToDate(topLevelInfo.today), allMilestones: loaderData.allMilestones ?? [] }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 370,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/aspect_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 371,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/chapter_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 372,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/goal_ref_id" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 373,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/$id.tsx",
        lineNumber: 369,
        columnNumber: 93
      }, this),
      /* @__PURE__ */ jsxDEV(RecurringTaskGenParamsBlock, { inputsEnabled, allowSkipRule: true, period: loaderData.chore.gen_params.period, eisen: loaderData.chore.gen_params.eisen, difficulty: loaderData.chore.gen_params.difficulty, actionableFromDay: loaderData.chore.gen_params.actionable_from_day, actionableFromMonth: loaderData.chore.gen_params.actionable_from_month, dueAtDay: loaderData.chore.gen_params.due_at_day, dueAtMonth: loaderData.chore.gen_params.due_at_month, skipRule: loaderData.chore.gen_params.skip_rule, actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/chores/$id.tsx",
        lineNumber: 376,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
        /* @__PURE__ */ jsxDEV(FormControlLabel_default, { control: /* @__PURE__ */ jsxDEV(Switch_default, { name: "mustDo", readOnly: !inputsEnabled, defaultChecked: loaderData.chore.must_do }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 379,
          columnNumber: 38
        }, this), label: "Must Do In Vacation" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 379,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/must_do" }, void 0, false, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 380,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/$id.tsx",
        lineNumber: 378,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, direction: isBigScreen ? "row" : "column", children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "startAtDate", shrink: true, children: "Start At Date [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 385,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "startAtDate", defaultValue: loaderData.chore.start_at_date ? aDateToDate(loaderData.chore.start_at_date).toFormat("yyyy-MM-dd") : void 0, name: "startAtDate", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 388,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/start_at_date" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 390,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 384,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "endAtDate", shrink: true, children: "End At Date [Optional]" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 394,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "date", notched: true, label: "endAtDate", defaultValue: loaderData.chore.end_at_date ? aDateToDate(loaderData.chore.end_at_date).toFormat("yyyy-MM-dd") : void 0, name: "endAtDate", readOnly: !inputsEnabled, disabled: !inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 397,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/end_at_date" }, void 0, false, {
            fileName: "app/routes/app/workspace/chores/$id.tsx",
            lineNumber: 399,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/chores/$id.tsx",
          lineNumber: 393,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/chores/$id.tsx",
        lineNumber: 383,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 329,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "chore-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
      text: "Create Note",
      value: "create-note",
      highlight: false,
      disabled: loaderData.note !== null
    })] }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 404,
      columnNumber: 42
    }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 411,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 410,
      columnNumber: 29
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 404,
      columnNumber: 7
    }, this),
    isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.SCHEDULE) && /* @__PURE__ */ jsxDEV(TimeEventInDayBlockStack, { topLevelInfo, inputsEnabled, title: "Time Events", createLocation: `/app/workspace/calendar/time-event/in-day-block/new-for-chore?choreRefId=${loaderData.chore.ref_id}`, entries: sortedTimeEventEntries }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 415,
      columnNumber: 90
    }, this),
    /* @__PURE__ */ jsxDEV(SectionCard, { title: "Inbox Tasks", children: sortedInboxTasks.length > 0 && /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
      showStatus: true,
      showDueDate: true,
      showHandleMarkDone: true,
      showHandleMarkNotDone: true
    }, inboxTasks: sortedInboxTasks, withPages: {
      retrieveOffsetParamName: "inboxTasksRetrieveOffset",
      totalCnt: loaderData.inboxTasksTotalCnt,
      pageSize: loaderData.inboxTasksPageSize
    }, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 418,
      columnNumber: 41
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/chores/$id.tsx",
      lineNumber: 417,
      columnNumber: 7
    }, this)
  ] }, `chore-${loaderData.chore.ref_id}`, true, {
    fileName: "app/routes/app/workspace/chores/$id.tsx",
    lineNumber: 327,
    columnNumber: 10
  }, this);
}
_s(Chore, "341gZkLpDHkVVzmdC3ukWZpQZos=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen, useFetcher];
});
_c = Chore;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/chores", ParamsSchema, {
  notFound: (params) => `Could not find chore #${params.id}!`,
  error: (params) => `There was an error loading chore #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "Chore");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Chore as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/chores/$id-KNHTFNPI.js.map
