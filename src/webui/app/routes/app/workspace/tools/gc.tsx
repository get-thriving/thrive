import { ApiError, SyncTarget } from "@jupiter/webapi-client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  InputLabel,
  styled,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { EntitySummaryLink } from "@jupiter/core/common/component/entity-summary-link";
import { AppComponentTag } from "@jupiter/core/infra/component/app-component-tag";
import { EntityCard } from "@jupiter/core/infra/component/entity-card";
import { makeToolErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { SyncTargetSelect } from "@jupiter/core/common/component/sync-target-select";
import { SyncTargetTag } from "@jupiter/core/common/component/sync-target-tag";
import { TimeDiffTag } from "@jupiter/core/common/component/time-diff-tag";
import {
  noErrorNoData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { fixSelectOutputToEnum, selectZod } from "~/logic/select";
import { getLoggedInApiClient } from "~/api-clients.server";

const GCFormSchema = z.object({
  gcTargets: selectZod(z.nativeEnum(SyncTarget)),
});

export const handle = {
  displayType: DisplayType.TOOL,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.gc.gCLoadRuns({});
  return json(response.entries);
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, GCFormSchema);

  try {
    await apiClient.gc.gCDo({
      gc_targets: fixSelectOutputToEnum<SyncTarget>(form.gcTargets),
    });

    return json(noErrorNoData());
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

export default function GC() {
  const entries = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <ToolPanel>
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Garbage Collection"
        actions={
          <SectionActions
            id="gc-actions"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Garbage Collect",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="gcTargets">Garbage Collect Targets</InputLabel>
          <SyncTargetSelect
            topLevelInfo={topLevelInfo}
            labelId="gcTargets"
            label="Garbage Collect Targets"
            name="gcTargets"
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/gc_targets" />
        </FormControl>
      </SectionCard>

      <StandardDivider title="Garbage Collection" size="large" />

      {entries.map((entry) => {
        return (
          <Accordion key={entry.ref_id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <AccordionHeader>
                Run from <AppComponentTag source={entry.source} />
                with {entry.entity_records.length} entities archived
                <TimeDiffTag
                  today={topLevelInfo.today}
                  labelPrefix="from"
                  collectionTime={entry.created_time}
                />
              </AccordionHeader>
            </AccordionSummary>

            <AccordionDetails>
              <GCTargetsSection>
                GC Targets:
                {entry.gc_targets.map((target) => (
                  <SyncTargetTag key={target} target={target} />
                ))}
              </GCTargetsSection>

              {entry.entity_records.map((record) => (
                <EntityCard key={record.ref_id}>
                  <EntitySummaryLink
                    today={topLevelInfo.today}
                    summary={record}
                  />
                </EntityCard>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </ToolPanel>
  );
}

export const ErrorBoundary = makeToolErrorBoundary(
  () => `There was an error garbage collecting! Please try again!`,
);

const AccordionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

const GCTargetsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  paddingBottom: theme.spacing(1),
}));
