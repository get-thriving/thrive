import type { PublishEntity } from "@jupiter/webapi-client";
import {
  DocsHelpSubject,
  NamedEntityTag,
  PublishEntityStatus,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { Button, Box, Stack, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
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
import { SlimChip } from "@jupiter/core/infra/component/chips";
import { PublishOwnerTypeChip } from "#/core/common/sub/publish/components/publish-owner-type-chip";
import { publishOwnerEntityTagName } from "#/core/common/sub/publish/publish-owner-type-name";
import { ServicePropertiesContext } from "#/core/config-client";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const [findResult, settingsResult] = await Promise.all([
    apiClient.publish.publishEntityFind({
      allow_archived: false,
    }),
    apiClient.publish.publishEntityLoadSettings({}),
  ]);

  const publishOwnerFilterTags =
    settingsResult.allowed_publish_owner_entity_types.map(
      (s) => s as NamedEntityTag,
    );

  return json({
    publishEntities: findResult.publish_entities as Array<PublishEntity>,
    publishOwnerFilterTags,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function PublishEntities() {
  const { publishEntities, publishOwnerFilterTags } =
    useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const serviceProperties = useContext(ServicePropertiesContext);
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const [selectedOwnerTypes, setSelectedOwnerTypes] = useState<
    NamedEntityTag[]
  >([]);

  const ownerTypeOptions = useMemo(
    () =>
      publishOwnerFilterTags.map((tag) => ({
        value: tag,
        text: publishOwnerEntityTagName(tag),
      })),
    [publishOwnerFilterTags],
  );

  const filteredPublishEntities = useMemo(() => {
    const sorted = [...publishEntities].sort((a, b) => {
      const ta = parseEntityLinkStd(a.owner).theType;
      const tb = parseEntityLinkStd(b.owner).theType;
      if (ta < tb) {
        return -1;
      }
      if (ta > tb) {
        return 1;
      }
      return a.external_id.localeCompare(b.external_id);
    });

    if (selectedOwnerTypes.length === 0) {
      return sorted;
    }

    return sorted.filter((publishEntity) => {
      const { theType } = parseEntityLinkStd(publishEntity.owner);
      return selectedOwnerTypes.some((t) => t === theType);
    });
  }, [publishEntities, selectedOwnerTypes]);

  return (
    <TrunkPanel
      key={"core/publish"}
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="core-publish-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterManyOptions(
              "Entity type",
              ownerTypeOptions,
              setSelectedOwnerTypes,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        {filteredPublishEntities.length === 0 && (
          <EntityNoNothingCard
            title="No Shared Entities"
            message="There are no shared entities to show. Publish an entity from its detail view to share a read-only link."
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        <EntityStack>
          {filteredPublishEntities.map((publishEntity) => {
            const publicUrl = `${serviceProperties.webUiUrl}/app/public/published/${publishEntity.external_id}`;
            const isActive =
              publishEntity.status === PublishEntityStatus.ACTIVE;

            return (
              <EntityCard
                entityId={`publish-${publishEntity.ref_id}`}
                key={`publish-${publishEntity.ref_id}`}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ width: "100%", paddingRight: "1rem" }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <EntityLink
                      to={`/app/workspace/core/publish/${publishEntity.ref_id}`}
                    >
                      <PublishOwnerTypeChip owner={publishEntity.owner} />
                      <SlimChip label={publishEntity.status} color="default" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {publicUrl}
                      </Typography>
                    </EntityLink>
                  </Box>
                  <Button
                    component="a"
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    variant="outlined"
                    size="small"
                    disabled={!isActive}
                    onClick={(event) => event.stopPropagation()}
                  >
                    View
                  </Button>
                </Stack>
              </EntityCard>
            );
          })}
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () =>
    `There was an error loading the shared entities! Please try again!`,
});
