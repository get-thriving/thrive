import {
  collectDirRefIdsInSubtree,
  computeDirDepthFromRoot,
  sortDirsByTreeOrder
} from "/build/_shared/chunk-RDEY3YL3.js";
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

// ../core/jupiter/core/docs/sub/dir/component/select.tsx
var import_react = __toESM(require_react(), 1);
function DirSelect(props) {
  const allDirsByRefId = (0, import_react.useMemo)(
    () => new Map(props.allDirs.map((d) => [d.ref_id, d])),
    [props.allDirs]
  );
  const excludedRefIds = (0, import_react.useMemo)(() => {
    if (!props.excludeSubtreeRootRefId) {
      return /* @__PURE__ */ new Set();
    }
    return collectDirRefIdsInSubtree(
      props.excludeSubtreeRootRefId,
      props.allDirs
    );
  }, [props.allDirs, props.excludeSubtreeRootRefId]);
  const eligibleDirs = (0, import_react.useMemo)(() => {
    return props.allDirs.filter((d) => !excludedRefIds.has(d.ref_id));
  }, [props.allDirs, excludedRefIds]);
  const sortedEligible = (0, import_react.useMemo)(
    () => sortDirsByTreeOrder(eligibleDirs),
    [eligibleDirs]
  );
  const options = (0, import_react.useMemo)(
    () => sortedEligible.map((dir) => ({
      dir_ref_id: dir.ref_id,
      label: dir.name,
      bigName: formatDirOptionLabel(dir, allDirsByRefId)
    })),
    [sortedEligible, allDirsByRefId]
  );
  const selectedToOption = (0, import_react.useCallback)(
    (refId) => {
      const id = refId ?? props.defaultValue ?? props.value ?? sortedEligible[0]?.ref_id;
      if (!id) {
        throw new Error("DirSelect: no directories available.");
      }
      const dir = allDirsByRefId.get(id);
      return {
        dir_ref_id: id,
        label: dir.name,
        bigName: formatDirOptionLabel(dir, allDirsByRefId)
      };
    },
    [props.defaultValue, props.value, sortedEligible, allDirsByRefId]
  );
  const [selected, setSelected] = (0, import_react.useState)(() => selectedToOption(void 0));
  (0, import_react.useEffect)(() => {
    const refId = props.value ?? props.defaultValue;
    if (refId && allDirsByRefId.has(refId)) {
      setSelected(selectedToOption(refId));
    }
  }, [props.value, props.defaultValue, allDirsByRefId, selectedToOption]);
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(
      Autocomplete_default,
      {
        disableClearable: true,
        autoHighlight: true,
        id: props.name,
        options,
        readOnly: !props.inputsEnabled,
        disabled: props.disabled,
        sx: autocompleteSingleLineSx,
        value: selected,
        onChange: (_e, v) => {
          setSelected(v);
          props.onChange?.(v.dir_ref_id);
        },
        isOptionEqualToValue: (o, v) => o.dir_ref_id === v.dir_ref_id,
        renderOption: (optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return /* @__PURE__ */ jsx("li", { ...restProps, key }, option.bigName);
        },
        renderInput: (params) => /* @__PURE__ */ jsxDEV(TextField_default, { ...params, label: props.label }, void 0, false, {
          fileName: "../core/jupiter/core/docs/sub/dir/component/select.tsx",
          lineNumber: 114,
          columnNumber: 34
        }, this)
      },
      void 0,
      false,
      {
        fileName: "../core/jupiter/core/docs/sub/dir/component/select.tsx",
        lineNumber: 92,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("input", { type: "hidden", name: props.name, value: selected.dir_ref_id }, void 0, false, {
      fileName: "../core/jupiter/core/docs/sub/dir/component/select.tsx",
      lineNumber: 117,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "../core/jupiter/core/docs/sub/dir/component/select.tsx",
    lineNumber: 91,
    columnNumber: 5
  }, this);
}
function formatDirOptionLabel(dir, allDirsByRefId) {
  const depth = computeDirDepthFromRoot(dir, allDirsByRefId);
  return `${"-".repeat(depth)} ${dir.name}`;
}

export {
  DirSelect
};
//# sourceMappingURL=/build/_shared/chunk-4VS4VGIU.js.map
