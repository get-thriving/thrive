import type {
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
import { useContext } from "react";

import { entityLinkStd } from "#/core/common/entity-link";
import { ServicePropertiesContext } from "#/core/config-client";
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
}

export function PublishPanel(props: PublishPanelProps) {
  const serviceProperties = useContext(ServicePropertiesContext);
  const sectionId = `${props.entityType}-publish`;
  const publishOwner = entityLinkStd(props.entityType, props.entityRefId);
  const publicUrl =
    props.publishEntity !== null
      ? `${serviceProperties.webUiUrl}/app/public/published/${props.publishEntity.external_id}`
      : "";
  const isActive = props.publishEntity?.status === PublishEntityStatus.ACTIVE;

  return (
    <SectionCard
      id={sectionId}
      title="Publish"
      actions={
        props.publishEntity === null ? (
          <SectionActions
            id={`${sectionId}-create`}
            topLevelInfo={props.topLevelInfo}
            inputsEnabled={props.inputsEnabled}
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
            inputsEnabled={props.inputsEnabled}
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
          Publish this entity to share a read-only link with others.
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
