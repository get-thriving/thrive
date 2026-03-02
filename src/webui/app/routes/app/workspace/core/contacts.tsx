import type { Contact } from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.contacts.contactFind({
    allow_archived: false,
  });

  return json({
    contacts: result.contacts as Array<Contact>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Contacts() {
  const { contacts } = useLoaderDataSafeForAnimation<typeof loader>();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const sortedContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <TrunkPanel
      key={"core/contacts"}
      createLocation="/app/workspace/core/contacts/new"
      returnLocation="/app/workspace"
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        {sortedContacts.length === 0 && (
          <EntityNoNothingCard
            title="No Contacts"
            message="There are no contacts to show. You can create a new contact."
            newEntityLocations="/app/workspace/core/contacts/new"
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        <EntityStack>
          {sortedContacts.map((contact) => (
            <EntityCard
              entityId={`contact-${contact.ref_id}`}
              key={`contact-${contact.ref_id}`}
            >
              <EntityLink to={`/app/workspace/core/contacts/${contact.ref_id}`}>
                <EntityNameComponent name={contact.name} />
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the contacts! Please try again!`,
});
