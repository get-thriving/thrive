import type {
  ADate,
  CollaborationEntry,
  CollaborationInviteEntry,
  CollaborationRequestEntry,
  EntityId,
} from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import { Tab, Tabs } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useFetcher } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { TimeDiffTag } from "@jupiter/core/common/component/time-diff-tag";
import { accessLevelName } from "@jupiter/core/common/sub/access/access-level";
import {
  CollaborationInviteCard,
  CollaborationRequestCard,
} from "@jupiter/core/common/sub/access/components/collaboration-cards";
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
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  CardBottomRightChipStack,
  OwnerCornerChip,
  SlimChip,
} from "@jupiter/core/infra/component/chips";
import { TabPanel } from "@jupiter/core/infra/component/tab-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { entityTagName } from "@jupiter/core/named-entity-tag";
import {
  formatUserLightLabel,
  UserLightChip,
} from "@jupiter/core/users/components/user-light-chip";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("acknowledge-invite"),
    accessInviteRefId: z.string().min(1),
  }),
  z.object({
    intent: z.literal("cancel-invite"),
    accessInviteRefId: z.string().min(1),
  }),
  z.object({
    intent: z.literal("accept"),
    accessRequestRefId: z.string().min(1),
  }),
  z.object({
    intent: z.literal("reject"),
    accessRequestRefId: z.string().min(1),
  }),
]);

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.application.findCollaborations({
    allow_archived: false,
  });

  return json({
    invites: result.invites,
    sharedWithMe: result.shared_with_me,
    sharedByMe: result.shared_by_me,
    incomingRequests: result.incoming_requests,
    outgoingRequests: result.outgoing_requests,
    users: result.users,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "acknowledge-invite": {
        await apiClient.application.acknowledgeAccessInvite({
          access_invite_ref_id: form.accessInviteRefId,
        });
        return json({ ok: true });
      }

      case "cancel-invite": {
        await apiClient.application.cancelAccessInvite({
          access_invite_ref_id: form.accessInviteRefId,
        });
        return json({ ok: true });
      }

      case "accept": {
        await apiClient.application.acceptAccessToEntity({
          access_request_ref_id: form.accessRequestRefId,
        });
        return json({ ok: true });
      }

      case "reject": {
        await apiClient.application.rejectAccessToEntity({
          access_request_ref_id: form.accessRequestRefId,
        });
        return json({ ok: true });
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Collaboration() {
  const {
    invites,
    sharedWithMe,
    sharedByMe,
    incomingRequests,
    outgoingRequests,
    users,
  } = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSubjectRefIds, setSelectedSubjectRefIds] = useState<
    EntityId[]
  >([]);
  const requestActionFetcher = useFetcher();

  const personFilterOptions = useMemo(
    () =>
      users.map((user) => ({
        value: user.ref_id,
        text: formatUserLightLabel(user),
      })),
    [users],
  );

  const filteredInvites = useMemo(
    () => filterEntriesBySubject(invites, selectedSubjectRefIds),
    [invites, selectedSubjectRefIds],
  );
  const filteredSharedWithMe = useMemo(
    () => filterEntriesBySubject(sharedWithMe, selectedSubjectRefIds),
    [sharedWithMe, selectedSubjectRefIds],
  );
  const filteredSharedByMe = useMemo(
    () => filterEntriesBySubject(sharedByMe, selectedSubjectRefIds),
    [sharedByMe, selectedSubjectRefIds],
  );
  const filteredIncomingRequests = useMemo(
    () => filterEntriesBySubject(incomingRequests, selectedSubjectRefIds),
    [incomingRequests, selectedSubjectRefIds],
  );
  const filteredOutgoingRequests = useMemo(
    () => filterEntriesBySubject(outgoingRequests, selectedSubjectRefIds),
    [outgoingRequests, selectedSubjectRefIds],
  );

  function handleAcknowledgeInvite(accessInviteRefId: string) {
    requestActionFetcher.submit(
      {
        intent: "acknowledge-invite",
        accessInviteRefId,
      },
      { method: "post" },
    );
  }

  function handleCancelInvite(accessInviteRefId: string) {
    requestActionFetcher.submit(
      {
        intent: "cancel-invite",
        accessInviteRefId,
      },
      { method: "post" },
    );
  }

  function handleAcceptRequest(accessRequestRefId: string) {
    requestActionFetcher.submit(
      {
        intent: "accept",
        accessRequestRefId,
      },
      { method: "post" },
    );
  }

  function handleRejectRequest(accessRequestRefId: string) {
    requestActionFetcher.submit(
      {
        intent: "reject",
        accessRequestRefId,
      },
      { method: "post" },
    );
  }

  return (
    <TrunkPanel
      key="core/collaboration"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="core-collaboration-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterManyOptions(
              "Person",
              personFilterOptions,
              setSelectedSubjectRefIds,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        <Tabs
          value={selectedTab}
          variant="fullWidth"
          onChange={(_, newValue: number) => setSelectedTab(newValue)}
        >
          <Tab
            label={
              invites.length > 0 ? `Invites (${invites.length})` : "Invites"
            }
          />
          <Tab
            label={
              incomingRequests.length > 0
                ? `Asked of you (${incomingRequests.length})`
                : "Asked of you"
            }
          />
          <Tab
            label={
              outgoingRequests.length > 0
                ? `Asking (${outgoingRequests.length})`
                : "Asking"
            }
          />
          <Tab label="Shared with you" />
          <Tab label="Shared by you" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          {filteredInvites.length === 0 ? (
            <EntityNoNothingCard
              title="No Invites"
              message="When someone invites you to an entity, it will show up here until you acknowledge it."
              helpSubject={DocsHelpSubject.ROOT}
            />
          ) : (
            <EntityStack>
              {filteredInvites.map((entry) => (
                <CollaborationInviteCard
                  key={`invite-${entry.access_invite.ref_id}`}
                  entry={entry}
                  today={topLevelInfo.today}
                  invitePath={`/app/workspace/core/collaboration/invites/${entry.access_invite.ref_id}`}
                  inputsEnabled={requestActionFetcher.state === "idle"}
                  onAcknowledge={() =>
                    handleAcknowledgeInvite(entry.access_invite.ref_id)
                  }
                  onCancel={() =>
                    handleCancelInvite(entry.access_invite.ref_id)
                  }
                />
              ))}
            </EntityStack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          {filteredIncomingRequests.length === 0 ? (
            <EntityNoNothingCard
              title="No Incoming Requests"
              message="When someone asks for access to something you own, it will show up here."
              helpSubject={DocsHelpSubject.ROOT}
            />
          ) : (
            <EntityStack>
              {filteredIncomingRequests.map((entry) => (
                <CollaborationRequestCard
                  key={`incoming-${entry.access_request.ref_id}`}
                  entry={entry}
                  today={topLevelInfo.today}
                  subjectMode="from"
                  requestPath={`/app/workspace/core/collaboration/requests/to-me/${entry.access_request.ref_id}`}
                  inputsEnabled={requestActionFetcher.state === "idle"}
                  onAccept={() =>
                    handleAcceptRequest(entry.access_request.ref_id)
                  }
                  onReject={() =>
                    handleRejectRequest(entry.access_request.ref_id)
                  }
                />
              ))}
            </EntityStack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          {filteredOutgoingRequests.length === 0 ? (
            <EntityNoNothingCard
              title="No Outgoing Requests"
              message="When you ask for access to someone else's entity, it will show up here."
              helpSubject={DocsHelpSubject.ROOT}
            />
          ) : (
            <EntityStack>
              {filteredOutgoingRequests.map((entry) => (
                <CollaborationRequestCard
                  key={`outgoing-${entry.access_request.ref_id}`}
                  entry={entry}
                  today={topLevelInfo.today}
                  subjectMode="to"
                  requestPath={`/app/workspace/core/collaboration/requests/from-me/${entry.access_request.ref_id}`}
                />
              ))}
            </EntityStack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={3}>
          {filteredSharedWithMe.length === 0 ? (
            <EntityNoNothingCard
              title="Nothing Shared With You"
              message="When someone invites you to an entity, it will show up here."
              helpSubject={DocsHelpSubject.ROOT}
            />
          ) : (
            <EntityStack>
              {filteredSharedWithMe.map((entry) => (
                <CollaborationCard
                  key={`with-me-${entry.access_grant.ref_id}`}
                  entry={entry}
                  today={topLevelInfo.today}
                  subjectMode="from"
                  grantPath={`/app/workspace/core/collaboration/grants/to-me/${entry.access_grant.ref_id}`}
                />
              ))}
            </EntityStack>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={4}>
          {filteredSharedByMe.length === 0 ? (
            <EntityNoNothingCard
              title="Nothing Shared By You"
              message="When you invite someone to an entity, it will show up here."
              helpSubject={DocsHelpSubject.ROOT}
            />
          ) : (
            <EntityStack>
              {filteredSharedByMe.map((entry) => (
                <CollaborationCard
                  key={`by-me-${entry.access_grant.ref_id}`}
                  entry={entry}
                  today={topLevelInfo.today}
                  subjectMode="to"
                  grantPath={`/app/workspace/core/collaboration/grants/from-me/${entry.access_grant.ref_id}`}
                />
              ))}
            </EntityStack>
          )}
        </TabPanel>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

function filterEntriesBySubject<
  T extends
    | CollaborationEntry
    | CollaborationRequestEntry
    | CollaborationInviteEntry,
>(entries: T[], selectedSubjectRefIds: EntityId[]): T[] {
  if (selectedSubjectRefIds.length === 0) {
    return entries;
  }
  const selected = new Set(selectedSubjectRefIds);
  return entries.filter((entry) => selected.has(entry.subject.ref_id));
}

interface CollaborationCardProps {
  entry: CollaborationEntry;
  today: ADate;
  subjectMode: "from" | "to";
  grantPath: string;
}

function CollaborationCard(props: CollaborationCardProps) {
  const { entry } = props;
  const grantRefId = entry.access_grant.ref_id;

  return (
    <EntityCard entityId={`collaboration-grant-${grantRefId}`}>
      {props.subjectMode === "from" ? (
        <UserLightChip user={entry.subject} />
      ) : (
        <CardBottomRightChipStack>
          <OwnerCornerChip
            label={`To @${entry.subject.name}`}
            title={formatUserLightLabel(entry.subject)}
            color="secondary"
          />
        </CardBottomRightChipStack>
      )}
      <EntityLink to={props.grantPath}>
        <SlimChip
          label={entityTagName(entry.entity.entity_tag)}
          color="primary"
        />
        <EntityNameComponent name={entry.entity.name} />
        <SlimChip
          label={accessLevelName(entry.access_grant.access_level)}
          color="info"
        />
        <TimeDiffTag
          today={props.today}
          labelPrefix="Shared"
          collectionTime={entry.access_grant.last_modified_time}
          compact
        />
      </EntityLink>
    </EntityCard>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading collaborations! Please try again!`,
});
