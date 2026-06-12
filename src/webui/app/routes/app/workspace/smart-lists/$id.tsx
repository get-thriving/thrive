import type { Contact, Tag } from "@jupiter/webapi-client";
import {
  ApiError,
  DocsHelpSubject,
  NamedEntityTag,
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
import { ContactTag } from "@jupiter/core/common/sub/contacts/component/contact-tag";
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
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
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
  z.object({
    intent: z.literal("create-publish"),
    publishOwner: z.string(),
  }),
  z.object({
    intent: z.literal("activate-publish"),
    publishEntityRefId: z.string(),
  }),
  z.object({
    intent: z.literal("to-draft-publish"),
    publishEntityRefId: z.string(),
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
    });
    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    const genericTagsByItemRefId: { [key: string]: Array<Tag> } =
      response.smart_list_item_generic_tags ?? {};
    const contactsByItemRefId: { [key: string]: Array<Contact> } =
      response.smart_list_item_contacts ?? {};

    return json({
      smartList: response.smart_list,
      smartListItems: response.smart_list_items,
      allItemTags: allItemTags.tags as Array<Tag>,
      allContacts: allContacts.contacts as Array<Contact>,
      genericTagsByItemRefId,
      contactsByItemRefId,
      publishEntity: response.publish_entity ?? null,
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

  try {
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

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
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

    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
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
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );

  const filteredSmartListItems = loaderData.smartListItems.filter((item) => {
    const doneOk =
      selectedDoneness.length === 0 || selectedDoneness.includes(item.is_done);

    const tags = loaderData.genericTagsByItemRefId[item.ref_id] ?? [];
    const tagsOk =
      selectedTagsRefId.length === 0 ||
      tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));

    const contacts = loaderData.contactsByItemRefId[item.ref_id] ?? [];
    const contactsOk =
      selectedContactsRefId.length === 0 ||
      contacts.some((contact: Contact) =>
        selectedContactsRefId.includes(contact.ref_id),
      );

    return doneOk && tagsOk && contactsOk;
  });

  return (
    <BranchPanel
      key={`smart-list-${loaderData.smartList.ref_id}`}
      entityType={NamedEntityTag.SMART_LIST}
      entityRefId={loaderData.smartList.ref_id}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.smartList.archived}
      createLocation={`/app/workspace/smart-lists/${loaderData.smartList.ref_id}/new`}
      returnLocation="/app/workspace/smart-lists"
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
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
                {(loaderData.contactsByItemRefId[item.ref_id] ?? []).map(
                  (contact: Contact) => (
                    <ContactTag key={contact.ref_id} contact={contact} />
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
