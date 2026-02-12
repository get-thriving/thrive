import type {
  ChapterSummary,
  EntityId,
  MilestoneSummary,
  ProjectSummary,
} from "@jupiter/webapi-client";
import { Autocomplete, TextField } from "@mui/material";
import type { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { autocompleteSingleLineSx } from "#/core/common/component/autocomplete-sx";
import { sortChaptersNaturally } from "#/core/life_plan/sub/chapters/root";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface ChapterOption {
  chapter_ref_id: EntityId;
  label: string;
  bigName: string;
}

interface ChapterMultiSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  onlyForProject?: EntityId;
  allChapters: ChapterSummary[];
  defaultValue?: EntityId[];
  value?: EntityId[];
  onChange?: (value: EntityId[]) => void;
  maxSelections?: number;
  birthday: DateTime;
  today: DateTime;
  allMilestones: MilestoneSummary[];
  allProjects: ProjectSummary[];
}

export function ChapterMultiSelect(props: ChapterMultiSelectProps) {
  const isBigScreen = useBigScreen();
  const allChaptersByRefId = useMemo(
    () => new Map(props.allChapters.map((c) => [c.ref_id, c])),
    [props.allChapters],
  );

  const sortedChapters = useMemo(() => {
    return sortChaptersNaturally(
      props.birthday,
      props.today,
      props.allChapters,
      props.allMilestones,
      props.allProjects,
    );
  }, [
    props.allChapters,
    props.birthday,
    props.today,
    props.allMilestones,
    props.allProjects,
  ]);

  const allChaptersAsOptions: ChapterOption[] = useMemo(
    () =>
      sortedChapters
        .filter(
          (chapter) =>
            !props.onlyForProject ||
            chapter.project_ref_id === props.onlyForProject,
        )
        .map((chapter) => ({
          chapter_ref_id: chapter.ref_id,
          label: chapter.name,
          bigName: chapter.name,
        })),
    [sortedChapters, props.onlyForProject],
  );

  function selectedChaptersToOptions(): ChapterOption[] {
    const refIds = props.value ?? props.defaultValue ?? [];
    return refIds
      .map((refId) => allChaptersByRefId.get(refId))
      .filter((c): c is ChapterSummary => Boolean(c))
      .map((c) => ({
        chapter_ref_id: c.ref_id,
        label: c.name,
        bigName: c.name,
      }));
  }

  const [selectedChapters, setSelectedChapters] = useState<ChapterOption[]>(
    selectedChaptersToOptions(),
  );

  useEffect(() => {
    const refIds = props.value ?? props.defaultValue ?? [];
    setSelectedChapters(
      refIds
        .map((refId) => allChaptersByRefId.get(refId))
        .filter((c): c is ChapterSummary => Boolean(c))
        .map((c) => ({
          chapter_ref_id: c.ref_id,
          label: c.name,
          bigName: c.name,
        })),
    );
  }, [props.value, props.defaultValue, props.allChapters, allChaptersByRefId]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        limitTags={isBigScreen ? 0 : 1}
        size="small"
        options={allChaptersAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled || allChaptersAsOptions.length === 0}
        multiple
        disableCloseOnSelect
        sx={autocompleteSingleLineSx}
        value={selectedChapters}
        getOptionDisabled={(o) => {
          const maxSelections = props.maxSelections ?? null;
          if (!maxSelections) {
            return false;
          }
          const selectedCount = selectedChapters.length;
          const alreadySelected = selectedChapters.some(
            (x) => x.chapter_ref_id === o.chapter_ref_id,
          );
          return selectedCount >= maxSelections && !alreadySelected;
        }}
        onChange={(_, v) => {
          const maxSelections = props.maxSelections ?? null;
          if (
            maxSelections &&
            v.length > maxSelections &&
            v.length > selectedChapters.length
          ) {
            // User is trying to add more than allowed; ignore.
            return;
          }
          setSelectedChapters(v);
          if (props.onChange) {
            props.onChange(v.map((x) => x.chapter_ref_id));
          }
        }}
        isOptionEqualToValue={(o, v) => o.chapter_ref_id === v.chapter_ref_id}
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
        value={selectedChapters.map((c) => c.chapter_ref_id).join(",")}
      />
    </>
  );
}
