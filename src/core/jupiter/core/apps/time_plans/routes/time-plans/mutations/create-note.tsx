import { NamedEntityTag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";
import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

// Creates an empty note for one of a time plan activity's targets, and returns
// it for the panel to show.
const CreateNoteFormSchema = z.object({
  ownerTag: z.nativeEnum(NamedEntityTag),
  ownerRefId: z.string(),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateNoteFormSchema);

  try {
    const result = await apiClient.notes.noteCreate({
      owner: noteStdOwner(form.ownerTag, form.ownerRefId),
      content: [],
    });

    return noErrorSomeData({ new_note: result.new_note });
  } catch (error) {
    return handleActionApiError(error);
  }
}
