import type { RecurringTaskPeriod } from "@jupiter/webapi-client";
import { ApiError, Difficulty, Eisen } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import { useContext } from "react";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { RecurringTaskGenParamsBlock } from "@jupiter/core/common/component/recurring-task-gen-params-block";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  SectionCard,
  ActionsPosition,
} from "@jupiter/core/infra/component/section-card";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { CircleMultiSelect } from "@jupiter/core/prm/sub/circle/components/multi-select";
import {
  fixSelectOutputEntityId,
  selectZod,
} from "@jupiter/core/common/select-form";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  name: z.string(),
  circleRefIds: selectZod(z.string()),
  catchUpPeriod: z.string(),
  catchUpEisen: z.nativeEnum(Eisen).optional(),
  catchUpDifficulty: z.nativeEnum(Difficulty).optional(),
  catchUpActionableFromDay: z.string().optional(),
  catchUpActionableFromMonth: z.string().optional(),
  catchUpDueAtDay: z.string().optional(),
  catchUpDueAtMonth: z.string().optional(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  try {
    const result = await apiClient.prm.circleFind({
      allow_archived: false,
    });
    const settings = await apiClient.prm.personLoadSettings({});

    return json({
      allCircles: result.circles,
      maxCirclesPerPerson: settings.max_circles_per_person,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }
    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.prm.personCreate({
      name: form.name,
      circle_ref_ids: fixSelectOutputEntityId(form.circleRefIds) || [],
      catch_up_period:
        form.catchUpPeriod === "none"
          ? undefined
          : (form.catchUpPeriod as RecurringTaskPeriod),
      catch_up_eisen:
        form.catchUpPeriod === "none"
          ? undefined
          : (form.catchUpEisen as Eisen),
      catch_up_difficulty:
        form.catchUpPeriod === "none"
          ? undefined
          : (form.catchUpDifficulty as Difficulty),
      catch_up_actionable_from_day:
        form.catchUpPeriod === "none"
          ? undefined
          : form.catchUpActionableFromDay === undefined ||
              form.catchUpActionableFromDay === ""
            ? undefined
            : parseInt(form.catchUpActionableFromDay),
      catch_up_actionable_from_month:
        form.catchUpPeriod === "none"
          ? undefined
          : form.catchUpActionableFromMonth === undefined ||
              form.catchUpActionableFromMonth === ""
            ? undefined
            : parseInt(form.catchUpActionableFromMonth),
      catch_up_due_at_day:
        form.catchUpPeriod === "none"
          ? undefined
          : form.catchUpDueAtDay === undefined || form.catchUpDueAtDay === ""
            ? undefined
            : parseInt(form.catchUpDueAtDay),
      catch_up_due_at_month:
        form.catchUpPeriod === "none"
          ? undefined
          : form.catchUpDueAtMonth === undefined ||
              form.catchUpDueAtMonth === ""
            ? undefined
            : parseInt(form.catchUpDueAtMonth),
    });

    return redirect(`/app/workspace/prm/persons/${result.new_person.ref_id}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewPerson() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="persons/new"
      fakeKey={"persons/new"}
      returnLocation="/app/workspace/prm/persons"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="New Person"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="person-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "person-create",
                text: "Create",
                value: "create",
                highlight: true,
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
          <CircleMultiSelect
            name="circleRefIds"
            label="Circles"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allCircles={loaderData.allCircles}
            defaultValue={[]}
            maxSelections={loaderData.maxCirclesPerPerson}
          />
          <FieldError actionResult={actionData} fieldName="/circle_ref_ids" />
        </FormControl>

        <StandardDivider title="Catch Up" size="small" />

        <RecurringTaskGenParamsBlock
          namePrefix="catchUp"
          fieldsPrefix="catch_up"
          allowNonePeriod
          period={"none"}
          eisen={null}
          difficulty={null}
          actionableFromDay={null}
          actionableFromMonth={null}
          dueAtDay={null}
          dueAtMonth={null}
          inputsEnabled={inputsEnabled}
          actionData={actionData}
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/prm/persons`,
  ParamsSchema,
  {
    error: () => `There was an error creating the person! Please try again!`,
  },
);
