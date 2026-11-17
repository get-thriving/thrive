import type { Tag } from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useMemo } from "react";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { EntityPanel } from "@jupiter/core/infra/component/layout/entity-panel";
import { PanelNewAction } from "@jupiter/core/infra/component/layout/panel-new-action";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";
import { strataTrunkLabel } from "@jupiter/core/infra/strata/strata-trunk-label";

export const handle = {
  displayType: DisplayType.TRUNK,
  label: strataTrunkLabel,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.tags.tagFind({
    allow_archived: false,
  });

  return {
    tags: result.tags as Array<Tag>,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Tags() {
  const { tags } = useLoaderDataSafeForAnimation<typeof loader>();

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => a.name.localeCompare(b.name)),
    [tags],
  );

  return (
    <EntityPanel
      kind="trunk"
      key={"core/tags"}
      returnLocation="/app/workspace"
      actions={
        <PanelNewAction kind="trunk" link="/app/workspace/core/tags/new" />
      }
    >
      <NestingAwareBlock>
        {sortedTags.length === 0 && (
          <EntityNoNothingCard
            title="No Tags"
            message="There are no tags to show. You can create a new tag."
            newEntityLocations="/app/workspace/core/tags/new"
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        <EntityStack>
          {sortedTags.map((tag) => (
            <EntityCard
              entityId={`tag-${tag.ref_id}`}
              key={`tag-${tag.ref_id}`}
            >
              <EntityLink to={`/app/workspace/core/tags/${tag.ref_id}`}>
                <EntityNameComponent name={`#${tag.name}`} />
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </NestingAwareBlock>

      <NestedOutlet />
    </EntityPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the tags! Please try again!`,
});
