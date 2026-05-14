import {
  autocompleteSingleLineSx
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  Autocomplete_default,
  TextField_default
} from "/build/_shared/chunk-QJ3XFSPL.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/common/component/timezone-select.tsx
var import_react = __toESM(require_react(), 1);
function TimezoneSelect(props) {
  const allTimezonesAsOptions = Intl.supportedValuesOf("timeZone");
  const [realValue, setRealValue] = (0, import_react.useState)(
    props.initialValue || "Europe/London"
  );
  (0, import_react.useEffect)(() => {
    setRealValue(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);
  return /* @__PURE__ */ jsxDEV(
    Autocomplete_default,
    {
      id: props.id,
      options: allTimezonesAsOptions,
      readOnly: !props.inputsEnabled,
      sx: autocompleteSingleLineSx,
      value: realValue,
      onChange: (event, newValue) => setRealValue(newValue),
      disableClearable: true,
      renderInput: (params) => /* @__PURE__ */ jsxDEV(
        TextField_default,
        {
          ...params,
          name: props.name,
          autoComplete: "off",
          label: "Your Timezone"
        },
        void 0,
        false,
        {
          fileName: "../core/jupiter/core/common/component/timezone-select.tsx",
          lineNumber: 34,
          columnNumber: 9
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/common/component/timezone-select.tsx",
      lineNumber: 25,
      columnNumber: 5
    },
    this
  );
}

export {
  TimezoneSelect
};
//# sourceMappingURL=/build/_shared/chunk-BM5NLVDW.js.map
