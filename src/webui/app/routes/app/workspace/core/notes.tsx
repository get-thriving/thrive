import type { Note } from "@jupiter/webapi-client";
import { DocsHelpSubject, NoteNamespace } from "@jupiter/webapi-client";
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
import { NoteNamespaceTag } from "#/core/common/sub/notes/component/note-namespace-tag";
import { noteNamespaceName } from "#/core/common/sub/notes/namespace";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.notes.noteFind({
    allow_archived: false,
  });

  return json({
    notes: result.notes as Array<Note>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Notes() {
  const { notes } = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const [selectedNamespaces, setSelectedNamespaces] = useState<NoteNamespace[]>(
    [],
  );

  const namespaceOptions = useMemo(
    () =>
      Object.values(NoteNamespace).map((ns) => ({
        value: ns,
        text: noteNamespaceName(ns),
      })),
    [],
  );

  const filteredNotes = useMemo(() => {
    const sorted = [...notes].sort((a, b) => {
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

    return sorted.filter((n) => selectedNamespaces.includes(n.namespace));
  }, [notes, selectedNamespaces]);

  return (
    <TrunkPanel
      key={"core/notes"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="core-notes-actions"
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
        {filteredNotes.length === 0 && (
          <EntityNoNothingCard
            title="No Notes"
            message="There are no notes to show. Notes are attached to entities and cannot be created independently."
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        <EntityStack>
          {filteredNotes.map((note) => (
            <EntityCard
              entityId={`note-${note.ref_id}`}
              key={`note-${note.ref_id}`}
            >
              <EntityLink to={`/app/workspace/core/notes/${note.ref_id}`}>
                <EntityNameComponent name={note.name} />
                <NoteNamespaceTag namespace={note.namespace} />
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
  error: () => `There was an error loading the notes! Please try again!`,
});
