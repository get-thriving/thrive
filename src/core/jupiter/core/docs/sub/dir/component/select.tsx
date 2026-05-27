import type { Dir } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import {
  collectDirRefIdsInSubtree,
  computeDirDepthFromRoot,
  sortDirsByTreeOrder,
} from "#/core/docs/sub/dir/root";

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

  const options = useMemo(
    () =>
      sortedEligible.map((dir) => ({
        dir_ref_id: dir.ref_id,
        label: dir.name,
        bigName: formatDirOptionLabel(dir, allDirsByRefId),
      })),
    [sortedEligible, allDirsByRefId],
  );

  const selectedToOption = useCallback(
    (refId: string | undefined) => {
      const id =
        refId ?? props.defaultValue ?? props.value ?? sortedEligible[0]?.ref_id;
      if (!id) {
        throw new Error("DirSelect: no directories available.");
      }
      const dir = allDirsByRefId.get(id)!;
      return {
        dir_ref_id: id,
        label: dir.name,
        bigName: formatDirOptionLabel(dir, allDirsByRefId),
      };
    },
    [props.defaultValue, props.value, sortedEligible, allDirsByRefId],
  );

  const [selected, setSelected] = useState(() => selectedToOption(undefined));

  useEffect(() => {
    const refId = props.value ?? props.defaultValue;
    if (refId && allDirsByRefId.has(refId)) {
      setSelected(selectedToOption(refId));
    }
  }, [props.value, props.defaultValue, allDirsByRefId, selectedToOption]);

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
