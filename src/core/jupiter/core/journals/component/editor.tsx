import type { Journal, Tag } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import { entityLinkStd } from "#/core/common/entity-link";
import { PeriodSelect } from "#/core/common/component/period-select";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface JournalEditorProps {
  journal: Journal;
  tags: Array<Tag>;
  allTags: Array<Tag>;
  inputsEnabled: boolean;
  corePropertyEditable: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
}

export function JournalEditor(props: JournalEditorProps) {
  const isBigScreen = useBigScreen();
  const { journal, tags, allTags } = props;
  const timeConfigEditable =
    props.inputsEnabled && props.corePropertyEditable;

  return (
    <SectionCard
      title="Properties"
      actions={
        props.inputsEnabled ? (
          <SectionActions
            id="journal-properties"
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
            actions={[
              ActionSingle({
                id: "journal-change-time-config",
                text: "Change Time Config",
                value: "change-time-config",
                disabled: !timeConfigEditable,
                highlight: true,
              }),
              ActionSingle({
                id: "journal-refresh-stats",
                text: "Refresh Stats",
                value: "refresh-stats",
                disabled: !props.inputsEnabled,
              }),
            ]}
          />
        ) : undefined
      }
    >
      <Stack
        direction={isBigScreen ? "row" : "column"}
        spacing={2}
        useFlexGap
      >
        <FormControl fullWidth>
          <InputLabel id="rightNow" shrink margin="dense">
            The Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="rightNow"
            name="rightNow"
            readOnly={!timeConfigEditable}
            defaultValue={journal.right_now}
            disabled={!timeConfigEditable}
          />

          <FieldError
            actionResult={props.actionResult}
            fieldName="/right_now"
          />
        </FormControl>

        <FormControl fullWidth>
          <PeriodSelect
            labelId="period"
            label="Period"
            name="period"
            inputsEnabled={timeConfigEditable}
            defaultValue={journal.period}
          />
          <FieldError actionResult={props.actionResult} fieldName="/status" />
        </FormControl>

        <FormControl fullWidth>
          <TagsEditor
            name="tags"
            allTags={allTags}
            defaultValue={tags.map((tag) => tag.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.JOURNAL, journal.ref_id)}
          />
        </FormControl>
      </Stack>
    </SectionCard>
  );
}
