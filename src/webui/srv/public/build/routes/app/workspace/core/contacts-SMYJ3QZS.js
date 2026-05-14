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
  EntityStack
} from "/build/_shared/chunk-3BC3B3FK.js";
import {
  EntityCard,
  EntityLink
} from "/build/_shared/chunk-MY6WUQK6.js";
import {
  useLoaderDataSafeForAnimation
} from "/build/_shared/chunk-5THEAJXM.js";
import {
  makeTrunkErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import {
  AnimatePresence,
  TrunkPanel
} from "/build/_shared/chunk-A6MOWSJE.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import "/build/_shared/chunk-PFTZ3POA.js";
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
  useTrunkNeedsToShowLeaf
} from "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Outlet
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/app/workspace/core/contacts.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/workspace/core/contacts.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/workspace/core/contacts.tsx"
  );
  import.meta.hot.lastModified = "1775685113147.519";
}
var handle = {
  displayType: 1 /* TRUNK */
};
var shouldRevalidate = standardShouldRevalidate;
function Contacts() {
  _s();
  const {
    contacts
  } = useLoaderDataSafeForAnimation();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const sortedContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  return /* @__PURE__ */ jsxDEV(TrunkPanel, { createLocation: "/app/workspace/core/contacts/new", returnLocation: "/app/workspace", children: [
    /* @__PURE__ */ jsxDEV(NestingAwareBlock, { shouldHide: shouldShowALeafToo, children: [
      sortedContacts.length === 0 && /* @__PURE__ */ jsxDEV(EntityNoNothingCard, { title: "No Contacts", message: "There are no contacts to show. You can create a new contact.", newEntityLocations: "/app/workspace/core/contacts/new", helpSubject: import_webapi_client.DocsHelpSubject.ROOT }, void 0, false, {
        fileName: "app/routes/app/workspace/core/contacts.tsx",
        lineNumber: 61,
        columnNumber: 41
      }, this),
      /* @__PURE__ */ jsxDEV(EntityStack, { children: sortedContacts.map((contact) => /* @__PURE__ */ jsxDEV(EntityCard, { entityId: `contact-${contact.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityLink, { to: `/app/workspace/core/contacts/${contact.ref_id}`, children: /* @__PURE__ */ jsxDEV(EntityNameComponent, { name: contact.name }, void 0, false, {
        fileName: "app/routes/app/workspace/core/contacts.tsx",
        lineNumber: 66,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/app/workspace/core/contacts.tsx",
        lineNumber: 65,
        columnNumber: 15
      }, this) }, `contact-${contact.ref_id}`, false, {
        fileName: "app/routes/app/workspace/core/contacts.tsx",
        lineNumber: 64,
        columnNumber: 42
      }, this)) }, void 0, false, {
        fileName: "app/routes/app/workspace/core/contacts.tsx",
        lineNumber: 63,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/workspace/core/contacts.tsx",
      lineNumber: 60,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
      fileName: "app/routes/app/workspace/core/contacts.tsx",
      lineNumber: 73,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/app/workspace/core/contacts.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, this)
  ] }, "core/contacts", true, {
    fileName: "app/routes/app/workspace/core/contacts.tsx",
    lineNumber: 59,
    columnNumber: 10
  }, this);
}
_s(Contacts, "6VOSNsymovskJ3yw4Wn6TAbuqwU=", false, function() {
  return [useLoaderDataSafeForAnimation, useTrunkNeedsToShowLeaf];
});
_c = Contacts;
var ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the contacts! Please try again!`
});
var _c;
$RefreshReg$(_c, "Contacts");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  Contacts as default,
  handle,
  shouldRevalidate
};
//# sourceMappingURL=/build/routes/app/workspace/core/contacts-SMYJ3QZS.js.map
