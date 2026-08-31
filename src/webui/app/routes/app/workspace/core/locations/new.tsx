import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string().optional(),
  addressLine: z.string().optional(),
  country: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? null : trimmed;
}

function gpsFromForm(
  latitude: string | undefined,
  longitude: string | undefined,
): { latitude: number; longitude: number } | null {
  const lat = emptyToNull(latitude);
  const lng = emptyToNull(longitude);
  if (lat === null && lng === null) {
    return null;
  }
  return {
    latitude: lat === null ? Number.NaN : Number(lat),
    longitude: lng === null ? Number.NaN : Number(lng),
  };
}

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.locations.locationCreate({
      name: emptyToNull(form.name),
      address_line: emptyToNull(form.addressLine),
      country: emptyToNull(form.country),
      gps: gpsFromForm(form.latitude, form.longitude),
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/core/locations/${result.new_location.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewLocation() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";
  const [searchParams] = useSearchParams();
  const defaultName = searchParams.get("name") ?? "";
  const defaultAddressLine = searchParams.get("addressLine") ?? "";
  const defaultCountry = searchParams.get("country") ?? "";
  const defaultLatitude = searchParams.get("latitude") ?? "";
  const defaultLongitude = searchParams.get("longitude") ?? "";

  return (
    <LeafPanel
      key="core/locations/new"
      fakeKey={"core/locations/new"}
      returnLocation="/app/workspace/core/locations"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="New Location"
        actions={
          <SectionActions
            id="location-create-actions"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "location-create",
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                id: "location-create-and-another",
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            defaultValue={defaultName}
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="addressLine">Address</InputLabel>
          <OutlinedInput
            label="Address"
            name="addressLine"
            defaultValue={defaultAddressLine}
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/address_line" />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="country">Country</InputLabel>
          <OutlinedInput
            label="Country"
            name="country"
            defaultValue={defaultCountry}
            readOnly={!inputsEnabled}
            inputProps={{ maxLength: 2 }}
          />
          <FieldError actionResult={actionData} fieldName="/country" />
        </FormControl>
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="latitude">Latitude</InputLabel>
            <OutlinedInput
              label="Latitude"
              name="latitude"
              type="number"
              defaultValue={defaultLatitude}
              readOnly={!inputsEnabled}
              inputProps={{ step: "any" }}
            />
            <FieldError actionResult={actionData} fieldName="/gps/latitude" />
            <FieldError actionResult={actionData} fieldName="/gps" />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="longitude">Longitude</InputLabel>
            <OutlinedInput
              label="Longitude"
              name="longitude"
              type="number"
              defaultValue={defaultLongitude}
              readOnly={!inputsEnabled}
              inputProps={{ step: "any" }}
            />
            <FieldError actionResult={actionData} fieldName="/gps/longitude" />
          </FormControl>
        </Stack>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/core/locations`,
  ParamsSchema,
  {
    error: () => `There was an error creating the location! Please try again!`,
  },
);
