import { Contact, Location, Tag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";

import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  ActionsPosition,
  SectionCard,
} from "#/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { handleActionApiError } from "#/core/infra/errors.server";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";
import { LocationTag } from "#/core/common/sub/locations/component/location-tag";
import { EntityLocationMapSection } from "#/core/common/sub/locations/component/entity-location-map-section";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  travelWishId: z.string(),
});

const CreateFormSchema = z.object({
  travelWishId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

  const result = await apiClient.vacations.travelWishLoad({
    ref_id: query.travelWishId,
    allow_archived: false,
  });

  return {
    travelWish: result.travel_wish,
    tags: result.tags as Array<Tag>,
    contacts: (result.contacts ?? []) as Array<Contact>,
    locations: (result.locations ?? []) as Array<Location>,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.vacations.vacationCreateFromTravelWish({
      travel_wish_ref_id: form.travelWishId,
      start_date: form.startDate,
      end_date: form.endDate,
    });

    return redirect(
      `/app/workspace/apps/vacations/vacation/${result.new_vacation.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewVacationFromWish() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key={`vacations/vacation/new-from-wish-${loaderData.travelWish.ref_id}`}
      fakeKey={`vacations/vacation/new-from-wish-${loaderData.travelWish.ref_id}`}
      returnLocation="/app/workspace/apps/vacations/wish-list"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Vacation From Wish"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="vacation-create-from-wish"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "vacation-create-from-wish",
                text: "Create",
                value: "create",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <input
          type="hidden"
          name="travelWishId"
          value={loaderData.travelWish.ref_id}
        />

        <FormControl fullWidth>
          <InputLabel id="name" shrink>
            Name
          </InputLabel>
          <OutlinedInput
            notched
            label="Name"
            name="name"
            readOnly
            disabled
            value={loaderData.travelWish.name}
          />
        </FormControl>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {loaderData.tags.map((tag) => (
            <TagTag key={tag.ref_id} tag={tag} />
          ))}
          {loaderData.contacts.map((contact) => (
            <ContactTag key={contact.ref_id} contact={contact} />
          ))}
          {loaderData.locations.map((location) => (
            <LocationTag key={location.ref_id} location={location} />
          ))}
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="startDate" shrink>
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="endDate" shrink>
            End Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="endDate"
            name="endDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/end_date" />
        </FormControl>
      </SectionCard>
      <EntityLocationMapSection locations={loaderData.locations} />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/vacations/wish-list",
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the vacation from the travel wish! Please try again!`,
  },
);
