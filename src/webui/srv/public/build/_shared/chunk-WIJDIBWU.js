import {
  featureControlImpliesReadonly,
  userFeatureName,
  userFeatureToDocsHelpSubject,
  workspaceFeatureName,
  workspaceFeatureToDocsHelpSubject
} from "/build/_shared/chunk-W2LTCAXB.js";
import {
  DocsHelp
} from "/build/_shared/chunk-2EW4TTPM.js";
import {
  FormControlLabel_default,
  FormControl_default,
  Switch_default,
  Tooltip_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
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

// ../core/jupiter/core/workspaces/component/feature-flags-editor.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);

// ../core/jupiter/core/hosting.ts
var import_webapi_client = __toESM(require_dist(), 1);
function hostingName(hosting) {
  switch (hosting) {
    case import_webapi_client.Hosting.LOCAL:
      return "Local";
    case import_webapi_client.Hosting.HOSTED_GLOBAL:
      return "Hosted globally";
    case import_webapi_client.Hosting.SELF_HOSTED:
      return "Self-hosted";
  }
}

// ../core/jupiter/core/workspaces/component/feature-flags-editor.tsx
function UserFeatureFlagsEditor(props) {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: Object.values(import_webapi_client2.UserFeature).map((feature) => {
    const featureControl = props.featureFlagsControls.controls[feature];
    const featureFlag = props.defaultFeatureFlags[feature];
    let extraLabel = "";
    switch (featureControl) {
      case import_webapi_client2.FeatureControl.ALWAYS_ON:
        extraLabel = "Cannot disable, because this feature is necessary";
        break;
      case import_webapi_client2.FeatureControl.ALWAYS_OFF_HOSTING:
        extraLabel = `Cannot enable, due to the hosting mode being ${hostingName(
          props.hosting
        )}`;
        break;
      case import_webapi_client2.FeatureControl.ALWAYS_OFF_TECH:
        extraLabel = "Cannot enable, due to Thrive technical issues";
        break;
      case import_webapi_client2.FeatureControl.USER:
        break;
    }
    return /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(
      FormControlLabel_default,
      {
        control: /* @__PURE__ */ jsxDEV(Tooltip_default, { title: extraLabel, children: /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV(
            Switch_default,
            {
              name: props.name,
              value: feature,
              readOnly: !props.inputsEnabled || featureControlImpliesReadonly(featureControl),
              disabled: !props.inputsEnabled || featureControlImpliesReadonly(featureControl),
              defaultChecked: featureFlag
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
              lineNumber: 61,
              columnNumber: 21
            },
            this
          ),
          featureControl === import_webapi_client2.FeatureControl.ALWAYS_ON && /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: props.name, value: feature }, void 0, false, {
            fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
            lineNumber: 75,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 60,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 59,
          columnNumber: 17
        }, this),
        label: /* @__PURE__ */ jsxDEV(Tooltip_default, { title: extraLabel, children: /* @__PURE__ */ jsxDEV("span", { children: [
          userFeatureName(feature),
          " ",
          /* @__PURE__ */ jsxDEV(
            DocsHelp,
            {
              size: "small",
              subject: userFeatureToDocsHelpSubject(
                feature
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
              lineNumber: 84,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 82,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 81,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
        lineNumber: 57,
        columnNumber: 13
      },
      this
    ) }, feature, false, {
      fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
      lineNumber: 56,
      columnNumber: 11
    }, this);
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}
function WorkspaceFeatureFlagsEditor(props) {
  return /* @__PURE__ */ jsxDEV(Fragment, { children: Object.values(import_webapi_client2.WorkspaceFeature).map((feature) => {
    const featureControl = props.featureFlagsControls.controls[feature];
    const featureFlag = props.defaultFeatureFlags[feature];
    let extraLabel = "";
    switch (featureControl) {
      case import_webapi_client2.FeatureControl.ALWAYS_ON:
        extraLabel = "Cannot disable, because this feature is necessary";
        break;
      case import_webapi_client2.FeatureControl.ALWAYS_OFF_HOSTING:
        extraLabel = `Cannot enable, due to the hosting mode being ${hostingName(
          props.hosting
        )}`;
        break;
      case import_webapi_client2.FeatureControl.ALWAYS_OFF_TECH:
        extraLabel = "Cannot enable, due to Thrive technical issues";
        break;
      case import_webapi_client2.FeatureControl.USER:
        break;
    }
    return /* @__PURE__ */ jsxDEV(FormControl_default, { fullWidth: true, children: /* @__PURE__ */ jsxDEV(
      FormControlLabel_default,
      {
        control: /* @__PURE__ */ jsxDEV(Tooltip_default, { title: extraLabel, children: /* @__PURE__ */ jsxDEV("span", { children: [
          /* @__PURE__ */ jsxDEV(
            Switch_default,
            {
              name: props.name,
              value: feature,
              readOnly: !props.inputsEnabled || featureControlImpliesReadonly(featureControl),
              disabled: !props.inputsEnabled || featureControlImpliesReadonly(featureControl),
              defaultChecked: featureFlag
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
              lineNumber: 141,
              columnNumber: 21
            },
            this
          ),
          featureControl === import_webapi_client2.FeatureControl.ALWAYS_ON && /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: props.name, value: feature }, void 0, false, {
            fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
            lineNumber: 155,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 140,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 139,
          columnNumber: 17
        }, this),
        label: /* @__PURE__ */ jsxDEV(Tooltip_default, { title: extraLabel, children: /* @__PURE__ */ jsxDEV("span", { children: [
          workspaceFeatureName(feature),
          " ",
          /* @__PURE__ */ jsxDEV(
            DocsHelp,
            {
              size: "small",
              subject: workspaceFeatureToDocsHelpSubject(
                feature
              )
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
              lineNumber: 164,
              columnNumber: 21
            },
            this
          )
        ] }, void 0, true, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 162,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
          lineNumber: 161,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
        lineNumber: 137,
        columnNumber: 13
      },
      this
    ) }, feature, false, {
      fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
      lineNumber: 136,
      columnNumber: 11
    }, this);
  }) }, void 0, false, {
    fileName: "../core/jupiter/core/workspaces/component/feature-flags-editor.tsx",
    lineNumber: 113,
    columnNumber: 5
  }, this);
}

export {
  UserFeatureFlagsEditor,
  WorkspaceFeatureFlagsEditor
};
//# sourceMappingURL=/build/_shared/chunk-WIJDIBWU.js.map
