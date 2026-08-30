import type { Contact, Location, SmartListItem, Tag } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Stack,
  Switch,
} from "@mui/material";

import { entityLinkStd } from "#/core/common/entity-link";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { LocationsEditor } from "#/core/common/sub/locations/component/locations-editor";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface SmartListItemEditorProps {
  item: SmartListItem;
  genericTags: Array<Tag>;
  contacts: Array<Contact>;
  location: Location | null;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  allLocations: Array<Location>;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
}

export function SmartListItemEditor(props: SmartListItemEditorProps) {
  const isBigScreen = useBigScreen();
  const {
    item,
    genericTags,
    contacts,
    location,
    allTags,
    allContacts,
    allLocations,
  } = props;

  return (
    <SectionCard
      title="Properties"
      actions={
        props.inputsEnabled ? (
          <SectionActions
            id="smart-list-item-properties"
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
            actions={[
              ActionSingle({
                id: "smart-list-item-update",
                text: "Save",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        ) : undefined
      }
    >
      <Stack direction="row" useFlexGap spacing={1}>
        <FormControl fullWidth sx={{ flexGrow: 1 }}>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            defaultValue={item.name}
            name="name"
            readOnly={!props.inputsEnabled}
          />

          <FieldError actionResult={props.actionResult} fieldName="/name" />
        </FormControl>
      </Stack>

      <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
        <FormControl sx={{ flexGrow: 1, minWidth: "25%" }}>
          <TagsEditor
            name="generic_tags_names"
            aloneOnLine
            allTags={allTags}
            defaultValue={genericTags.map((t) => t.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.SMART_LIST_ITEM, item.ref_id)}
            label="Tags"
          />
        </FormControl>

        <FormControl sx={{ flexGrow: 1, minWidth: "25%" }}>
          <ContactsEditor
            name="contacts_names"
            aloneOnLine
            allContacts={allContacts}
            defaultValue={contacts.map((c) => c.ref_id)}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.SMART_LIST_ITEM, item.ref_id)}
            label="Contacts"
          />
        </FormControl>

        <FormControl sx={{ flexGrow: 1, minWidth: "25%" }}>
          <LocationsEditor
            name="location"
            aloneOnLine
            allLocations={allLocations}
            linkedLocation={location}
            defaultValue={location?.ref_id ?? null}
            inputsEnabled={props.inputsEnabled}
            owner={entityLinkStd(NamedEntityTag.SMART_LIST_ITEM, item.ref_id)}
          />
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <FormControlLabel
          control={
            <Switch
              name="isDone"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
              defaultChecked={item.is_done}
            />
          }
          label="Is Done"
        />
        <FieldError actionResult={props.actionResult} fieldName="/is_done" />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="url">Url [Optional]</InputLabel>
        <OutlinedInput
          label="Url"
          name="url"
          readOnly={!props.inputsEnabled}
          defaultValue={item.url}
        />
        <FieldError actionResult={props.actionResult} fieldName="/url" />
      </FormControl>
    </SectionCard>
  );
}
