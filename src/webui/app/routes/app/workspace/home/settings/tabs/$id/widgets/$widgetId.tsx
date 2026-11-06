import type { BigPlan, Habit } from "@jupiter/webapi-client";
import {
  KeyBigPlansProgressHomeWidgetProperties,
  KeyHabitsStreaksHomeWidgetProperties,
  NamedEntityTag,
  WidgetDimension,
  WidgetType,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, Typography } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router";
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
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { WidgetTypeSelector } from "@jupiter/core/home/component/widget-type-selector";
import { WidgetDimensionSelector } from "@jupiter/core/home/component/widget-dimension-selector";
import { WidgetPropertiesEditor } from "@jupiter/core/home/component/widget-properties-editor";
import { RowAndColSelector } from "@jupiter/core/home/component/row-and-col-selector";
import {
  widgetPropertiesFromForm,
  widgetTypeHasProperties,
} from "@jupiter/core/home/sub/widget/root";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

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
    intent: z.literal("update-properties"),
    propertiesKind: z.union([
      z.literal(KeyHabitsStreaksHomeWidgetProperties.kind.KEY_HABITS_STREAKS),
      z.literal(
        KeyBigPlansProgressHomeWidgetProperties.kind.KEY_BIG_PLANS_PROGRESS,
      ),
    ]),
    // Each editor submits its own field, so only one of these is ever there.
    habitRefIds: z.string().optional(),
    bigPlanRefIds: z.string().optional(),
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

  try {
    const [homeConfig, tab, widget] = await Promise.all([
      apiClient.home.homeConfigLoad({}),
      apiClient.home.homeTabLoad({
        ref_id: id,
        allow_archived: false,
      }),
      apiClient.home.homeWidgetLoad({
        ref_id: widgetId,
        allow_archived: true,
      }),
    ]);

    // Only the widgets that have properties to configure need the habits or big
    // plans to pick from, and those can only be listed when the workspace has
    // the feature turned on.
    let allHabits: Habit[] = [];
    let allBigPlans: BigPlan[] = [];
    let propertiesUnavailableMessage: string | null = null;
    if (widgetTypeHasProperties(widget.widget.the_type)) {
      const summaries = await apiClient.application.getSummaries({
        include_workspace: true,
      });
      const workspace = summaries.workspace!;
      switch (widget.widget.the_type) {
        case WidgetType.KEY_HABITS_STREAKS: {
          if (
            !isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.HABITS)
          ) {
            propertiesUnavailableMessage =
              "The habits feature is not enabled in this workspace, so the habits this widget shows cannot be changed.";
            break;
          }
          const habitsResponse = await apiClient.habits.habitFind({
            allow_archived: false,
            include_tags: false,
            include_notes: false,
            include_life_plan: false,
            include_inbox_tasks: false,
          });
          allHabits = habitsResponse.entries.map(
            (entry) => entry.habit,
          ) as Habit[];
          break;
        }
        case WidgetType.KEY_BIG_PLANS_PROGRESS: {
          if (
            !isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.BIG_PLANS)
          ) {
            propertiesUnavailableMessage =
              "The big plans feature is not enabled in this workspace, so the big plans this widget shows cannot be changed.";
            break;
          }
          const bigPlansResponse = await apiClient.bigPlans.bigPlanFind({
            allow_archived: false,
          });
          allBigPlans = bigPlansResponse.entries.map(
            (entry) => entry.big_plan,
          ) as BigPlan[];
          break;
        }
      }
    }

    return {
      widget: widget.widget,
      widgetConstraints: homeConfig.widget_constraints,
      tab: tab.tab,
      widgets: tab.widgets,
      allHabits,
      allBigPlans,
      propertiesUnavailableMessage,
    };
  } catch (error) {
    handleLoaderApiError(error);
  }
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

      case "update-properties": {
        await apiClient.home.homeWidgetUpdateProperties({
          ref_id: widgetId,
          properties: widgetPropertiesFromForm(form),
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
    return handleActionApiError(error);
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
      entityType={NamedEntityTag.HOME_WIDGET}
      entityRefId={loaderData.widget.ref_id}
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

      {widgetTypeHasProperties(loaderData.widget.the_type) && (
        <SectionCard
          title="Widget Properties"
          actions={
            <SectionActions
              id="widget-properties-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "widget-update-properties",
                  text: "Update",
                  value: "update-properties",
                  disabled:
                    !inputsEnabled ||
                    loaderData.propertiesUnavailableMessage !== null,
                  highlight: false,
                }),
              ]}
            />
          }
        >
          {loaderData.propertiesUnavailableMessage === null ? (
            <WidgetPropertiesEditor
              widgetType={loaderData.widget.the_type}
              properties={loaderData.widget.properties}
              allHabits={loaderData.allHabits}
              allBigPlans={loaderData.allBigPlans}
              inputsEnabled={inputsEnabled}
            />
          ) : (
            <Typography color="text.secondary">
              {loaderData.propertiesUnavailableMessage}
            </Typography>
          )}
          <FieldError actionResult={actionData} fieldName="/properties" />
        </SectionCard>
      )}
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
