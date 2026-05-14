import {
  TimezoneSelect
} from "/build/_shared/chunk-BM5NLVDW.js";
import {
  UserFeatureFlagsEditor,
  WorkspaceFeatureFlagsEditor
} from "/build/_shared/chunk-WIJDIBWU.js";
import {
  BirthYearSelect
} from "/build/_shared/chunk-6KSNNK5R.js";
import "/build/_shared/chunk-W2LTCAXB.js";
import {
  BirthdaySelect
} from "/build/_shared/chunk-LR4KQCWM.js";
import "/build/_shared/chunk-IRHCW4HP.js";
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
  makeRootErrorBoundary
} from "/build/_shared/chunk-LT7567PB.js";
import "/build/_shared/chunk-A6MOWSJE.js";
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
import {
  ExpandMore_default
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  external_exports
} from "/build/_shared/chunk-PFTZ3POA.js";
import "/build/_shared/chunk-43PAR6MS.js";
import "/build/_shared/chunk-L6BTFETC.js";
import {
  getHosting
} from "/build/_shared/chunk-NLP5SXQ3.js";
import {
  AccordionDetails_default,
  AccordionSummary_default,
  Accordion_default,
  FormControl_default,
  InputLabel_default,
  OutlinedInput_default,
  Stack_default,
  Typography_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import "/build/_shared/chunk-ONA7UHQ4.js";
import {
  GlobalPropertiesContext,
  ServicePropertiesContext
} from "/build/_shared/chunk-YEJBW4GC.js";
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
import "/build/_shared/chunk-KRGCHOK2.js";
import {
  require_api_clients
} from "/build/_shared/chunk-G6ECEEQ6.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
  useLoaderData,
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

// app/routes/app/init.tsx
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
    window.$RefreshRuntime$.register(type, '"app/routes/app/init.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/app/init.tsx"
  );
  import.meta.hot.lastModified = "1775685113112.0115";
}
var WorkspaceInitFormSchema = external_exports.object({
  userEmailAddress: external_exports.string(),
  userName: external_exports.string(),
  userTimezone: external_exports.string(),
  userFeatureFlags: external_exports.array(external_exports.nativeEnum(import_webapi_client.UserFeature)).or(external_exports.nativeEnum(import_webapi_client.UserFeature).transform((v) => [v])),
  authPassword: external_exports.string(),
  authPasswordRepeat: external_exports.string(),
  userBirthday: external_exports.string(),
  userBirthYear: external_exports.string().transform((v) => parseInt(v, 10)),
  workspaceName: external_exports.string(),
  workspaceRootAspectName: external_exports.string(),
  workspaceFirstScheduleStreamName: external_exports.string(),
  workspaceFeatureFlags: external_exports.array(external_exports.nativeEnum(import_webapi_client.WorkspaceFeature))
  // forAppReview: CheckboxAsString,
});
function WorkspaceInit() {
  _s();
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const globalProperties = (0, import_react2.useContext)(GlobalPropertiesContext);
  const serviceProperties = (0, import_react2.useContext)(ServicePropertiesContext);
  return /* @__PURE__ */ jsxDEV(StandaloneContainer, { children: [
    /* @__PURE__ */ jsxDEV(SmartAppBar, { children: [
      /* @__PURE__ */ jsxDEV(Logo, {}, void 0, false, {
        fileName: "app/routes/app/init.tsx",
        lineNumber: 136,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Title, {}, void 0, false, {
        fileName: "app/routes/app/init.tsx",
        lineNumber: 138,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(CommunityLink, {}, void 0, false, {
        fileName: "app/routes/app/init.tsx",
        lineNumber: 140,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DocsHelp, { size: "medium", subject: import_webapi_client.DocsHelpSubject.ROOT }, void 0, false, {
        fileName: "app/routes/app/init.tsx",
        lineNumber: 142,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/init.tsx",
      lineNumber: 135,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(LifecyclePanel, { children: [
      /* @__PURE__ */ jsxDEV(GlobalError, { actionResult: actionData }, void 0, false, {
        fileName: "app/routes/app/init.tsx",
        lineNumber: 146,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(SectionCard, { title: "New Account & Workspace", actionsPosition: 1 /* BELOW */, actions: /* @__PURE__ */ jsxDEV(SectionActions, { id: "init", topLevelInfo: EMPTY_CONTEXT, inputsEnabled, expansion: 0 /* ALWAYS_SHOW */, actions: [ActionSingle({
        text: "Create",
        value: "create",
        highlight: true
      }), NavMultipleCompact({
        navs: [NavSingle({
          text: "Login",
          link: "/app/login"
        }), NavSingle({
          text: "Reset Password",
          link: "/app/reset-password"
        }), NavSingle({
          text: "Pick Server",
          link: "/app/pick-server/desktop",
          disabled: serviceProperties.frontDoorInfo.appShell !== import_webapi_client.AppShell.DESKTOP_ELECTRON
        })]
      })] }, void 0, false, {
        fileName: "app/routes/app/init.tsx",
        lineNumber: 147,
        columnNumber: 103
      }, this), children: [
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "userEmailAddress", children: "Your Email Address" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 165,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { type: "email", autoComplete: "email", label: "Your Email Address", name: "userEmailAddress", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 166,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/user_email_address" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 167,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/init.tsx",
          lineNumber: 164,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "userName", children: "Your Name" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 171,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Your Name", name: "userName", readOnly: !inputsEnabled, defaultValue: "" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 172,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/user_name" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 173,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/init.tsx",
          lineNumber: 170,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "authPassword", children: "Password" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 177,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Password, { label: "Password", name: "authPassword", autoComplete: "new-password", inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 178,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/auth_password" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 179,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/init.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
          /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "authPasswordRepeat", children: "Password Repeat" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 183,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Password, { label: "Password Repeat", name: "authPasswordRepeat", inputsEnabled }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 184,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/auth_password_repeat" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 185,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/init.tsx",
          lineNumber: 182,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, direction: "row", children: [
          /* @__PURE__ */ jsxDEV(BirthdaySelect, { name: "userBirthday", allowNoneBirthday: false, inputsEnabled, initialValue: null }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 189,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(BirthYearSelect, { label: "Your Birth Year", name: "userBirthYear", inputsEnabled, allowNoneBirthYear: false }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 191,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 190,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/user_birthday" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 193,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/user_birth_year" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 194,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/init.tsx",
          lineNumber: 188,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
          /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 198,
            columnNumber: 43
          }, this), children: /* @__PURE__ */ jsxDEV(Typography_default, { children: "Advanced" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 199,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 198,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: /* @__PURE__ */ jsxDEV(Stack_default, { spacing: 2, useFlexGap: true, children: [
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(TimezoneSelect, { id: "userTimezone", name: "userTimezone", inputsEnabled }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 205,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/user_timezone" }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 207,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/init.tsx",
              lineNumber: 204,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "workspaceName", children: "Workspace Name" }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 211,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Workspace Name", name: "workspaceName", readOnly: !inputsEnabled, defaultValue: loaderData.defaultWorkspaceName }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 212,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/app/workspace_name" }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 213,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/init.tsx",
              lineNumber: 210,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "Root Aspect Name" }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 217,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "Root Aspect Name", name: "workspaceRootAspectName", readOnly: !inputsEnabled, defaultValue: loaderData.defaultRootAspectName }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 218,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/app/workspace_root_aspect_name" }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 219,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/init.tsx",
              lineNumber: 216,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: [
              /* @__PURE__ */ jsxDEV(InputLabel_default, { id: "name", children: "First Schedule Stream Name" }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 223,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(OutlinedInput_default, { label: "First Schdule Stream Name", name: "workspaceFirstScheduleStreamName", readOnly: !inputsEnabled, defaultValue: loaderData.defaultFirstScheduleStreamName }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 224,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(FieldError, { actionResult: actionData, fieldName: "/app/workspace_first_schedule_stream_name" }, void 0, false, {
                fileName: "app/routes/app/init.tsx",
                lineNumber: 225,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/app/init.tsx",
              lineNumber: 222,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 203,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 202,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/init.tsx",
          lineNumber: 197,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Accordion_default, { children: [
          /* @__PURE__ */ jsxDEV(AccordionSummary_default, { expandIcon: /* @__PURE__ */ jsxDEV(ExpandMore_default, {}, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 239,
            columnNumber: 43
          }, this), children: /* @__PURE__ */ jsxDEV(Typography_default, { children: "Feature Flags" }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 240,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 239,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(AccordionDetails_default, { children: [
            /* @__PURE__ */ jsxDEV(UserFeatureFlagsEditor, { name: "userFeatureFlags", inputsEnabled, featureFlagsControls: loaderData.userFeatureFlagControls, defaultFeatureFlags: loaderData.defaultUserFeatureFlags, hosting: getHosting(serviceProperties.frontDoorInfo.appPlatform) }, void 0, false, {
              fileName: "app/routes/app/init.tsx",
              lineNumber: 244,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(WorkspaceFeatureFlagsEditor, { name: "workspaceFeatureFlags", inputsEnabled, featureFlagsControls: loaderData.workspaceFeatureFlagControls, defaultFeatureFlags: loaderData.defaultWorkspaceFeatureFlags, hosting: getHosting(globalProperties.universe) }, void 0, false, {
              fileName: "app/routes/app/init.tsx",
              lineNumber: 245,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/app/init.tsx",
            lineNumber: 243,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/app/init.tsx",
          lineNumber: 238,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/app/init.tsx",
        lineNumber: 147,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/app/init.tsx",
      lineNumber: 145,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/app/init.tsx",
    lineNumber: 134,
    columnNumber: 10
  }, this);
}
_s(WorkspaceInit, "GsOQDId6bo8msHDFvNwA3mKvLiY=", false, function() {
  return [useLoaderData, useActionData, useNavigation];
});
_c = WorkspaceInit;
var ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error creating the workspace! Please try again!`
});
var _c;
$RefreshReg$(_c, "WorkspaceInit");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  ErrorBoundary,
  WorkspaceInit as default
};
//# sourceMappingURL=/build/routes/app/init-Q76EXUPW.js.map
