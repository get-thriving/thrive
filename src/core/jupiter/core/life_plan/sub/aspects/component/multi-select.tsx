import type { ProjectSummary } from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import {
  computeProjectDistanceFromRoot,
  sortProjectsByTreeOrder,
} from "#/core/life_plan/sub/aspects/root";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface ProjectOption {
  project_ref_id: string;
  label: string;
  bigName: string;
}

interface ProjectMultiSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  allProjects: ProjectSummary[];
  defaultValue?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function ProjectMultiSelect(props: ProjectMultiSelectProps) {
  const isBigScreen = useBigScreen();
  const allProjectsByRefId = useMemo(
    () => new Map(props.allProjects.map((p) => [p.ref_id, p])),
    [props.allProjects],
  );

  const allProjectsAsOptions: ProjectOption[] = useMemo(() => {
    const sortedProjects = sortProjectsByTreeOrder(props.allProjects);
    return sortedProjects.map((project) => ({
      project_ref_id: project.ref_id,
      label: project.name,
      bigName: fullProjectName(project, allProjectsByRefId),
    }));
  }, [props.allProjects, allProjectsByRefId]);

  function selectedProjectRefIds(): string[] {
    return props.value ?? props.defaultValue ?? [];
  }

  function selectedProjectsToOptions(): ProjectOption[] {
    const refIds = selectedProjectRefIds();
    return refIds
      .map((refId) => allProjectsByRefId.get(refId))
      .filter((p): p is ProjectSummary => Boolean(p))
      .map((p) => ({
        project_ref_id: p.ref_id,
        label: p.name,
        bigName: fullProjectName(p, allProjectsByRefId),
      }));
  }

  const [selectedProjects, setSelectedProjects] = useState<ProjectOption[]>(
    selectedProjectsToOptions(),
  );

  useEffect(() => {
    setSelectedProjects(selectedProjectsToOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.defaultValue, props.allProjects, allProjectsByRefId]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        limitTags={isBigScreen ? 0 : 1}
        size="small"
        options={allProjectsAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled}
        multiple
        disableCloseOnSelect
        value={selectedProjects}
        onChange={(e, v) => {
          setSelectedProjects(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.project_ref_id));
          }
        }}
        isOptionEqualToValue={(o, v) => o.project_ref_id === v.project_ref_id}
        getOptionLabel={(o) => o.bigName}
        renderOption={(props, option) => {
          // eslint-disable-next-line react/prop-types
          const { key, ...restProps } = props;
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
        value={selectedProjects.map((p) => p.project_ref_id).join(",")}
      />
    </>
  );
}

function fullProjectName(
  project: ProjectSummary,
  allProjectsByRefId: Map<string, ProjectSummary>,
): string {
  const indent = computeProjectDistanceFromRoot(project, allProjectsByRefId);
  return `${"-".repeat(indent)} ${project.name}`;
}
