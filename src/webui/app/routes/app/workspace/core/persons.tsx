import type { Person } from "@jupiter/webapi-client";
import { DocsHelpSubject, PersonNamespace } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useMemo, useState } from "react";
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
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { PersonNamespaceTag } from "#/core/common/sub/persons/component/person-namespace-tag";
import { personNamespaceName } from "#/core/common/sub/persons/namespace";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.persons.personFind({
    allow_archived: false,
  });

  return json({
    persons: result.persons as Array<Person>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Persons() {
  const { persons } = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const [selectedNamespaces, setSelectedNamespaces] = useState<
    PersonNamespace[]
  >([]);

  const namespaceOptions = useMemo(
    () =>
      Object.values(PersonNamespace).map((ns) => ({
        value: ns,
        text: personNamespaceName(ns),
      })),
    [],
  );

  const filteredPersons = useMemo(() => {
    const sorted = [...persons].sort((a, b) => {
      if (a.namespace < b.namespace) {
        return -1;
      }
      if (a.namespace > b.namespace) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });

    if (selectedNamespaces.length === 0) {
      return sorted;
    }

    return sorted.filter((p) => selectedNamespaces.includes(p.namespace));
  }, [persons, selectedNamespaces]);

  return (
    <TrunkPanel
      key={"core/persons"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="core-persons-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterManyOptions(
              "Namespace",
              namespaceOptions,
              setSelectedNamespaces,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        {filteredPersons.length === 0 && (
          <EntityNoNothingCard
            title="No Persons"
            message="There are no persons to show. Persons are attached to entities and cannot be created independently."
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        <EntityStack>
          {filteredPersons.map((person) => (
            <EntityCard
              entityId={`person-${person.ref_id}`}
              key={`person-${person.ref_id}`}
            >
              <EntityLink to={`/app/workspace/core/persons/${person.ref_id}`}>
                <EntityNameComponent name={person.name} />
                <PersonNamespaceTag namespace={person.namespace} />
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
  error: () => `There was an error loading the persons! Please try again!`,
});
