import {
  autocompleteSingleLineSx
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  Autocomplete_default,
  TextField_default,
  jsx
} from "/build/_shared/chunk-QJ3XFSPL.js";
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

// ../core/jupiter/core/common/component/birth-year-select.tsx
var import_react = __toESM(require_react(), 1);
var MIN_BIRTH_YEAR = 1901;
var MAX_BIRTH_YEAR = 2099;
var DEFAULT_BIRTH_YEAR = 1990;
var NONE_BIRTH_YEAR = "N/A";
var NONE_OPTION = { year: null, label: "N/A" };
function yearToOption(year) {
  return { year, label: `${year}` };
}
function optionFromInitialValue(initialValue, allowNoneBirthYear) {
  const initial = initialValue;
  if (initial === null || initial === void 0) {
    return allowNoneBirthYear ? NONE_OPTION : yearToOption(DEFAULT_BIRTH_YEAR);
  }
  if (initial < MIN_BIRTH_YEAR || initial > MAX_BIRTH_YEAR) {
    return allowNoneBirthYear ? NONE_OPTION : yearToOption(DEFAULT_BIRTH_YEAR);
  }
  return yearToOption(initial);
}
function BirthYearSelect(props) {
  const allowNoneBirthYear = props.allowNoneBirthYear ?? false;
  const allYearsAsOptions = Array.from(
    { length: MAX_BIRTH_YEAR - MIN_BIRTH_YEAR + 1 },
    (_, i) => MIN_BIRTH_YEAR + i
  ).filter(props.filter ?? (() => true)).map(yearToOption);
  if (allowNoneBirthYear) {
    allYearsAsOptions.unshift(NONE_OPTION);
  }
  const [selectedBirthYear, setSelectedBirthYear] = (0, import_react.useState)(
    optionFromInitialValue(
      props.defaultValue ?? props.value,
      allowNoneBirthYear
    )
  );
  (0, import_react.useEffect)(() => {
    setSelectedBirthYear(
      optionFromInitialValue(
        props.defaultValue ?? props.value,
        allowNoneBirthYear
      )
    );
  }, [props.defaultValue, props.value, allowNoneBirthYear]);
  const encodedBirthYearValue = (0, import_react.useMemo)(() => {
    if (selectedBirthYear.year === null) {
      return NONE_BIRTH_YEAR;
    }
    return `${selectedBirthYear.year}`;
  }, [selectedBirthYear]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        autoHighlight: true,
        disableClearable: !allowNoneBirthYear,
        id: props.name,
        options: allYearsAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled,
        sx: autocompleteSingleLineSx,
        value: selectedBirthYear,
        onChange: (e, v) => {
          if (v === null) {
            if (allowNoneBirthYear) {
              setSelectedBirthYear(NONE_OPTION);
            }
            return;
          }
          setSelectedBirthYear(v);
          props.onChange?.(v.year ?? DEFAULT_BIRTH_YEAR);
        },
        isOptionEqualToValue: (o, v) => o.year === v.year,
        renderOption: (props2, option) => {
          const { key, ...restProps } = props2;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.label);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: props.label }, void 0, false, {
          fileName: "../core/jupiter/core/common/component/birth-year-select.tsx",
          lineNumber: 118,
          columnNumber: 34
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/common/component/birth-year-select.tsx",
        lineNumber: 89,
        columnNumber: 7
      },
      this
    ),
    !props.onChange && /* @__PURE__ */ jsxDEV("input", { name: props.name, type: "hidden", value: encodedBirthYearValue }, void 0, false, {
      fileName: "../core/jupiter/core/common/component/birth-year-select.tsx",
      lineNumber: 121,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/common/component/birth-year-select.tsx",
    lineNumber: 88,
    columnNumber: 5
  }, this);
}

export {
  BirthYearSelect
};
//# sourceMappingURL=/build/_shared/chunk-6KSNNK5R.js.map
