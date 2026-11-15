import type {
  Contact,
  Location,
  Tag,
  TravelWish,
} from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";

import { entityLinkStd } from "#/core/common/entity-link";
import { ContactsEditor } from "#/core/common/sub/contacts/component/contacts-editor";
import { EntityLocationMapSection } from "#/core/common/sub/locations/component/entity-location-map-section";
import { LocationsMultiEditor } from "#/core/common/sub/locations/component/locations-multi-editor";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import type { ActionResult } from "#/core/infra/action-result";
import { FieldError } from "#/core/infra/component/errors";
import {
  ActionSingle,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { StrataSection } from "#/core/infra/component/strata-section";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface TravelWishEditorProps {
  travelWish: TravelWish;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  locations: Array<Location>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  inputsEnabled: boolean;
  topLevelInfo: TopLevelInfo;
  actionResult?: ActionResult<unknown>;
}

export function TravelWishEditor(props: TravelWishEditorProps) {
  const isBigScreen = useBigScreen();
  const { travelWish, tags, contacts, locations, allTags, allContacts } = props;

  return (
    <>
      <StrataSection
        id="travel-wish-properties-section"
        fixed
        title="Properties"
        actions={
          <SectionActions
            id="travel-wish-update"
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
            actions={[
              ActionSingle({
                id: "travel-wish-update",
                text: "Save",
                value: "update",
                highlight: true,
              }),
              NavSingle({
                id: "travel-wish-create-vacation",
                text: "Create vacation",
                link: `/app/workspace/apps/vacations/vacation/new-from-wish?travelWishId=${travelWish.ref_id}`,
                icon: <EventAvailableIcon />,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="name"
              name="name"
              readOnly={!props.inputsEnabled}
              disabled={!props.inputsEnabled}
              defaultValue={travelWish.name}
            />
            <FieldError actionResult={props.actionResult} fieldName="/name" />
          </FormControl>
        </Stack>

        <Stack
          direction={isBigScreen ? "row" : "column"}
          useFlexGap
          spacing={1}
        >
          <FormControl sx={{ flexGrow: 2, minWidth: 0 }}>
            <TagsEditor
              name="tags"
              aloneOnLine
              allTags={allTags}
              defaultValue={tags.map((tag) => tag.ref_id)}
              inputsEnabled={props.inputsEnabled}
              owner={entityLinkStd(
                NamedEntityTag.TRAVEL_WISH,
                travelWish.ref_id,
              )}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 2, minWidth: 0 }}>
            <ContactsEditor
              name="contacts_names"
              aloneOnLine
              allContacts={allContacts}
              defaultValue={contacts.map((contact) => contact.ref_id)}
              inputsEnabled={props.inputsEnabled}
              owner={entityLinkStd(
                NamedEntityTag.TRAVEL_WISH,
                travelWish.ref_id,
              )}
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 2, minWidth: 0 }}>
            <LocationsMultiEditor
              name="locations"
              aloneOnLine
              linkedLocations={locations}
              defaultValue={locations.map((location) => location.ref_id)}
              inputsEnabled={props.inputsEnabled}
              owner={entityLinkStd(
                NamedEntityTag.TRAVEL_WISH,
                travelWish.ref_id,
              )}
            />
          </FormControl>
        </Stack>
      </StrataSection>
      <EntityLocationMapSection locations={locations} />
    </>
  );
}
