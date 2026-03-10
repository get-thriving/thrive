import type { Contact, MetricEntry, Tag } from "@jupiter/webapi-client";
import {
  ApiError,
  DocsHelpSubject,
  TagNamespace,
} from "@jupiter/webapi-client";
import TuneIcon from "@mui/icons-material/Tune";
import { styled } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ResponsiveLine } from "@nivo/line";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { aDateToDate, compareADate } from "@jupiter/core/common/adate";
import { metricEntryName } from "@jupiter/core/metrics/sub/entry/root";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TimeDiffTag } from "@jupiter/core/common/component/time-diff-tag";
import {
  DisplayType,
  useBranchNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import {
  NavSingle,
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const response = await apiClient.metrics.metricLoad({
      ref_id: id,
      allow_archived: true,
      allow_archived_entries: false,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.METRIC_ENTRY],
    });
    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    const metricEntryContactPairs = await Promise.all(
      response.metric_entries.map(async (entry) => {
        const entryLoadResult = await apiClient.metrics.metricEntryLoad({
          ref_id: entry.ref_id,
          allow_archived: true,
        });
        return [
          entry.ref_id,
          entryLoadResult.contacts as Array<Contact>,
        ] as const;
      }),
    );
    const metricEntryContactsByRefId: { [key: string]: Array<Contact> } =
      Object.fromEntries(metricEntryContactPairs);

    return json({
      metric: response.metric,
      metricEntries: response.metric_entries,
      metricEntryTags: response.metric_entry_tags,
      allTags: allTags.tags,
      allContacts: allContacts.contacts as Array<Contact>,
      metricEntryContactsByRefId,
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

export async function action({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "archive": {
        await apiClient.metrics.metricArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/metrics`);
      }

      case "remove": {
        await apiClient.metrics.metricRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/metrics`);
      }

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

export default function Metric() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const shouldShowALeaf = useBranchNeedsToShowLeaf();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );

  const tagsByMetricEntryRefId = new Map<string, Tag[]>();
  for (const et of loaderData.metricEntryTags) {
    tagsByMetricEntryRefId.set(et.metric_entry_ref_id, et.tags);
  }

  const sortedEntries = [...loaderData.metricEntries]
    .sort((e1, e2) => {
      return -compareADate(e1.collection_time, e2.collection_time);
    })
    .filter((entry) => {
      const tags = tagsByMetricEntryRefId.get(entry.ref_id) || [];
      const tagsOk =
        selectedTagsRefId.length === 0 ||
        tags.some((tag: Tag) => selectedTagsRefId.includes(tag.ref_id));
      const contacts =
        loaderData.metricEntryContactsByRefId[entry.ref_id] || [];
      const contactsOk =
        selectedContactsRefId.length === 0 ||
        contacts.some((contact: Contact) =>
          selectedContactsRefId.includes(contact.ref_id),
        );
      return tagsOk && contactsOk;
    });

  return (
    <BranchPanel
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.metric.archived}
      key={`metric-${loaderData.metric.ref_id}`}
      createLocation={`/app/workspace/metrics/${loaderData.metric.ref_id}/entries/new`}
      returnLocation="/app/workspace/metrics"
      actions={
        <SectionActions
          id={`metric-${loaderData.metric.ref_id}-actions`}
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavSingle({
              text: "Details",
              icon: <TuneIcon />,
              link: `/app/workspace/metrics/${loaderData.metric.ref_id}/details`,
            }),
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
            FilterManyOptions(
              "Contacts",
              loaderData.allContacts.map((contact) => ({
                value: contact.ref_id,
                text: contact.name,
              })),
              setSelectedContactsRefId,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <MetricGraph sortedMetricEntries={sortedEntries} />

        {sortedEntries.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no metric entries to show. You can create a new metric entry."
            newEntityLocations={`/app/workspace/metrics/${loaderData.metric.ref_id}/entries/new`}
            helpSubject={DocsHelpSubject.METRICS}
          />
        )}

        <EntityStack>
          {sortedEntries.map((entry) => (
            <EntityCard
              entityId={`metric-entry-${entry.ref_id}`}
              key={`metric-entry-${entry.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/metrics/${loaderData.metric.ref_id}/entries/${entry.ref_id}`}
              >
                <EntityNameComponent name={metricEntryName(entry)} />
                <TimeDiffTag
                  today={topLevelInfo.today}
                  labelPrefix="Collected"
                  collectionTime={entry.collection_time}
                />
                {(tagsByMetricEntryRefId.get(entry.ref_id) || []).map((tag) => (
                  <TagTag key={tag.ref_id} tag={tag} />
                ))}
                {(
                  loaderData.metricEntryContactsByRefId[entry.ref_id] || []
                ).map((contact: Contact) => (
                  <ContactTag key={contact.ref_id} contact={contact} />
                ))}
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  "/app/workspace/metrics",
  ParamsSchema,
  {
    notFound: (params) => `Could not find metric #${params.id}!`,
    error: (params) =>
      `There was an error loading metric #${params.id}! Please try again!`,
  },
);

interface MetricGraphProps {
  sortedMetricEntries: MetricEntry[];
}

function MetricGraph({ sortedMetricEntries }: MetricGraphProps) {
  const theme = useTheme();
  const nivoTheme = {
    axis: {
      ticks: {
        text: { fill: theme.palette.text.secondary },
      },
      legend: {
        text: { fill: theme.palette.text.primary },
      },
    },
    legends: {
      text: { fill: theme.palette.text.primary },
    },
    tooltip: {
      container: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
  };

  const entriesForGraph = sortedMetricEntries.map((e) => ({
    x: aDateToDate(e.collection_time).toFormat("yyyy-MM-dd"),
    y: e.value,
    refId: e.ref_id,
  }));
  const graphMaxValue = Math.max(...entriesForGraph.map((e) => e.y)) * 1.35;

  return (
    <MetricGraphDiv>
      <ResponsiveLine
        theme={nivoTheme}
        curve="monotoneX"
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: "day",
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          nice: true,
          min: 0,
          max: graphMaxValue,
        }}
        axisBottom={{
          format: "'%y-%b-%d",
          tickValues: 7,
        }}
        pointSize={4}
        pointBorderWidth={1}
        pointBorderColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        margin={{ top: 20, right: 10, bottom: 50, left: 50 }}
        useMesh={true}
        enableSlices={false}
        data={[
          {
            id: "metricValue",
            data: entriesForGraph,
          },
        ]}
      />
    </MetricGraphDiv>
  );
}

const MetricGraphDiv = styled("div")`
  height: 300px;
`;
