import type { Contact, Tag } from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import Check from "@jupiter/core/infra/component/check";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TagTag } from "@jupiter/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "@jupiter/core/common/sub/contacts/component/contact-tag";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { getGuestApiClient } from "~/api-clients.server";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const response = await apiClient.smartLists.smartListLoadPublic({
      external_id: externalId,
      include_item_tags_and_notes: true,
    });

    const genericTagsByItemRefId: { [key: string]: Array<Tag> } =
      response.smart_list_item_generic_tags ?? {};
    const contactsByItemRefId: { [key: string]: Array<Contact> } =
      response.smart_list_item_contacts ?? {};

    const allItemTags = Object.values(genericTagsByItemRefId)
      .flat()
      .filter(
        (tag, index, tags) =>
          tags.findIndex((other) => other.ref_id === tag.ref_id) === index,
      );
    const allContacts = Object.values(contactsByItemRefId)
      .flat()
      .filter(
        (contact, index, contacts) =>
          contacts.findIndex((other) => other.ref_id === contact.ref_id) ===
          index,
      );

    return json({
      externalId,
      smartList: response.smart_list,
      smartListItems: response.smart_list_items,
      allItemTags,
      allContacts,
      genericTagsByItemRefId,
      contactsByItemRefId,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export default function PublishedSmartList() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const [selectedDoneness, setSelectedDoneness] = useState<boolean[]>([]);
  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const [selectedContactsRefId, setSelectedContactsRefId] = useState<string[]>(
    [],
  );

  const filteredSmartListItems = useMemo(
    () =>
      loaderData.smartListItems.filter((item) => {
        const doneOk =
          selectedDoneness.length === 0 ||
          selectedDoneness.includes(item.is_done);

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
      }),
    [
      loaderData.smartListItems,
      loaderData.genericTagsByItemRefId,
      loaderData.contactsByItemRefId,
      selectedDoneness,
      selectedTagsRefId,
      selectedContactsRefId,
    ],
  );

  return (
    <LeafPanel
      key={`published-smart-list-${loaderData.smartList.ref_id}`}
      fakeKey={`published-smart-list-${loaderData.smartList.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
      shouldShowALeaflet={shouldShowALeaflet}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaflet}>
        <SectionCard
          title={loaderData.smartList.name}
          actions={
            <SectionActions
              id="published-smart-list-items"
              topLevelInfo={topLevelInfo}
              inputsEnabled={false}
              actions={[
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
          {filteredSmartListItems.length === 0 && (
            <EntityNoNothingCard
              title="Nothing To Show"
              message="There are no items to show with the current filters."
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
                  to={`/app/public/published/smart-list/${loaderData.externalId}/${item.ref_id}`}
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
        </SectionCard>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) =>
    `Could not find published smart list ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published smart list ${params.externalId}! Please try again!`,
});
