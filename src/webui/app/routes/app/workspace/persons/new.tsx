import type { Birthday, RecurringTaskPeriod } from "@jupiter/webapi-client";
import {
  ApiError,
  Difficulty,
  Eisen,
  PersonRelationship,
} from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import { useContext } from "react";
import { personRelationshipName } from "@jupiter/core/persons/relationship";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { BirthdaySelect } from "@jupiter/core/common/component/birthday-select";
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

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  name: z.string(),
  relationship: z.string(),
  birthday: z.string().optional(),
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

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.persons.personCreate({
      name: form.name,
      relationship: form.relationship as PersonRelationship,
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
      birthday:
        form.birthday === undefined || form.birthday === ""
          ? undefined
          : (form.birthday as Birthday),
    });

    return redirect(`/app/workspace/persons/${result.new_person.ref_id}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function NewPerson() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="persons/new"
      fakeKey={"persons/new"}
      returnLocation="/app/workspace/persons"
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
          <InputLabel id="relationship">Relationship</InputLabel>
          <Select
            labelId="relationship"
            name="relationship"
            readOnly={!inputsEnabled}
            defaultValue={PersonRelationship.FAMILY}
            label="Relationship"
          >
            {Object.values(PersonRelationship).map((relationship) => (
              <MenuItem key={relationship} value={relationship}>
                {personRelationshipName(relationship)}
              </MenuItem>
            ))}
          </Select>
          <FieldError actionResult={actionData} fieldName="/relationship" />
        </FormControl>

        <BirthdaySelect
          name="birthday"
          initialValue={null}
          inputsEnabled={inputsEnabled}
        />
        <FieldError actionResult={actionData} fieldName="/birthday" />

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
  `/app/workspace/persons`,
  ParamsSchema,
  {
    error: () => `There was an error creating the person! Please try again!`,
  },
);
