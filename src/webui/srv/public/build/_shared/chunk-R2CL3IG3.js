import {
  autocompleteSingleLineSx
} from "/build/_shared/chunk-4OJDBATO.js";
import {
  useBigScreen
} from "/build/_shared/chunk-RTCBJPLQ.js";
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

// ../core/jupiter/core/prm/sub/circle/components/multi-select.tsx
var import_react = __toESM(require_react(), 1);

// ../core/jupiter/core/prm/sub/circle/root.ts
function sortCirclesNaturally(circles) {
  const collator = new Intl.Collator(void 0, {
    numeric: true,
    sensitivity: "base"
  });
  return [...circles].sort((a, b) => {
    return collator.compare(String(a.name), String(b.name));
  });
}

// ../core/jupiter/core/prm/sub/circle/components/multi-select.tsx
function CircleMultiSelect(props) {
  const isBigScreen = useBigScreen();
  const allCirclesByRefId = (0, import_react.useMemo)(
    () => new Map(props.allCircles.map((c) => [c.ref_id, c])),
    [props.allCircles]
  );
  const sortedCircles = (0, import_react.useMemo)(
    () => sortCirclesNaturally(props.allCircles),
    [props.allCircles]
  );
  const allCirclesAsOptions = (0, import_react.useMemo)(
    () => sortedCircles.map((circle) => ({
      circle_ref_id: circle.ref_id,
      label: String(circle.name),
      bigName: String(circle.name)
    })),
    [sortedCircles]
  );
  function selectedCirclesToOptions() {
    const refIds = props.value ?? props.defaultValue ?? [];
    return refIds.map((refId) => allCirclesByRefId.get(refId)).filter((c) => Boolean(c)).map((c) => ({
      circle_ref_id: c.ref_id,
      label: String(c.name),
      bigName: String(c.name)
    }));
  }
  const [selectedCircles, setSelectedCircles] = (0, import_react.useState)(
    selectedCirclesToOptions()
  );
  (0, import_react.useEffect)(() => {
    const refIds = props.value ?? props.defaultValue ?? [];
    setSelectedCircles(
      refIds.map((refId) => allCirclesByRefId.get(refId)).filter((c) => Boolean(c)).map((c) => ({
        circle_ref_id: c.ref_id,
        label: String(c.name),
        bigName: String(c.name)
      }))
    );
  }, [props.value, props.defaultValue, props.allCircles, allCirclesByRefId]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        autoHighlight: true,
        id: props.name,
        limitTags: isBigScreen ? 2 : 3,
        size: "small",
        options: allCirclesAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled || allCirclesAsOptions.length === 0,
        multiple: true,
        disableCloseOnSelect: true,
        sx: autocompleteSingleLineSx,
        value: selectedCircles,
        getOptionDisabled: (o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedCircles.length;
          const alreadySelected = selectedCircles.some(
            (x) => x.circle_ref_id === o.circle_ref_id
          );
          return selectedCount >= maxSelections && !alreadySelected;
        },
        onChange: (_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (maxSelections && v.length > maxSelections && v.length > selectedCircles.length) {
            return;
          }
          setSelectedCircles(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.circle_ref_id));
          }
        },
        isOptionEqualToValue: (o, v) => o.circle_ref_id === v.circle_ref_id,
        getOptionLabel: (o) => o.bigName,
        renderOption: (optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(
          TextField_default,
          {
            ...params,
            label: props.label,
            helperText: props.maxSelections ? `Select up to ${props.maxSelections}.` : void 0
          },
          void 0,
          false,
          {
            fileName: "../core/jupiter/core/prm/sub/circle/components/multi-select.tsx",
            lineNumber: 130,
            columnNumber: 11
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/prm/sub/circle/components/multi-select.tsx",
        lineNumber: 81,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedCircles.map((c) => c.circle_ref_id).join(",")
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/prm/sub/circle/components/multi-select.tsx",
        lineNumber: 142,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/prm/sub/circle/components/multi-select.tsx",
    lineNumber: 80,
    columnNumber: 5
  }, this);
}

export {
  CircleMultiSelect
};
//# sourceMappingURL=/build/_shared/chunk-R2CL3IG3.js.map
