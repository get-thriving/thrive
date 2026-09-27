import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { NoteContentParser } from "#/core/common/sub/notes/root";
import { noErrorNoData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const UpdateFormSchema = z.object({
  docId: z.string(),
  noteId: z.string(),
  name: z.string(),
  content: z.preprocess((value) => {
    const utf8Buffer = Buffer.from(String(value), "base64");
    return JSON.parse(utf8Buffer.toString("utf-8"));
  }, NoteContentParser),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    await apiClient.docs.docUpdate({
      ref_id: form.docId,
      name: { should_change: true, value: form.name },
      parent_dir_ref_id: { should_change: false },
    });
    await apiClient.notes.noteUpdate({
      ref_id: form.noteId,
      content: { should_change: true, value: form.content },
    });

    return noErrorNoData();
  } catch (error) {
    return handleActionApiError(error);
  }
}
