import {
  Password
} from "/build/_shared/chunk-TAFZP6GZ.js";
import {
  LifecyclePanel,
  Logo,
  StandaloneContainer
} from "/build/_shared/chunk-ABCRCQCW.js";
import {
  SectionCard
} from "/build/_shared/chunk-5BGG5EU6.js";
import {
  ActionSingle,
  NavMultipleCompact,
  NavSingle,
  SectionActions
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  FieldError,
  GlobalError
} from "/build/_shared/chunk-ETVCQIGU.js";
import "/build/_shared/chunk-MF4Q6G6N.js";
import "/build/_shared/chunk-XZXYTCEJ.js";
import {
  CommunityLink,
  SmartAppBar,
  Title
} from "/build/_shared/chunk-UVXGDSKE.js";
import {
  DocsHelp
} from "/build/_shared/chunk-2EW4TTPM.js";
import "/build/_shared/chunk-ZFIM7NDI.js";
import {
  EMPTY_CONTEXT
} from "/build/_shared/chunk-DQUBQ63X.js";
import "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-L6BTFETC.js";
import "/build/_shared/chunk-NLP5SXQ3.js";
import {
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default
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
import "/build/_shared/chunk-VB6MSCNJ.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
  useNavigation
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

// app/routes/app/reset-password.tsx
var import_webapi_client = __toESM(require_dist());
var import_node = __toESM(require_node());
var import_zodix = __toESM(require_dist2());
var import_api_clients = __toESM(require_api_clients());
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/app/reset-password.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/reset-password.tsx"
  );
  import.meta.hot.lastModified = "1775685113183.3525";
}
var RecoverAccountFormSchema = external_exports.object({
  emailAddress: external_exports.string(),
  recoveryToken: external_exports.string(),
  newPassword: external_exports.string(),
  newPasswordRepeat: external_exports.string()
});
function ResetPassword() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  return /* @__PURE__ */ jsxDEV(StandaloneContainer, { children: [
    /* @__PURE__ */ jsxDEV(SmartAppBar, { children: [
      /* @__PURE__ */ jsxDEV(Logo, {}, void 0, false, {
        fileName: "app/routes/app/reset-password.tsx",
        lineNumber: 90,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Title, {}, void 0, false, {
        fileName: "app/routes/app/reset-password.tsx",
        lineNumber: 91,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(CommunityLink, {}, void 0, false, {
        fileName: "app/routes/app/reset-password.tsx",
        lineNumber: 93,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DocsHelp, { size: "medium", subject: import_webapi_client.DocsHelpSubject.ROOT, theId: "docs-help" }, void 0, false, {
        fileName: "app/routes/app/reset-password.tsx",
        lineNumber: 95,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/reset-password.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(LifecyclePanel, { children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/reset-password.tsx",
        lineNumber: 99,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "Reset Password", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "reset-password", topLevelInfo: EMPTY_CONTEXT, inputsEnabled, expansion: 0 /* ALWAYS_SHOW */, actions: [ActionSingle({
        text: "Reset Password",
        value: "reset",
        highlight: true
      }), NavMultipleCompact({
        navs: [NavSingle({
          text: "Login",
          link: "/app/login"
        }), NavSingle({
          text: "New Workspace",
          link: "/app/init"
        })]
      })] }, void 0, false, {
        fileName: "app/routes/app/reset-password.tsx",
        lineNumber: 100,
        columnNumber: 94
      }, this), children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { htmlFor: "emailAddress", children: "Email Address" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 114,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Email Address", name: "emailAddress", type: "email", autoComplete: "email", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 115,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/email_address" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 116,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/reset-password.tsx",
          lineNumber: 113,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { htmlFor: "recoveryToken", children: "Recovery Token" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 120,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Recovery Token", name: "recoveryToken", type: "text", autoComplete: "off", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 121,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/recovery_token" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 122,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/reset-password.tsx",
          lineNumber: 119,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { htmlFor: "newPassword", children: "New Password" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 126,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Password, { label: "New Password", name: "newPassword", autoComplete: "new-password", inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 127,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/new_password" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 128,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/reset-password.tsx",
          lineNumber: 125,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { htmlFor: "newPasswordRepeat", children: "Repeat New Password" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 132,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Password, { label: "Repeat New Password", name: "newPasswordRepeat", inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 135,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/new_password_repeat" }, void 0, false, {
            fileName: "app/routes/app/reset-password.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/reset-password.tsx",
          lineNumber: 131,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/reset-password.tsx",
        lineNumber: 100,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/reset-password.tsx",
      lineNumber: 98,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/reset-password.tsx",
    lineNumber: 88,
    columnNumber: 10
  }, this);
}
_s(ResetPassword, "e3rMULficn7ldQYYArv00m53mwQ=", false, function() {
  return [useActionData, useNavigation];
});
_c = ResetPassword;
var _c;
$RefreshReg$(_c, "ResetPassword");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ResetPassword as default
};
//# sourceMappingURL=/build/routes/app/reset-password-ELC4YPZZ.js.map
