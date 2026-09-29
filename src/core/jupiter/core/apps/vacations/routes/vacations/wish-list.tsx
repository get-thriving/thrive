import { z } from "zod";
import type {
  Contact,
  Tag,
  TravelWishFindResultEntry,
} from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useNavigate } from "react-router";
import { useCallback, useContext, useMemo } from "react";

import {
  LocationsMap,
  locationToMapMarker,
} from "#/core/common/sub/locations/component/locations-map";
import { sortTravelWishesNaturally } from "#/core/apps/vacations/sub/travel_wish/root";
import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "#/core/infra/component/error-boundary";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "#/core/infra/component/layout/nested-outlet";
import { TrunkPanel } from "#/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { ContactTag } from "#/core/common/sub/contacts/component/contact-tag";
import { LocationTag } from "#/core/common/sub/locations/component/location-tag";
import { UserLightChip } from "#/core/users/components/user-light-chip";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import { useSectionFilters } from "#/core/infra/component/use-section-filter";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const [response, allTags, allContacts] = await Promise.all([
    apiClient.vacations.travelWishFind({
      allow_archived: false,
      include_tags: true,
    }),
    apiClient.tags.tagFind({
      allow_archived: false,
    }),
    apiClient.contacts.contactFind({
      allow_archived: false,
    }),
  ]);

  return {
    entries: response.entries,
    allTags: allTags.tags as Array<Tag>,
    allContacts: allContacts.contacts as Array<Contact>,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

const PANEL_ID = "wish-list";

const FILTERS = z.object({
  tags: z.array(z.string()).default([]),
  contacts: z.array(z.string()).default([]),
});

export default function TravelWishWishlist() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const entries = loaderData.entries as Array<TravelWishFindResultEntry>;
  const [
    { tags: selectedTagsRefId, contacts: selectedContactsRefId },
    setFilters,
  ] = useSectionFilters(PANEL_ID, FILTERS);

  const entriesByRefId = new Map<string, TravelWishFindResultEntry>();
  for (const entry of entries) {
    entriesByRefId.set(entry.travel_wish.ref_id, entry);
  }

  const sortedTravelWishes = sortTravelWishesNaturally(
    entries
      .map((e) => e.travel_wish)
      .filter((travelWish) => {
        const entry = entriesByRefId.get(travelWish.ref_id);
        const tagsOk =
          selectedTagsRefId.length === 0 ||
          entry?.tags?.some((tag: Tag) =>
            selectedTagsRefId.includes(tag.ref_id),
          );
        const contactsOk =
          selectedContactsRefId.length === 0 ||
          entry?.contacts?.some((contact: Contact) =>
            selectedContactsRefId.includes(contact.ref_id),
          );
        return tagsOk && contactsOk;
      }),
  );

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const navigate = useNavigate();
  const handleMapSelect = useCallback(
    (href: string) => {
      navigate(href);
    },
    [navigate],
  );
  const visibleTravelWishRefIds = useMemo(
    () => new Set(sortedTravelWishes.map((travelWish) => travelWish.ref_id)),
    [sortedTravelWishes],
  );
  const mapMarkers = useMemo(
    () =>
      entries.flatMap((entry) => {
        if (!visibleTravelWishRefIds.has(entry.travel_wish.ref_id)) {
          return [];
        }
        return (entry.locations ?? []).flatMap((location) => {
          const marker = locationToMapMarker(
            location,
            `/app/workspace/apps/vacations/wish-list/${entry.travel_wish.ref_id}`,
          );
          return marker ? [marker] : [];
        });
      }),
    [entries, visibleTravelWishRefIds],
  );

  return (
    <TrunkPanel
      key={"vacations-wishlist"}
      createLocation="/app/workspace/apps/vacations/wish-list/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="travel-wishes-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            NavSingle({
              id: "vacations-all",
              text: "All vacations",
              link: "/app/workspace/apps/vacations/vacation",
              icon: <EventAvailableIcon />,
            }),
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              selectedTagsRefId,
              (tags) => setFilters({ tags }),
            ),
            FilterManyOptions(
              "Contacts",
              loaderData.allContacts.map((contact) => ({
                value: contact.ref_id,
                text: contact.name,
              })),
              selectedContactsRefId,
              (contacts) => setFilters({ contacts }),
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <LocationsMap
          title="Wishlist locations"
          markers={mapMarkers}
          cacheKey="vacations-wish-list"
          onSelectHref={handleMapSelect}
        />

        {sortedTravelWishes.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no travel wishes to show. You can add a place you'd like to visit."
            newEntityLocations="/app/workspace/apps/vacations/wish-list/new"
            helpSubject={DocsHelpSubject.VACATIONS}
          />
        )}

        <EntityStack>
          {sortedTravelWishes.map((travelWish) => {
            const entry = entriesByRefId.get(travelWish.ref_id);
            return (
              <EntityCard
                entityId={`travel-wish-${travelWish.ref_id}`}
                key={`travel-wish-${travelWish.ref_id}`}
              >
                {entry && (
                  <UserLightChip
                    user={entry.owner}
                    currentUserRefId={topLevelInfo.user.ref_id}
                  />
                )}
                <EntityLink
                  to={`/app/workspace/apps/vacations/wish-list/${travelWish.ref_id}`}
                >
                  <EntityNameComponent name={travelWish.name} />
                  {entry?.tags?.map((tag: Tag) => (
                    <TagTag key={tag.ref_id} tag={tag} />
                  ))}
                  {entry?.contacts?.map((contact: Contact) => (
                    <ContactTag key={contact.ref_id} contact={contact} />
                  ))}
                  {entry?.locations?.map((location) => (
                    <LocationTag key={location.ref_id} location={location} />
                  ))}
                </EntityLink>
              </EntityCard>
            );
          })}
        </EntityStack>
      </NestingAwareBlock>

      <NestedOutlet />
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () =>
    `There was an error loading the travel wishlist! Please try again!`,
});
