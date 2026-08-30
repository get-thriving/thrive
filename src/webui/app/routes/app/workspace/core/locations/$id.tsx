import type { Location } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
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
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string().optional(),
    addressLine: z.string().optional(),
    country: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.locations.locationLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      location: result.location as Location,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.locations.locationUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: emptyToNull(form.name),
          },
          address_line: {
            should_change: true,
            value: emptyToNull(form.addressLine),
          },
          country: {
            should_change: true,
            value: emptyToNull(form.country),
          },
          gps: {
            should_change: true,
            value: gpsFromForm(form.latitude, form.longitude),
          },
        });

        return redirect(`/app/workspace/core/locations/${id}`);
      }

      case "archive": {
        await apiClient.locations.locationArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/locations/${id}`);
      }

      case "remove": {
        await apiClient.locations.locationRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/locations`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function LocationDetail() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id } = useParams();
  const inputsEnabled = navigation.state === "idle";

  const location = loaderData.location;

  return (
    <LeafPanel
      key={`core/locations/${location.ref_id}`}
      fakeKey={`core/locations/${location.ref_id}`}
      returnLocation="/app/workspace/core/locations"
      inputsEnabled={inputsEnabled}
      showArchiveAndRemoveButton
      entityArchived={location.archived}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title={`Location ${location.name}`}
        actions={
          <SectionActions
            id={`location-${location.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "location-update",
                text: "Update",
                value: "update",
                highlight: true,
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
            defaultValue={location.name}
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/name/value" />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="addressLine">Address</InputLabel>
          <OutlinedInput
            label="Address"
            name="addressLine"
            defaultValue={location.address_line ?? ""}
            readOnly={!inputsEnabled}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/address_line/value"
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="country">Country</InputLabel>
          <OutlinedInput
            label="Country"
            name="country"
            defaultValue={location.country ?? ""}
            readOnly={!inputsEnabled}
            inputProps={{ maxLength: 2 }}
          />
          <FieldError actionResult={actionData} fieldName="/country/value" />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="latitude">Latitude</InputLabel>
          <OutlinedInput
            label="Latitude"
            name="latitude"
            type="number"
            defaultValue={location.gps?.latitude ?? ""}
            readOnly={!inputsEnabled}
            inputProps={{ step: "any" }}
          />
          <FieldError actionResult={actionData} fieldName="/gps/value" />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="longitude">Longitude</InputLabel>
          <OutlinedInput
            label="Longitude"
            name="longitude"
            type="number"
            defaultValue={location.gps?.longitude ?? ""}
            readOnly={!inputsEnabled}
            inputProps={{ step: "any" }}
          />
        </FormControl>

        <input name="id" type="hidden" value={id ?? location.ref_id} />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/core/locations`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find location #${params.id}!`,
    error: (params) =>
      `There was an error loading location #${params.id}! Please try again!`,
  },
);
