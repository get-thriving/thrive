import type { Contact, MetricEntry, Tag } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";

import { aDateToDate } from "#/core/common/adate";
import { entityLinkStd } from "#/core/common/entity-link";
import { TimeDiffTag } from "#/core/common/component/time-diff-tag";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface MetricEntryEditorProps {
  metricEntry: MetricEntry;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
}

export function MetricEntryEditor(props: MetricEntryEditorProps) {
  const isBigScreen = useBigScreen();
  const { metricEntry, tags, contacts, allTags, allContacts } = props;

  return (
    <SectionCard
      title="Properties"
      actions={
        props.inputsEnabled ? (
          <SectionActions
            id="metric-entry-properties"
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
            actions={[
              ActionSingle({
                id: "metric-entry-update",
                text: "Save",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        ) : undefined
      }
    >
      <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
        <TimeDiffTag
          today={props.topLevelInfo.today}
          labelPrefix="Collected"
          collectionTime={metricEntry.collection_time}
        />

        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <TagsEditor
            name="tags"
            label={null}
            aloneOnLine
            allTags={allTags}
            defaultValue={tags.map((tag) => tag.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(
              NamedEntityTag.METRIC_ENTRY,
              metricEntry.ref_id,
            )}
          />
        </FormControl>

        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <ContactsEditor
            name="contacts_names"
            label={null}
            aloneOnLine
            allContacts={allContacts}
            defaultValue={contacts.map((contact) => contact.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(
              NamedEntityTag.METRIC_ENTRY,
              metricEntry.ref_id,
            )}
          />
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <InputLabel id="collectionTime" shrink>
          Collection Time
        </InputLabel>
        <OutlinedInput
          type="date"
          notched
          label="collectionTime"
          defaultValue={
            metricEntry.collection_time
              ? aDateToDate(metricEntry.collection_time).toFormat("yyyy-MM-dd")
              : undefined
          }
          name="collectionTime"
          readOnly={!props.inputsEnabled}
          disabled={!props.inputsEnabled}
        />

        <FieldError
          actionResult={props.actionResult}
          fieldName="/collection_time"
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="value">Value</InputLabel>
        <OutlinedInput
          type="number"
          inputProps={{ step: "any" }}
          label="Value"
          name="value"
          readOnly={!props.inputsEnabled}
          defaultValue={metricEntry.value}
        />
        <FieldError actionResult={props.actionResult} fieldName="/value" />
      </FormControl>
    </SectionCard>
  );
}
