import type { ProjectSummary, EntityId } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface ProjectOption {
  project_ref_id: EntityId;
  label: string;
  bigName: string;
}

interface ProjectMultiSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  allProjects: ProjectSummary[];
  exceptRefId?: EntityId;
  defaultValue?: EntityId[];
  value?: EntityId[];
  onChange?: (value: EntityId[]) => void;
  maxSelections?: number;
}

export function ProjectMultiSelect(props: ProjectMultiSelectProps) {
  const isBigScreen = useBigScreen();

  const selectedRefIds = useMemo(
    () => props.value ?? props.defaultValue ?? [],
    [props.value, props.defaultValue],
  );

  // A selected project can be missing from the summaries - it might be
  // archived, or live in another workspace. Keep an option for it around so
  // saving doesn't silently drop it.
  const allProjectsAsOptions: ProjectOption[] = useMemo(() => {
    const options = [...props.allProjects]
      .filter((project) => project.ref_id !== props.exceptRefId)
      .sort((b1, b2) => String(b1.name).localeCompare(String(b2.name)))
      .map((project) => projectToOption(project));
    for (const refId of selectedRefIds) {
      if (options.some((option) => option.project_ref_id === refId)) {
        continue;
      }
      options.push(unknownProjectToOption(refId));
    }
    return options;
  }, [props.allProjects, props.exceptRefId, selectedRefIds]);

  const optionsByRefId = useMemo(
    () =>
      new Map(
        allProjectsAsOptions.map((option) => [option.project_ref_id, option]),
      ),
    [allProjectsAsOptions],
  );

  const [selectedProjects, setSelectedProjects] = useState<ProjectOption[]>(
    () => selectedRefIdsToOptions(selectedRefIds, optionsByRefId),
  );

  useEffect(() => {
    setSelectedProjects(
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
        options={allProjectsAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled || allProjectsAsOptions.length === 0}
        multiple
        disableCloseOnSelect
        sx={autocompleteSingleLineSx}
        value={selectedProjects}
        getOptionDisabled={(o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedProjects.length;
          const alreadySelected = selectedProjects.some(
            (x) => x.project_ref_id === o.project_ref_id,
          );
          return selectedCount >= maxSelections && !alreadySelected;
        }}
        onChange={(_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (
            maxSelections &&
            v.length > maxSelections &&
            v.length > selectedProjects.length
          ) {
            // User is trying to add more than allowed; ignore.
            return;
          }
          setSelectedProjects(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.project_ref_id));
          }
        }}
        isOptionEqualToValue={(o, v) => o.project_ref_id === v.project_ref_id}
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
        value={selectedProjects.map((b) => b.project_ref_id).join(",")}
      />
    </>
  );
}

function projectToOption(project: ProjectSummary): ProjectOption {
  return {
    project_ref_id: project.ref_id,
    label: String(project.name),
    bigName: String(project.name),
  };
}

function unknownProjectToOption(refId: EntityId): ProjectOption {
  return {
    project_ref_id: refId,
    label: `Project #${refId}`,
    bigName: `Project #${refId}`,
  };
}

function selectedRefIdsToOptions(
  refIds: EntityId[],
  optionsByRefId: Map<EntityId, ProjectOption>,
): ProjectOption[] {
  return refIds
    .map((refId) => optionsByRefId.get(refId))
    .filter((o): o is ProjectOption => Boolean(o));
}
