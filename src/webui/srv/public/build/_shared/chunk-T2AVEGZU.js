import {
  computeAspectDistanceFromRoot,
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
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

// ../core/jupiter/core/life_plan/sub/aspects/component/multi-select.tsx
var import_react = __toESM(require_react(), 1);
function AspectMultiSelect(props) {
  const isBigScreen = useBigScreen();
  const allAspectsByRefId = (0, import_react.useMemo)(
    () => new Map(props.allAspects.map((p) => [p.ref_id, p])),
    [props.allAspects]
  );
  const allAspectsAsOptions = (0, import_react.useMemo)(() => {
    const sortedAspects = sortAspectsByTreeOrder(props.allAspects);
    return sortedAspects.map((aspect) => ({
      aspect_ref_id: aspect.ref_id,
      label: aspect.name,
      bigName: fullAspectName(aspect, allAspectsByRefId)
    }));
  }, [props.allAspects, allAspectsByRefId]);
  function selectedAspectRefIds() {
    return props.value ?? props.defaultValue ?? [];
  }
  function selectedAspectsToOptions() {
    const refIds = selectedAspectRefIds();
    return refIds.map((refId) => allAspectsByRefId.get(refId)).filter((p) => Boolean(p)).map((p) => ({
      aspect_ref_id: p.ref_id,
      label: p.name,
      bigName: fullAspectName(p, allAspectsByRefId)
    }));
  }
  const [selectedAspects, setSelectedAspects] = (0, import_react.useState)(
    selectedAspectsToOptions()
  );
  (0, import_react.useEffect)(() => {
    setSelectedAspects(selectedAspectsToOptions());
  }, [props.value, props.defaultValue, props.allAspects, allAspectsByRefId]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        autoHighlight: true,
        id: props.name,
        limitTags: isBigScreen ? 0 : 1,
        size: "small",
        options: allAspectsAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled,
        multiple: true,
        disableCloseOnSelect: true,
        sx: autocompleteSingleLineSx,
        value: selectedAspects,
        getOptionDisabled: (o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedAspects.length;
          const alreadySelected = selectedAspects.some(
            (x) => x.aspect_ref_id === o.aspect_ref_id
          );
          return selectedCount >= maxSelections && !alreadySelected;
        },
        onChange: (e, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (maxSelections && v.length > maxSelections && v.length > selectedAspects.length) {
            return;
          }
          setSelectedAspects(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.aspect_ref_id));
          }
        },
        isOptionEqualToValue: (o, v) => o.aspect_ref_id === v.aspect_ref_id,
        getOptionLabel: (o) => o.bigName,
        renderOption: (props2, option) => {
          const { key, ...restProps } = props2;
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
            fileName: "../core/jupiter/core/life_plan/sub/aspects/component/multi-select.tsx",
            lineNumber: 123,
            columnNumber: 11
          },
          this
        )
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/aspects/component/multi-select.tsx",
        lineNumber: 73,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedAspects.map((p) => p.aspect_ref_id).join(",")
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/aspects/component/multi-select.tsx",
        lineNumber: 135,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/sub/aspects/component/multi-select.tsx",
    lineNumber: 72,
    columnNumber: 5
  }, this);
}
function fullAspectName(aspect, allAspectsByRefId) {
  const indent = computeAspectDistanceFromRoot(aspect, allAspectsByRefId);
  return `${"-".repeat(indent)} ${aspect.name}`;
}

export {
  AspectMultiSelect
};
//# sourceMappingURL=/build/_shared/chunk-T2AVEGZU.js.map
