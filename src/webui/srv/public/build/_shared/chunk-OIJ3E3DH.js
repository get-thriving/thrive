import {
  computeAspectDistanceFromRoot,
  sortAspectsByTreeOrder
} from "/build/_shared/chunk-37FGSNWH.js";
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

// ../core/jupiter/core/life_plan/sub/aspects/component/select.tsx
var import_react = __toESM(require_react(), 1);
function AspectSelect(props) {
  const rootAspect = props.allAspects.find((p) => !p.parent_aspect_ref_id);
  const allAspectsByRefId = (0, import_react.useMemo)(
    () => new Map(props.allAspects.map((p) => [p.ref_id, p])),
    [props.allAspects]
  );
  const sortedAspects = sortAspectsByTreeOrder(props.allAspects);
  const allAspectsAsOptions = sortedAspects.map((aspect) => ({
    aspect_ref_id: aspect.ref_id,
    label: aspect.name,
    bigName: fullAspectName(aspect, allAspectsByRefId)
  }));
  function selectedAspectToOption() {
    const aspectRefId = props.value || props.defaultValue || rootAspect?.ref_id;
    const aspect = allAspectsByRefId.get(aspectRefId);
    return {
      aspect_ref_id: aspectRefId,
      label: aspect.name,
      bigName: fullAspectName(aspect, allAspectsByRefId)
    };
  }
  const [selectedAspect, setSelectedAspect] = (0, import_react.useState)(
    selectedAspectToOption()
  );
  (0, import_react.useEffect)(() => {
    const aspectRefId = props.value || props.defaultValue || rootAspect?.ref_id;
    const aspect = allAspectsByRefId.get(aspectRefId);
    setSelectedAspect({
      aspect_ref_id: aspectRefId,
      label: aspect.name,
      bigName: fullAspectName(aspect, allAspectsByRefId)
    });
  }, [
    props.value,
    props.defaultValue,
    props.allAspects,
    allAspectsByRefId,
    rootAspect
  ]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        disableClearable: true,
        autoHighlight: true,
        id: props.name,
        options: allAspectsAsOptions,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled,
        sx: autocompleteSingleLineSx,
        value: selectedAspect,
        onChange: (e, v) => {
          setSelectedAspect(v);
          if (props.onChange) {
            props.onChange(v.aspect_ref_id);
          }
        },
        isOptionEqualToValue: (o, v) => o.aspect_ref_id === v.aspect_ref_id,
        renderOption: (props2, option) => {
          const { key, ...restProps } = props2;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: props.label }, void 0, false, {
          fileName: "../core/jupiter/core/life_plan/sub/aspects/component/select.tsx",
          lineNumber: 91,
          columnNumber: 34
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/aspects/component/select.tsx",
        lineNumber: 66,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "hidden",
        name: props.name,
        value: selectedAspect.aspect_ref_id
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/life_plan/sub/aspects/component/select.tsx",
        lineNumber: 94,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/life_plan/sub/aspects/component/select.tsx",
    lineNumber: 65,
    columnNumber: 5
  }, this);
}
function fullAspectName(aspect, allAspectsByRefId) {
  const indent = computeAspectDistanceFromRoot(aspect, allAspectsByRefId);
  return `${"-".repeat(indent)} ${aspect.name}`;
}

export {
  AspectSelect
};
//# sourceMappingURL=/build/_shared/chunk-OIJ3E3DH.js.map
