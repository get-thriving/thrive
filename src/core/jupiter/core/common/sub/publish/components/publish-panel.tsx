import type {
  AccessStatus,
  EntityId,
  NamedEntityTag,
  PublishEntity,
} from "@jupiter/webapi-client";
import { PublishEntityStatus } from "@jupiter/webapi-client";
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";

import { entityLinkStd } from "#/core/common/entity-link";
import { accessStatusIsOwner } from "#/core/common/sub/access/access-level";
import { publishedShareUrl } from "#/core/common/sub/publish/published-share-url";
import { ServiceLinksContext } from "#/core/infra/service-links-context";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import type { TopLevelInfo } from "#/core/infra/top-level-context";

interface PublishPanelProps {
  entityType: NamedEntityTag;
  entityRefId: EntityId;
  topLevelInfo: TopLevelInfo;
  inputsEnabled: boolean;
  publishEntity: PublishEntity | null;
  accessStatus?: AccessStatus | null;
}

export function PublishPanel(props: PublishPanelProps) {
  const serviceLinks = useContext(ServiceLinksContext);
  const [hasCopiedPublicUrl, setHasCopiedPublicUrl] = useState(false);
  const sectionId = `${props.entityType}-publish`;
  // Publishing exposes the entity to anyone with the link, so it stays with the
  // owner even when the entity is shared with writers. Routes that do not load
  // an access status yet leave ownership unknown here, and the use cases turn
  // away non-owners regardless.
  const knownNotOwner =
    props.accessStatus !== undefined &&
    !accessStatusIsOwner(props.accessStatus);
  const publishEnabled = props.inputsEnabled && !knownNotOwner;
  const publishOwner = entityLinkStd(props.entityType, props.entityRefId);
  const publicUrl =
    props.publishEntity !== null
      ? publishedShareUrl(
          serviceLinks.publishedUrl,
          props.publishEntity.external_id,
        )
      : "";
  const isActive = props.publishEntity?.status === PublishEntityStatus.ACTIVE;

  async function copyPublicUrl() {
    await navigator.clipboard.writeText(publicUrl);
    setHasCopiedPublicUrl(true);
  }

  return (
    <SectionCard
      id={sectionId}
      title="Publish"
      actions={
        props.publishEntity === null ? (
          <SectionActions
            id={`${sectionId}-create`}
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={publishEnabled}
            actions={[
              ActionSingle({
                id: `${sectionId}-create`,
                text: "Publish",
                value: "create-publish",
                highlight: true,
              }),
            ]}
          />
        ) : (
          <SectionActions
            id={`${sectionId}-status`}
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={publishEnabled}
            actions={[
              ActionSingle({
                id: `${sectionId}-toggle-status`,
                text: isActive ? "Move to Draft" : "Move to Active",
                value: isActive ? "to-draft-publish" : "activate-publish",
                highlight: true,
              }),
            ]}
          />
        )
      }
    >
      {props.publishEntity === null ? (
        <Typography variant="body2" color="text.secondary">
          {knownNotOwner
            ? "Only the owner of this entity can publish it."
            : "Publish this entity to share a read-only link with others."}
        </Typography>
      ) : (
        <Stack spacing={2}>
          <Typography variant="body2">
            Status:{" "}
            <Typography component="span" fontWeight="medium">
              {props.publishEntity.status}
            </Typography>
          </Typography>

          <FormControl fullWidth>
            <InputLabel id={`${sectionId}-public-url`}>Public URL</InputLabel>
            <OutlinedInput
              label="Public URL"
              name="publicUrl"
              readOnly
              value={publicUrl}
              endAdornment={
                <InputAdornment position="end">
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={copyPublicUrl}
                      disabled={!isActive || hasCopiedPublicUrl}
                    >
                      {hasCopiedPublicUrl ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      component="a"
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="outlined"
                      disabled={!isActive}
                    >
                      View
                    </Button>
                  </Stack>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
      )}

      <input type="hidden" name="publishOwner" value={publishOwner} />
      {props.publishEntity !== null && (
        <input
          type="hidden"
          name="publishEntityRefId"
          value={props.publishEntity.ref_id}
        />
      )}
    </SectionCard>
  );
}
