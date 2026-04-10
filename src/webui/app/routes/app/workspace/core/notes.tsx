import type { Note } from "@jupiter/webapi-client";
import { DocsHelpSubject, NamedEntityTag } from "@jupiter/webapi-client";
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
import { NoteOwnerTypeChip } from "#/core/common/sub/notes/component/note-owner-type-chip";
import { noteOwnerEntityTagName } from "#/core/common/sub/notes/note-owner-type-name";
import { parseNoteOwner } from "#/core/common/sub/notes/parse-note-owner";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const [findResult, settingsResult] = await Promise.all([
    apiClient.notes.noteFind({
      allow_archived: false,
    }),
    apiClient.notes.noteLoadSettings({}),
  ]);

  const noteOwnerFilterTags = settingsResult.allowed_note_owner_entity_types.map(
    (s) => s as NamedEntityTag,
  );

  return json({
    notes: findResult.notes as Array<Note>,
    noteOwnerFilterTags,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Notes() {
  const { notes, noteOwnerFilterTags } =
    useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const [selectedOwnerTypes, setSelectedOwnerTypes] = useState<
    NamedEntityTag[]
  >([]);

  const ownerTypeOptions = useMemo(
    () =>
      noteOwnerFilterTags.map((tag) => ({
        value: tag,
        text: noteOwnerEntityTagName(tag),
      })),
    [noteOwnerFilterTags],
  );

  const filteredNotes = useMemo(() => {
    const sorted = [...notes].sort((a, b) => {
      const ta = parseNoteOwner(a.owner).theType;
      const tb = parseNoteOwner(b.owner).theType;
      if (ta < tb) {
        return -1;
      }
      if (ta > tb) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });

    if (selectedOwnerTypes.length === 0) {
      return sorted;
    }

    return sorted.filter((n) => {
      const { theType } = parseNoteOwner(n.owner);
      return selectedOwnerTypes.some((t) => t === theType);
    });
  }, [notes, selectedOwnerTypes]);

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
              "Owner type",
              ownerTypeOptions,
              setSelectedOwnerTypes,
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
                <NoteOwnerTypeChip owner={note.owner} />
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
