import type { Tag } from "@jupiter/webapi-client";
import {
  ApiError,
  DocsHelpSubject,
  TagNamespace,
} from "@jupiter/webapi-client";
import ReorderIcon from "@mui/icons-material/Reorder";
import TuneIcon from "@mui/icons-material/Tune";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { useContext, useState } from "react";
import Check from "@jupiter/core/infra/component/check";
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
import { TagTag } from "@jupiter/core/common/sub/tags/component/tag-tag";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import {
  DisplayType,
  useBranchNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  NavMultipleSpread,
  NavSingle,
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateSchema = z.discriminatedUnion("intent", [
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
    const response = await apiClient.smartLists.smartListLoad({
      ref_id: id,
      allow_archived: true,
      allow_archived_items: false,
      allow_archived_tags: false,
      include_item_tags_and_notes: true,
    });

    const allItemTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.SMART_LIST_ITEM],
    });

    const genericTagsByItemRefId: { [key: string]: Array<Tag> } =
      response.smart_list_item_generic_tags ?? {};

    return json({
      smartList: response.smart_list,
      smartListItems: response.smart_list_items,
      allItemTags: allItemTags.tags as Array<Tag>,
      genericTagsByItemRefId,
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
  const form = await parseForm(request, UpdateSchema);

  switch (form.intent) {
    case "archive": {
      await apiClient.smartLists.smartListArchive({
        ref_id: id,
      });

      return redirect("/app/workspace/smart-lists");
    }

    case "remove": {
      await apiClient.smartLists.smartListRemove({
        ref_id: id,
      });

      return redirect("/app/workspace/smart-lists");
    }
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function SmartListViewItems() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const navigation = useNavigation();
  const isBigScreen = useBigScreen();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.smartList.archived;

  const shouldShowALeaf = useBranchNeedsToShowLeaf();

  const [selectedDoneness, setSelectedDoneness] = useState<boolean[]>([]);
  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const filteredSmartListItems = loaderData.smartListItems.filter((item) => {
    const doneOk =
      selectedDoneness.length === 0 || selectedDoneness.includes(item.is_done);

    const tags = loaderData.genericTagsByItemRefId[item.ref_id] ?? [];
    const tagsOk =
      selectedTagsRefId.length === 0 ||
      tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));

    return doneOk && tagsOk;
  });

  return (
    <BranchPanel
      key={`smart-list-${loaderData.smartList.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.smartList.archived}
      createLocation={`/app/workspace/smart-lists/${loaderData.smartList.ref_id}/new`}
      returnLocation="/app/workspace/smart-lists"
      actions={
        <SectionActions
          id="smart-list-items"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavSingle({
              text: isBigScreen ? "Details" : "",
              icon: <TuneIcon />,
              link: `/app/workspace/smart-lists/${loaderData.smartList.ref_id}/details`,
            }),
            NavMultipleSpread({
              navs: [
                NavSingle({
                  text: "Items",
                  icon: <ReorderIcon />,
                  link: `/app/workspace/smart-lists/${loaderData.smartList.ref_id}`,
                  highlight: true,
                }),
              ],
            }),
            FilterManyOptions(
              "Done",
              [
                { value: true, text: "Is done" },
                { value: false, text: "Is not done" },
              ],
              setSelectedDoneness,
            ),
            FilterManyOptions(
              "Tags",
              loaderData.allItemTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {filteredSmartListItems.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no items to show with the current filters. You can create a new item."
            newEntityLocations={`/app/workspace/smart-lists/${loaderData.smartList.ref_id}/new`}
            helpSubject={DocsHelpSubject.SMART_LISTS}
          />
        )}

        <EntityStack>
          {filteredSmartListItems.map((item) => (
            <EntityCard
              key={`smart-list-item-${item.ref_id}`}
              entityId={`smart-list-item-${item.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/smart-lists/${loaderData.smartList.ref_id}/${item.ref_id}`}
              >
                <EntityNameComponent name={item.name} />
                <Check isDone={item.is_done} />
                {(loaderData.genericTagsByItemRefId[item.ref_id] ?? []).map(
                  (tag) => (
                    <TagTag key={tag.ref_id} tag={tag} />
                  ),
                )}
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
  "/app/workspace/smart-lists",
  ParamsSchema,
  {
    notFound: (params) => `Could not find smart list #${params.id}!`,
    error: (params) =>
      `There was an error loading smart list #${params.id}! Please try again!`,
  },
);
