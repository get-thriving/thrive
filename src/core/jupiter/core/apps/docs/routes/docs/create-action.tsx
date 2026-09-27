import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";

import { NoteContentParser } from "#/core/common/sub/notes/root";
import { noErrorSomeData } from "#/core/infra/action-result";
import { handleActionApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const CreateFormSchema = z.object({
  idempotencyKey: z.string(),
  name: z.string(),
  parentDirRefId: z.string(),
  content: z.preprocess((value) => {
    const utf8Buffer = Buffer.from(String(value), "base64");
    return JSON.parse(utf8Buffer.toString("utf-8"));
  }, NoteContentParser),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.docs.docCreate({
      idempotency_key: form.idempotencyKey,
      name: form.name,
      content: form.content,
      parent_dir_ref_id: form.parentDirRefId,
    });

    return noErrorSomeData({
      new_doc: result.new_doc,
      new_note: result.new_note,
    });
  } catch (error) {
    return handleActionApiError(error);
  }
}
