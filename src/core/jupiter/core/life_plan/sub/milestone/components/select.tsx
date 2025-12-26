import type { MilestoneSummary } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { aDateToDate } from "#/core/common/adate";
import { sortMilestonesNaturally } from "#/core/life_plan/sub/milestones/root";

interface MilestoneSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  allMilestones: MilestoneSummary[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

interface MilestoneOption {
  milestone_ref_id: string;
  label: string;
  bigName: string;
}

export function MilestoneSelect(props: MilestoneSelectProps) {
  const allMilestonesByRefId = useMemo(
    () => new Map(props.allMilestones.map((m) => [m.ref_id, m])),
    [props.allMilestones],
  );

  const sortedMilestones = useMemo(
    () => sortMilestonesNaturally(props.allMilestones),
    [props.allMilestones],
  );

  const allMilestonesAsOptions: MilestoneOption[] = useMemo(
    () =>
      sortedMilestones.map((milestone) => ({
        milestone_ref_id: milestone.ref_id,
        label: milestone.name,
        bigName: fullMilestoneName(milestone),
      })),
    [sortedMilestones],
  );

  function selectedMilestoneToOption(): MilestoneOption | undefined {
    const selectedMilestoneRefId = props.value || props.defaultValue;
    if (!selectedMilestoneRefId) {
      return undefined;
    }

    const milestone = allMilestonesByRefId.get(selectedMilestoneRefId);
    if (!milestone) {
      return undefined;
    }
    return {
      milestone_ref_id: selectedMilestoneRefId,
      label: milestone.name,
      bigName: fullMilestoneName(milestone),
    };
  }

  const [selectedMilestone, setSelectedMilestone] = useState<
    MilestoneOption | undefined
  >(selectedMilestoneToOption());

  useEffect(() => {
    const selectedMilestoneRefId = props.value || props.defaultValue;
    if (!selectedMilestoneRefId) {
      setSelectedMilestone(undefined);
      return;
    }

    const milestone = allMilestonesByRefId.get(selectedMilestoneRefId);
    if (!milestone) {
      setSelectedMilestone(undefined);
      return;
    }

    setSelectedMilestone({
      milestone_ref_id: selectedMilestoneRefId,
      label: milestone.name,
      bigName: fullMilestoneName(milestone),
    });
  }, [
    props.value,
    props.defaultValue,
    props.allMilestones,
    allMilestonesByRefId,
    sortedMilestones,
  ]);

  return (
    <>
      <Autocomplete
        disableClearable
        autoHighlight
        id={props.name}
        options={allMilestonesAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled}
        value={selectedMilestone}
        onChange={(_, v) => {
          setSelectedMilestone(v);
          if (props.onChange) {
            props.onChange(v.milestone_ref_id);
          }
        }}
        isOptionEqualToValue={(o, v) =>
          o.milestone_ref_id === v.milestone_ref_id
        }
        renderOption={(optionProps, option) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...restProps } = optionProps;
          return (
            <li {...restProps} key={key}>
              {option.bigName}
            </li>
          );
        }}
        renderInput={(params) => <TextField {...params} label={props.label} />}
      />

      <input
        type="hidden"
        name={props.name}
        value={selectedMilestone?.milestone_ref_id ?? ""}
      />
    </>
  );
}

function fullMilestoneName(milestone: MilestoneSummary): string {
  const formattedDate = aDateToDate(milestone.date)
    .setLocale("en-gb")
    .toLocaleString();
  return `${formattedDate} ${milestone.name}`;
}
