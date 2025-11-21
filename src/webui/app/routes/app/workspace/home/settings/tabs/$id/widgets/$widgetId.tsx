import { ApiError, WidgetDimension } from "@jupiter/webapi-client";
import { FormControl, InputLabel } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext, useState, useEffect } from "react";
import { z } from "zod";
import { parseForm, parseParams, parseQuery } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { WidgetTypeSelector } from "@jupiter/core/home/component/widget-type-selector";
import { WidgetDimensionSelector } from "@jupiter/core/home/component/widget-dimension-selector";
import { RowAndColSelector } from "@jupiter/core/home/component/row-and-col-selector";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  widgetId: z.string(),
});

const QuerySchema = z.object({
  row: z.coerce.number().optional(),
  col: z.coerce.number().optional(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    widgetRow: z.coerce.number(),
    widgetCol: z.coerce.number(),
    widgetDimension: z.nativeEnum(WidgetDimension),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id, widgetId } = parseParams(params, ParamsSchema);

  const homeConfig = await apiClient.home.homeConfigLoad({});

  const tab = await apiClient.home.homeTabLoad({
    ref_id: id,
    allow_archived: false,
  });

  const widget = await apiClient.home.homeWidgetLoad({
    ref_id: widgetId,
    allow_archived: true,
  });

  return json({
    widget: widget.widget,
    widgetConstraints: homeConfig.widget_constraints,
    tab: tab.tab,
    widgets: tab.widgets,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id, widgetId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.home.homeWidgetMoveAndResize({
          ref_id: widgetId,
          row: form.widgetRow,
          col: form.widgetCol,
          dimension: form.widgetDimension,
        });

        return redirect(`/app/workspace/home/settings/tabs/${id}`);
      }

      case "archive":
        await apiClient.home.homeWidgetArchive({
          ref_id: widgetId,
        });
        return redirect(`/app/workspace/home/settings/tabs/${id}`);

      case "remove":
        await apiClient.home.homeWidgetRemove({
          ref_id: widgetId,
        });
        return redirect(`/app/workspace/home/settings/tabs/${id}`);

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
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

export default function Widget() {
  const { id } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(parseQuery(searchParams, QuerySchema));

  useEffect(() => {
    setQuery(parseQuery(searchParams, QuerySchema));
  }, [searchParams]);

  return (
    <LeafPanel
      key={`home-tab-widgets-${loaderData.widget.ref_id}`}
      fakeKey={`home/settings/tabs/${id}/widgets/${loaderData.widget.ref_id}`}
      returnLocation={`/app/workspace/home/settings/tabs/${id}`}
      inputsEnabled={inputsEnabled}
      showArchiveAndRemoveButton
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Widget Settings"
        actions={
          <SectionActions
            id="widget-actions"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "widget-update",
                text: "Update",
                value: "update",
                disabled: !inputsEnabled,
                highlight: false,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth disabled>
          <InputLabel id="type">Type</InputLabel>
          <WidgetTypeSelector
            user={topLevelInfo.user}
            workspace={topLevelInfo.workspace}
            name="type"
            inputsEnabled={false}
            defaultValue={loaderData.widget.the_type}
            target={loaderData.tab.target}
            widgetConstraints={loaderData.widgetConstraints}
          />
        </FormControl>

        <FormControl fullWidth disabled>
          <RowAndColSelector
            namePrefix="widget"
            target={loaderData.tab.target}
            homeTab={loaderData.tab}
            widgets={loaderData.widgets}
            row={query.row ?? loaderData.widget.geometry.row}
            col={query.col ?? loaderData.widget.geometry.col}
            inputsEnabled={inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName={"/row"} />
          <FieldError actionResult={actionData} fieldName={"/col"} />
        </FormControl>

        <FormControl fullWidth disabled>
          <InputLabel id="dimension">Dimension</InputLabel>
          <WidgetDimensionSelector
            name="widgetDimension"
            inputsEnabled={inputsEnabled}
            defaultValue={loaderData.widget.geometry.dimension}
            target={loaderData.tab.target}
            widgetType={loaderData.widget.the_type}
            widgetConstraints={loaderData.widgetConstraints}
          />
          <FieldError actionResult={actionData} fieldName={"/dimension"} />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/home/settings",
  ParamsSchema,
  {
    notFound: () => `Could not find the widget!`,
    error: () => `There was an error managing the widget! Please try again!`,
  },
);
