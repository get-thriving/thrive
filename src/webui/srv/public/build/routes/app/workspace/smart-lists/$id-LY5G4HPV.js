import {
  CheckComponent
} from "/build/_shared/chunk-IQQHOPPW.js";
import {
  ContactTag
} from "/build/_shared/chunk-SLZ5UQVD.js";
import {
  TagTag
} from "/build/_shared/chunk-KB3ZBF4C.js";
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
  NavMultipleSpread,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import "/build/_shared/chunk-QEY3CJSK.js";
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
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  TopLevelInfoContext
} from "/build/_shared/chunk-DQUBQ63X.js";
import {
  Reorder_default,
  Tune_default,
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-QJ3XFSPL.js";
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

// app/routes/app/workspace/smart-lists/$id.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_react2 = __toESM(require_react());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/smart-lists/$id.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/smart-lists/$id.tsx"
  );
  import.meta.hot.lastModified = "1777213342602.5327";
}
var ParamsSchema = external_exports.object({
  id: external_exports.string()
});
var UpdateSchema = external_exports.discriminatedUnion("intent", [external_exports.object({
  intent: external_exports.literal("archive")
}), external_exports.object({
  intent: external_exports.literal("remove")
})]);
var handle = {
  displayType: 2 /* BRANCH */
};
var shouldRevalidate = standardShouldRevalidate;
function SmartListViewItems() {
  _s();
  const loaderData = useLoaderDataSafeForAnimation();
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();
  const topLevelInfo = (0, import_react2.useContext)(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle" && !loaderData.smartList.archived;
  const shouldShowALeaf = useBranchNeedsToShowLeaf();
  const [selectedDoneness, setSelectedDoneness] = (0, import_react2.useState)([]);
  const [selectedTagsRefId, setSelectedTagsRefId] = (0, import_react2.useState)([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = (0, import_react2.useState)([]);
  const filteredSmartListItems = loaderData.smartListItems.filter((item) => {
    const doneOk = selectedDoneness.length === 0 || selectedDoneness.includes(item.is_done);
    const tags = loaderData.genericTagsByItemRefId[item.ref_id] ?? [];
    const tagsOk = selectedTagsRefId.length === 0 || tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));
    const contacts = loaderData.contactsByItemRefId[item.ref_id] ?? [];
    const contactsOk = selectedContactsRefId.length === 0 || contacts.some((contact) => selectedContactsRefId.includes(contact.ref_id));
    return doneOk && tagsOk && contactsOk;
  });
  return /* @__PURE__ */ jsxDEV(BranchPanel, { entityType: import_webapi_client.NamedEntityTag.SMART_LIST, entityRefId: loaderData.smartList.ref_id, showArchiveAndRemoveButton: true, inputsEnabled, entityArchived: loaderData.smartList.archived, createLocation: `/app/workspace/smart-lists/${loaderData.smartList.ref_id}/new`, returnLocation: "/app/workspace/smart-lists", actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "smart-list-items", topLevelInfo, inputsEnabled, actions: [NavSingle({
    text: isBigScreen ? "Details" : "",
    icon: /* @__PURE__ */ jsxDEV(Tune_default, {}, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
      lineNumber: 157,
      columnNumber: 11
    }, this),
    link: `/app/workspace/smart-lists/${loaderData.smartList.ref_id}/details`
  }), NavMultipleSpread({
    navs: [NavSingle({
      text: "Items",
      icon: /* @__PURE__ */ jsxDEV(Reorder_default, {}, void 0, false, {
        fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
        lineNumber: 162,
        columnNumber: 13
      }, this),
      link: `/app/workspace/smart-lists/${loaderData.smartList.ref_id}`,
      highlight: true
    })]
  }), FilterManyOptions("Done", [{
    value: true,
    text: "Is done"
  }, {
    value: false,
    text: "Is not done"
  }], setSelectedDoneness), FilterManyOptions("Tags", loaderData.allItemTags.map((tag) => ({
    value: tag.ref_id,
    text: tag.name
  })), setSelectedTagsRefId), FilterManyOptions("Contacts", loaderData.allContacts.map((contact) => ({
    value: contact.ref_id,
    text: contact.name
  })), setSelectedContactsRefId)] }, void 0, false, {
    fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
    lineNumber: 155,
    columnNumber: 392
  }, this), children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeaf, children: [
      filteredSmartListItems.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "You Have To Start Somewhere", message: "There are no items to show with the current filters. You can create a new item.", newEntityLocations: `/app/workspace/smart-lists/${loaderData.smartList.ref_id}/new`, helpSubject: import_webapi_client.DocsHelpSubject.SMART_LISTS }, void 0, false, {
        fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
        lineNumber: 180,
        columnNumber: 49
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: filteredSmartListItems.map((item) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `smart-list-item-${item.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/smart-lists/${loaderData.smartList.ref_id}/${item.ref_id}`, children: [
        /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: item.name }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
          lineNumber: 185,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(CheckComponent, { isDone: item.is_done }, void 0, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
          lineNumber: 186,
          columnNumber: 17
        }, this),
        (loaderData.genericTagsByItemRefId[item.ref_id] ?? []).map((tag) => /* @__PURE__ */ jsxDEV(TagTag, { tag }, tag.ref_id, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
          lineNumber: 187,
          columnNumber: 84
        }, this)),
        (loaderData.contactsByItemRefId[item.ref_id] ?? []).map((contact) => /* @__PURE__ */ jsxDEV(ContactTag, { contact }, contact.ref_id, false, {
          fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
          lineNumber: 188,
          columnNumber: 85
        }, this))
      ] }, void 0, true, {
        fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
        lineNumber: 184,
        columnNumber: 15
      }, this) }, `smart-list-item-${item.ref_id}`, false, {
        fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
        lineNumber: 183,
        columnNumber: 47
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
        lineNumber: 182,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
      lineNumber: 179,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
      lineNumber: 195,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
      lineNumber: 194,
      columnNumber: 7
    }, this)
  ] }, `smart-list-${loaderData.smartList.ref_id}`, true, {
    fileName: "app/routes/app/workspace/smart-lists/$id.tsx",
    lineNumber: 155,
    columnNumber: 10
  }, this);
}
_s(SmartListViewItems, "cwlPMMZMrGkmpAwUeV6G0rCfs+k=", false, function() {
  return [useLoaderDataSafeForAnimation, useNavigation, useBigScreen, useBranchNeedsToShowLeaf];
});
_c = SmartListViewItems;
var ErrorBoundary = makeBranchErrorBoundary("/app/workspace/smart-lists", ParamsSchema, {
  notFound: (params) => `Could not find smart list #${params.id}!`,
  error: (params) => `There was an error loading smart list #${params.id}! Please try again!`
});
var _c;
$RefreshReg$(_c, "SmartListViewItems");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  SmartListViewItems as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/smart-lists/$id-LY5G4HPV.js.map
