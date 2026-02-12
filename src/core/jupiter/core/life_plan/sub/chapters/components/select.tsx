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

interface ChapterSelectProps {
  name: string;
  label: string;
  inputsEnabled: boolean;
  disabled: boolean;
  onlyForProject?: EntityId;
  allChapters: ChapterSummary[];
  defaultValue?: EntityId | null;
  value?: EntityId | null;
  onChange?: (value: EntityId | null) => void;
  birthday: DateTime;
  today: DateTime;
  allMilestones: MilestoneSummary[];
  allProjects: ProjectSummary[];
}

interface ChapterOption {
  chapter_ref_id: EntityId;
  label: string;
  bigName: string;
}

export function ChapterSelect(props: ChapterSelectProps) {
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

  function selectedChapterToOption(): ChapterOption | null {
    const selectedChapterRefId = props.value || props.defaultValue;
    if (!selectedChapterRefId) {
      return null;
    }

    const chapter = allChaptersByRefId.get(selectedChapterRefId);
    if (!chapter) {
      return null;
    }

    return {
      chapter_ref_id: selectedChapterRefId,
      label: chapter.name,
      bigName: chapter.name,
    };
  }

  const [selectedChapter, setSelectedChapter] = useState<ChapterOption | null>(
    selectedChapterToOption(),
  );

  useEffect(() => {
    const selectedChapterRefId = props.value || props.defaultValue;
    if (!selectedChapterRefId) {
      setSelectedChapter(null);
      return;
    }

    const chapter = allChaptersByRefId.get(selectedChapterRefId);
    if (!chapter) {
      setSelectedChapter(null);
      return;
    }

    setSelectedChapter({
      chapter_ref_id: selectedChapterRefId,
      label: chapter.name,
      bigName: chapter.name,
    });
  }, [props.value, props.defaultValue, props.allChapters, allChaptersByRefId]);

  return (
    <>
      <Autocomplete
        autoHighlight
        id={props.name}
        options={allChaptersAsOptions}
        readOnly={!props.inputsEnabled}
        disabled={props.disabled || allChaptersAsOptions.length === 0}
        sx={autocompleteSingleLineSx}
        value={selectedChapter}
        onChange={(_, v) => {
          setSelectedChapter(v);
          if (props.onChange) {
            props.onChange(v?.chapter_ref_id ?? null);
          }
        }}
        isOptionEqualToValue={(o, v) => o.chapter_ref_id === v.chapter_ref_id}
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

      <input
        type="hidden"
        name={props.name}
        value={selectedChapter?.chapter_ref_id ?? ""}
      />
    </>
  );
}
