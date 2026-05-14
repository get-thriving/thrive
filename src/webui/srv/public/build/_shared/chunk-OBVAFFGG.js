import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
import {
  ToggleButtonGroup_default,
  ToggleButton_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx
var import_webapi_client2 = __toESM(require_dist(), 1);
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/prm/sub/person/sub/occasion/kind.ts
var import_webapi_client = __toESM(require_dist(), 1);
function occasionKindName(kind, isBigScreen = true) {
  switch (kind) {
    case import_webapi_client.OccasionKind.BIRTHDAY:
      return isBigScreen ? "Birthday" : "Bday";
    case import_webapi_client.OccasionKind.ANNIVERSARY:
      return isBigScreen ? "Anniversary" : "Anniv";
    case import_webapi_client.OccasionKind.HOLIDAY:
      return isBigScreen ? "Holiday" : "Holi";
    case import_webapi_client.OccasionKind.OTHER:
      return "Other";
  }
}

// ../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx
function OccasionKindSelect(props) {
  const isBigScreen = useBigScreen();
  const [kind, setKind] = (0, import_react.useState)(props.defaultValue);
  (0, import_react.useEffect)(() => {
    setKind(props.defaultValue);
  }, [props.defaultValue]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      ToggleButtonGroup_default,
      {
        value: kind,
        exclusive: true,
        fullWidth: true,
        onChange: (_, newKind) => newKind !== null && setKind(newKind),
        children: [
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "occasion-kind-birthday",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.OccasionKind.BIRTHDAY,
              children: occasionKindName(import_webapi_client2.OccasionKind.BIRTHDAY, isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx",
              lineNumber: 30,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "occasion-kind-anniversary",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.OccasionKind.ANNIVERSARY,
              children: occasionKindName(import_webapi_client2.OccasionKind.ANNIVERSARY, isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx",
              lineNumber: 38,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "occasion-kind-holiday",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.OccasionKind.HOLIDAY,
              children: occasionKindName(import_webapi_client2.OccasionKind.HOLIDAY, isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx",
              lineNumber: 46,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            ToggleButton_default,
            {
              size: "small",
              id: "occasion-kind-other",
              disabled: !props.inputsEnabled,
              value: import_webapi_client2.OccasionKind.OTHER,
              children: occasionKindName(import_webapi_client2.OccasionKind.OTHER, isBigScreen)
            },
            void 0,
            false,
            {
              fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx",
              lineNumber: 54,
              columnNumber: 9
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx",
        lineNumber: 24,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: kind }, void 0, false, {
      fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx",
      lineNumber: 63,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/prm/sub/person/sub/occasion/components/kind-select.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this);
}

export {
  OccasionKindSelect
};
//# sourceMappingURL=/build/_shared/chunk-OBVAFFGG.js.map
