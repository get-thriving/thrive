import type { BigPlanSummary, EntityId } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface BigPlanOption {
  big_plan_ref_id: EntityId;
  label: string;
  bigName: string;
}

interface BigPlanMultiSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  allBigPlans: BigPlanSummary[];
  exceptRefId?: EntityId;
  defaultValue?: EntityId[];
  value?: EntityId[];
  onChange?: (value: EntityId[]) => void;
  maxSelections?: number;
}

export function BigPlanMultiSelect(props: BigPlanMultiSelectProps) {
  const isBigScreen = useBigScreen();

  const selectedRefIds = useMemo(
    () => props.value ?? props.defaultValue ?? [],
    [props.value, props.defaultValue],
  );

  // A selected big plan can be missing from the summaries - it might be
  // archived, or live in another workspace. Keep an option for it around so
  // saving doesn't silently drop it.
  const allBigPlansAsOptions: BigPlanOption[] = useMemo(() => {
    const options = [...props.allBigPlans]
      .filter((bigPlan) => bigPlan.ref_id !== props.exceptRefId)
      .sort((b1, b2) => String(b1.name).localeCompare(String(b2.name)))
      .map((bigPlan) => bigPlanToOption(bigPlan));
    for (const refId of selectedRefIds) {
      if (options.some((option) => option.big_plan_ref_id === refId)) {
        continue;
      }
      options.push(unknownBigPlanToOption(refId));
    }
    return options;
  }, [props.allBigPlans, props.exceptRefId, selectedRefIds]);

  const optionsByRefId = useMemo(
    () =>
      new Map(
        allBigPlansAsOptions.map((option) => [option.big_plan_ref_id, option]),
      ),
    [allBigPlansAsOptions],
  );

  const [selectedBigPlans, setSelectedBigPlans] = useState<BigPlanOption[]>(
    () => selectedRefIdsToOptions(selectedRefIds, optionsByRefId),
  );

  useEffect(() => {
    setSelectedBigPlans(
      selectedRefIdsToOptions(selectedRefIds, optionsByRefId),
    );
  }, [selectedRefIds, optionsByRefId]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        limitTags={isBigScreen ? 2 : 1}
        size="small"
        options={allBigPlansAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled || allBigPlansAsOptions.length === 0}
        multiple
        disableCloseOnSelect
        sx={autocompleteSingleLineSx}
        value={selectedBigPlans}
        getOptionDisabled={(o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedBigPlans.length;
          const alreadySelected = selectedBigPlans.some(
            (x) => x.big_plan_ref_id === o.big_plan_ref_id,
          );
          return selectedCount >= maxSelections && !alreadySelected;
        }}
        onChange={(_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (
            maxSelections &&
            v.length > maxSelections &&
            v.length > selectedBigPlans.length
          ) {
            // User is trying to add more than allowed; ignore.
            return;
          }
          setSelectedBigPlans(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.big_plan_ref_id));
          }
        }}
        isOptionEqualToValue={(o, v) => o.big_plan_ref_id === v.big_plan_ref_id}
        getOptionLabel={(o) => o.bigName}
        renderOption={(optionProps, option) => {
          const { key, ...restProps } = optionProps;
          return (
            <li {...restProps} key={key}>
              {option.bigName}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            helperText={
              props.maxSelections
                ? `Select up to ${props.maxSelections}.`
                : undefined
            }
          />
        )}
      />

      <input
        type="hidden"
        name={props.name}
        value={selectedBigPlans.map((b) => b.big_plan_ref_id).join(",")}
      />
    </>
  );
}

function bigPlanToOption(bigPlan: BigPlanSummary): BigPlanOption {
  return {
    big_plan_ref_id: bigPlan.ref_id,
    label: String(bigPlan.name),
    bigName: String(bigPlan.name),
  };
}

function unknownBigPlanToOption(refId: EntityId): BigPlanOption {
  return {
    big_plan_ref_id: refId,
    label: `Big Plan #${refId}`,
    bigName: `Big Plan #${refId}`,
  };
}

function selectedRefIdsToOptions(
  refIds: EntityId[],
  optionsByRefId: Map<EntityId, BigPlanOption>,
): BigPlanOption[] {
  return refIds
    .map((refId) => optionsByRefId.get(refId))
    .filter((o): o is BigPlanOption => Boolean(o));
}
