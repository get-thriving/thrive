import {
  TimeEventFullDaysBlockStack
} from "/build/_shared/chunk-EHKP722S.js";
import {
  sortBirthdayTimeEventsNaturally
} from "/build/_shared/chunk-24RA7B23.js";
import {
  EntityNoteEditor
} from "/build/_shared/chunk-PDFSPG4I.js";
import {
  TagsEditor
} from "/build/_shared/chunk-FTLY2H2V.js";
import {
  entityLinkStd,
  parseEntityLinkStd
} from "/build/_shared/chunk-HDJTYRJL.js";
import {
  compareBirthdaysNaturally
} from "/build/_shared/chunk-IRHCW4HP.js";
import {
  CircleMultiSelect
} from "/build/_shared/chunk-R2CL3IG3.js";
import {
  RecurringTaskGenParamsBlock
} from "/build/_shared/chunk-WKUBLS6Z.js";
import "/build/_shared/chunk-HVU6TG3B.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
import {
  selectZod
} from "/build/_shared/chunk-HVVVLUYY.js";
import {
  NestingAwareBlock
} from "/build/_shared/chunk-FROCZWJR.js";
import {
  InboxTaskStack
} from "/build/_shared/chunk-IFDICYHD.js";
import "/build/_shared/chunk-YVDLHOTH.js";
import "/build/_shared/chunk-ZNIVMWFF.js";
import "/build/_shared/chunk-BOZSZ6DZ.js";
import "/build/_shared/chunk-Q4OQDEZG.js";
import "/build/_shared/chunk-U5MVWZEK.js";
import {
  EntityNameComponent
} from "/build/_shared/chunk-HGSZOXV4.js";
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
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import "/build/_shared/chunk-Z3RPM676.js";
import {
  StandardDivider
} from "/build/_shared/chunk-PE4INIRM.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
import "/build/_shared/chunk-72ELS2LF.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  LeafPanel,
  makeLeafErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence
} from "/build/_shared/chunk-A6MOWSJE.js";
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
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  Typography_default
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
import {
  useLeafNeedsToShowLeaflet
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet,
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

// app/routes/app/workspace/prm/persons/$id.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_react2 = __toESM(require_react());
var import_zodix = __toESM(require_dist2());

// ../core/jupiter/core/common/component/birthday-tag.tsx
function BirthdayTag({ birthday, label }) {
  const finalLabel = label ?? "Birthday";
  return /* @__PURE__ */ jsxDEV(Typography_default, { component: "span", children: [
    finalLabel,
    " is on ",
    birthday
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/birthday-tag.tsx",
    lineNumber: 12,
    columnNumber: 5
  }, this);
}

// ../core/jupiter/core/prm/sub/person/sub/occasion/root.ts
function sortOccasionsNaturally(occasions) {
  return [...occasions].sort((a, b) => {
    return compareBirthdaysNaturally(a.date, b.date);
  });
}

// ../core/jupiter/core/prm/sub/person/sub/occasion/components/stack.tsx
function OccasionStack(props) {
  const sortedOccasions = sortOccasionsNaturally(props.occasions);
  return /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedOccasions.map((occasion) => {
    return /* @__PURE__ */ jsxDEV(
      EntityCard,
      {
        entityId: `occasion-${occasion.ref_id}`,
        children: /* @__PURE__ */ jsxDEV(
          EntityLink,
          {
            to: `/app/workspace/prm/persons/${occasion.person_ref_id}/occasions/${occasion.ref_id}`,
            children: [
              /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: occasion.name }, void 0, false, {
                fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/stack.tsx",
                lineNumber: 29,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(BirthdayTag, { label: "", birthday: occasion.date }, void 0, false, {
                fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/stack.tsx",
                lineNumber: 30,
                columnNumber: 15
              }, this),
              props.occasionTagsByRefId[occasion.ref_id]?.map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
                fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/stack.tsx",
                lineNumber: 32,
                columnNumber: 17
              }, this))
            ]
          },
          void 0,
          true,
          {
            fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/stack.tsx",
            lineNumber: 26,
            columnNumber: 13
          },
          this
        )
      },
      `occasion-${occasion.ref_id}`,
      false,
      {
        fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/stack.tsx",
        lineNumber: 22,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/stack.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, this);
}

// app/routes/app/workspace/prm/persons/$id.tsx
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/prm/persons/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/prm/persons/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342596.3267";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var QuerySchema = external_exports.object({
  catchUpTasksRetrieveOffset: external_exports.string().transform((s) => parseInt(s, 10)).optional(),
  occasionTasksRetrieveOffset: external_exports.string().transform((s) => parseInt(s, 10)).optional()
});
var UpdateFormSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("update"),
  name: external_exports.string(),
  circleRefIds: selectZod(external_exports.string()),
  catchUpPeriod: external_exports.union([external_exports.nativeEnum(import_webapi_client.RecurringTaskPeriod), external_exports.literal("none")]).optional(),
  catchUpEisen: external_exports.nativeEnum(import_webapi_client.Eisen).optional(),
  catchUpDifficulty: external_exports.nativeEnum(import_webapi_client.Difficulty).optional(),
  catchUpActionableFromDay: external_exports.string().optional(),
  catchUpActionableFromMonth: external_exports.string().optional(),
  catchUpDueAtDay: external_exports.string().optional(),
  catchUpDueAtMonth: external_exports.string().optional()
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
var shouldRevalidate = standardShouldRevalidate;
function Person() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const actionData = useActionData();
  const navigation = useNavigation();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const person = loaderData.person;
  const personName = loaderData.contact.name;
  const allOccasionsByRefId = new Map(loaderData.occasions.map((o) => [o.ref_id, o]));
  const sortedOccasionTasks = sortInboxTasksNaturally(loaderData.occasionTasks, {
    dueDateAscending: false
  });
  const sortedCatchUpTasks = sortInboxTasksNaturally(loaderData.catchUpTasks, {
    dueDateAscending: false
  });
  const occasionTimeEventEntries = loaderData.occasionTimeEventBlocks.filter((f) => !f.archived).map((block) => ({
    time_event: block,
    entry: {
      person,
      contact: loaderData.contact,
      occasion: allOccasionsByRefId.get(parseEntityLinkStd(block.owner).refId),
      occasion_time_event: block
    }
  }));
  const sortedOccasionTimeEventEntries = sortBirthdayTimeEventsNaturally(occasionTimeEventEntries);
  const inputsEnabled = navigation.state === "idle" && !person.archived;
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
  return /* @__PURE__ */ jsxDEV(LeafPanel, { entityType: import_webapi_client.NamedEntityTag.PERSON, entityRefId: person.ref_id, fakeKey: `person-${person.ref_id}`, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: person.archived, returnLocation: "/app/workspace/prm/persons", shouldShowALeaflet, children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaflet, children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 288,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Properties", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "person-properties", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        text: "Save",
        value: "update",
        highlight: true
      }), ActionSingle({
        text: "Regen",
        value: "regen",
        highlight: false
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 289,
        columnNumber: 50
      }, this), children: [
        /* @__PURE__ */ jsxDEV(Stack_default, { direction: isBigScreen ? "row" : "column", spacing: 1, children: [
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
            flexGrow: 3
          }, children: [
            /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Name" }, void 0, false, {
              fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
              lineNumber: 302,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Name", name: "name", readOnly: !inputsEnabled, defaultValue: personName }, void 0, false, {
              fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
              lineNumber: 303,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/name" }, void 0, false, {
              fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
              lineNumber: 304,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
            lineNumber: 299,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, sx: {
            flexGrow: 2
          }, children: /* @__PURE__ */ jsxDEV(TagsEditor, { name: "tags", label: null, aloneOnLine: !isBigScreen, allTags: loaderData.allTags, defaultValue: loaderData.tags.map((tag) => tag.ref_id), inputsEnabled, owner: entityLinkStd(import_webapi_client.NamedEntityTag.PERSON, person.ref_id) }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
            lineNumber: 310,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
            lineNumber: 307,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
          lineNumber: 298,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(CircleMultiSelect, { name: "circleRefIds", label: "Circles", inputsEnabled, disabled: false, allCircles: loaderData.allCircles, defaultValue: loaderData.circleRefIds, maxSelections: loaderData.maxCirclesPerPerson }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
          lineNumber: 314,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/circle_ref_ids" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
          lineNumber: 315,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(StandardDivider, { title: "Catch Up", size: "small" }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
          lineNumber: 317,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(RecurringTaskGenParamsBlock, { namePrefix: "catchUp", fieldsPrefix: "catch_up", allowNonePeriod: true, period: person.catch_up_params?.period ?? "none", eisen: person.catch_up_params?.eisen, difficulty: person.catch_up_params?.difficulty, actionableFromDay: person.catch_up_params?.actionable_from_day, actionableFromMonth: person.catch_up_params?.actionable_from_month, dueAtDay: person.catch_up_params?.due_at_day, dueAtMonth: person.catch_up_params?.due_at_month, inputsEnabled, actionData }, void 0, false, {
          fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
          lineNumber: 319,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 289,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Occasions", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "person-occasions", topLevelInfo, inputsEnabled, actions: [NavSingle({
        text: "New",
        link: `/app/workspace/prm/persons/${person.ref_id}/occasions/new`
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 322,
        columnNumber: 49
      }, this), children: /* @__PURE__ */ jsxDEV(OccasionStack, { occasions: loaderData.occasions, occasionTagsByRefId: loaderData.occasionTagsByRefId }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 326,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 322,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Note", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "person-note", topLevelInfo, inputsEnabled, actions: [ActionSingle({
        text: "Create Note",
        value: "create-note",
        highlight: false,
        disabled: loaderData.note !== null
      })] }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 329,
        columnNumber: 44
      }, this), children: loaderData.note && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(EntityNoteEditor, { initialNote: loaderData.note, inputsEnabled }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 336,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 335,
        columnNumber: 31
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 329,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Birthday Tasks", children: sortedOccasionTasks.length > 0 && /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
        showStatus: true,
        showDueDate: true,
        showHandleMarkDone: true,
        showHandleMarkNotDone: true
      }, inboxTasks: sortedOccasionTasks, withPages: {
        retrieveOffsetParamName: "birthdayTasksRetrieveOffset",
        totalCnt: loaderData.occasionTasksTotalCnt,
        pageSize: loaderData.occasionTasksPageSize
      } }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 341,
        columnNumber: 46
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 340,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Catch Up Tasks", children: sortedCatchUpTasks.length > 0 && /* @__PURE__ */ jsxDEV(InboxTaskStack, { topLevelInfo, showOptions: {
        showStatus: true,
        showDueDate: true,
        showHandleMarkDone: true,
        showHandleMarkNotDone: true
      }, inboxTasks: sortedCatchUpTasks, withPages: {
        retrieveOffsetParamName: "catchUpTasksRetrieveOffset",
        totalCnt: loaderData.catchUpTasksTotalCnt,
        pageSize: loaderData.catchUpTasksPageSize
      }, onCardMarkDone: handleCardMarkDone, onCardMarkNotDone: handleCardMarkNotDone }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 354,
        columnNumber: 45
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 353,
        columnNumber: 9
      }, this),
      isWorkspaceFeatureAvailable(topLevelInfo.workspace, import_webapi_client.WorkspaceFeature.SCHEDULE) && sortedOccasionTimeEventEntries.length > 0 && /* @__PURE__ */ jsxDEV(TimeEventFullDaysBlockStack, { topLevelInfo, inputsEnabled, title: "Occasion Time Events", entries: sortedOccasionTimeEventEntries }, void 0, false, {
        fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
        lineNumber: 366,
        columnNumber: 137
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
      lineNumber: 287,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
      lineNumber: 370,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
      lineNumber: 369,
      columnNumber: 7
    }, this)
  ] }, `person-${person.ref_id}`, true, {
    fileName: "app/routes/app/workspace/prm/persons/$id.tsx",
    lineNumber: 286,
    columnNumber: 10
  }, this);
}
_s(Person, "/1j8nnbDKvJMbIDiu0HQZpmG+QI=", false, function() {
  return [useLoaderDataSafeForAnimation, useActionData, useNavigation, useBigScreen, useLeafNeedsToShowLeaflet, useFetcher];
});
_c = Person;
var ErrorBoundary = makeLeafErrorBoundary("/app/workspace/prm/persons", ParamsSchema, {
  notFound: (params) => `Could not find person with ID ${params.id}!`,
  error: (params) => `There was an error loading person with ID ${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "Person");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Person as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/prm/persons/$id-IVGMYQRL.js.map
