import type { Dir } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete";
import {
  collectDirRefIdsInSubtree,
  computeDirDepthFromRoot,
  sortDirsByTreeOrder,
} from "#/core/apps/docs/sub/dir/root";

export interface DirSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  /** Every folder in the workspace (typically from ``dirFind``). */
  allDirs: Dir[];
  /**
   * When picking a parent folder, exclude this folder and its descendants so the
   * tree stays acyclic.
   */
  excludeSubtreeRootRefId?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

type DirOption = {
  dir_ref_id: string;
  label: string;
  bigName: string;
};

export function DirSelect(props: DirSelectProps) {
  const allDirsByRefId = useMemo(
    () => new Map(props.allDirs.map((d) => [d.ref_id, d])),
    [props.allDirs],
  );

  const excludedRefIds = useMemo(() => {
    if (!props.excludeSubtreeRootRefId) {
      return new Set<string>();
    }
    return collectDirRefIdsInSubtree(
      props.excludeSubtreeRootRefId,
      props.allDirs,
    );
  }, [props.allDirs, props.excludeSubtreeRootRefId]);

  const eligibleDirs = useMemo(() => {
    return props.allDirs.filter((d) => !excludedRefIds.has(d.ref_id));
  }, [props.allDirs, excludedRefIds]);

  const sortedEligible = useMemo(
    () => sortDirsByTreeOrder(eligibleDirs),
    [eligibleDirs],
  );

  const optionForDirRefId = useCallback(
    (id: string): DirOption => {
      const dir = allDirsByRefId.get(id);
      if (!dir) {
        // Shared entities can keep a parent/folder ref the viewer cannot load.
        return {
          dir_ref_id: id,
          label: "Folder",
          bigName: "Folder",
        };
      }
      return {
        dir_ref_id: id,
        label: dir.name,
        bigName: formatDirOptionLabel(dir, allDirsByRefId),
      };
    },
    [allDirsByRefId],
  );

  const options = useMemo(() => {
    const base = sortedEligible.map((dir) => optionForDirRefId(dir.ref_id));
    const selectedId = props.value ?? props.defaultValue;
    if (
      selectedId &&
      !base.some((option) => option.dir_ref_id === selectedId)
    ) {
      return [optionForDirRefId(selectedId), ...base];
    }
    return base;
  }, [sortedEligible, optionForDirRefId, props.value, props.defaultValue]);

  const selectedToOption = useCallback(
    (refId: string | undefined) => {
      const id =
        refId ?? props.defaultValue ?? props.value ?? sortedEligible[0]?.ref_id;
      if (!id) {
        throw new Error("DirSelect: no directories available.");
      }
      return optionForDirRefId(id);
    },
    [props.defaultValue, props.value, sortedEligible, optionForDirRefId],
  );

  const [selected, setSelected] = useState(() => selectedToOption(undefined));

  useEffect(() => {
    const refId = props.value ?? props.defaultValue;
    if (refId) {
      setSelected(selectedToOption(refId));
    }
  }, [props.value, props.defaultValue, selectedToOption]);

  return (
    <>
      <Autocomplete
        disableClearable
        autoHighlight
        id={props.name}
        options={options}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled}
        sx={autocompleteSingleLineSx}
        value={selected}
        onChange={(_e, v) => {
          setSelected(v);
          props.onChange?.(v.dir_ref_id);
        }}
        isOptionEqualToValue={(o, v) => o.dir_ref_id === v.dir_ref_id}
        renderOption={(optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return (
            <li {...restProps} key={key}>
              {option.bigName}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />

      <input type="hidden" name={props.name} value={selected.dir_ref_id} />
    </>
  );
}

function formatDirOptionLabel(
  dir: Dir,
  allDirsByRefId: Map<string, Dir>,
): string {
  const depth = computeDirDepthFromRoot(dir, allDirsByRefId);
  return `${"-".repeat(depth)} ${dir.name}`;
}
