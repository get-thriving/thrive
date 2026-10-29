import { Alert, Avatar, Button, Stack, Typography } from "@mui/material";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useFetcher } from "react-router";

import type { ActionResult } from "#/core/infra/action-result";
import { GlobalError } from "#/core/infra/component/errors";
import {
  ACCEPTED_PICTURE_TYPES,
  MAX_PICTURE_BYTES,
  prepareAvatarPicture,
} from "#/core/users/avatar-upload";

interface AvatarPickerProps {
  name: string;
  avatarUrl: string | undefined;
  inputsEnabled: boolean;
}

/**
 * Shows the picture of the user and lets them choose another.
 *
 * The picture goes to the closest route's action as an `upload-avatar`, by a
 * fetcher of its own: the form around it is not a file upload, and the picture
 * may have to be scaled down in the browser first. Taking it away is up to the
 * section this sits in.
 */
export function AvatarPicker(props: AvatarPickerProps) {
  const fetcher = useFetcher<ActionResult<unknown>>();
  const [preparing, setPreparing] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const busy = preparing || fetcher.state !== "idle";

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // So that choosing the same file again still counts as a change.
    input.value = "";
    if (file === undefined) {
      return;
    }

    setClientError(null);
    setPreparing(true);
    try {
      const picture = await prepareAvatarPicture(file);
      if (picture.size > MAX_PICTURE_BYTES) {
        setClientError(
          `The picture is too big: at most ${MAX_PICTURE_BYTES / (1024 * 1024)} MB`,
        );
        return;
      }

      const formData = new FormData();
      formData.set("intent", "upload-avatar");
      formData.set("picture", picture);
      await fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    } finally {
      setPreparing(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
        <Avatar
          id="avatar-preview"
          alt={props.name}
          src={props.avatarUrl}
          sx={{ width: 96, height: 96 }}
        />
        <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
          <Button
            component="label"
            variant="outlined"
            disabled={!props.inputsEnabled || busy}
          >
            {busy ? "Uploading…" : "Upload picture"}
            <input
              id="avatar-file"
              type="file"
              hidden
              accept={ACCEPTED_PICTURE_TYPES.join(",")}
              onChange={handleChange}
            />
          </Button>
          <Typography variant="caption">
            A JPEG, PNG or WebP picture. It is cropped to a square around the
            middle.
          </Typography>
        </Stack>
      </Stack>
      {clientError !== null && (
        <Alert id="avatar-error" severity="error">
          {clientError}
        </Alert>
      )}
      {/* What the last picture got is not news once the next one is on its way. */}
      {fetcher.state === "idle" && <GlobalError actionResult={fetcher.data} />}
    </Stack>
  );
}
