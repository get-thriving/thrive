import { OccasionKind } from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { BirthdaySelect } from "@jupiter/core/common/component/birthday-select";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { OccasionKindSelect } from "#/core/apps/prm/sub/person/sub/occasion/components/kind-select";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherAware,
  createAnotherLocation,
  isCreateAndAnother,
} from "@jupiter/core/infra/create-and-another";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  kind: z.nativeEnum(OccasionKind),
  date: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: personId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.prm.occasionCreate({
      person_ref_id: personId,
      name: form.name,
      kind: form.kind,
      date: form.date,
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/apps/prm/persons/${personId}/occasions/${result.new_occasion.ref_id}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function OccasionNew() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id: personId } = useParams();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="occasions/new"
      isLeaflet
      fakeKey="occasions/new"
      returnLocation={`/app/workspace/apps/prm/persons/${personId}`}
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="occasion-properties"
        title="Properties"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="occasion-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput label="Name" name="name" readOnly={!inputsEnabled} />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="kind">Kind</FormLabel>
          <OccasionKindSelect
            name="kind"
            defaultValue={OccasionKind.BIRTHDAY}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/kind" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="date">Date</FormLabel>
          <BirthdaySelect
            name="date"
            inputsEnabled={inputsEnabled}
            allowNoneBirthday={false}
          />
          <FieldError actionResult={actionData} fieldName="/birthday" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export default createAnotherAware(OccasionNew);

export const ErrorBoundary = makeLeafErrorBoundary("../..", ParamsSchema, {
  error: () => `There was an error creating the occasion! Please try again!`,
});
