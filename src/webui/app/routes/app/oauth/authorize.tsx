import { PkceCodeChallengeMethod } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
  redirect,
  redirectDocument,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  ActionsExpansion,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  getGuestApiClient,
  getLoggedInApiClient,
} from "@jupiter/core/infra/api-clients.server";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";

import { getSession } from "~/sessions";

// The OAuth request as the MCP service forwarded it, see /authorize there. It
// stays in the url: the page's form posts back to the same url, query included.
const QuerySchema = z.object({
  client_id: z.string(),
  redirect_uri: z.string(),
  resource: z.string(),
  code_challenge: z.string(),
  code_challenge_method: z.nativeEnum(PkceCodeChallengeMethod),
  state: z.string().optional(),
  // The server that issues the code, named by the MCP service. It goes back to
  // the client as iss, so the client can tell who answered (RFC 9207).
  issuer: z.string().optional(),
});

const AuthorizeFormSchema = z.object({
  intent: z.enum(["allow", "deny"]),
});

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);

  const session = await getSession(request.headers.get("Cookie"));
  const guestClient = await getGuestApiClient(request);
  const signedIn = session.has(AUTH_TOKEN_NAME)
    ? (await guestClient.application.loadTopLevelInfo({})).user
    : undefined;

  if (!signedIn) {
    // Sign in first, and the login brings the user back to this very request.
    const url = new URL(request.url);
    const returnTo = `${url.pathname}${url.search}`;
    return redirect(
      `/app/lifecycle/login/local/login?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  return {
    request: query,
    emailAddress: signedIn.email_address,
  };
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const form = await parseForm(request, AuthorizeFormSchema);

  try {
    switch (form.intent) {
      case "deny": {
        return { denied: true };
      }

      case "allow": {
        const result = await apiClient.auth.oAuthGrantCreate({
          client_id: query.client_id,
          redirect_uri: query.redirect_uri,
          resource: query.resource,
          code_challenge: query.code_challenge,
          code_challenge_method: query.code_challenge_method,
        });

        // The core checked this redirect is a loopback or known client address.
        const target = new URL(query.redirect_uri);
        target.searchParams.set("code", result.code);
        if (query.state !== undefined) {
          target.searchParams.set("state", query.state);
        }
        if (query.issuer !== undefined) {
          target.searchParams.set("iss", query.issuer);
        }
        return redirectDocument(target.toString());
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

// @secureFn
export default function OAuthAuthorize() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  if (actionData !== undefined && "denied" in actionData) {
    return (
      <StandaloneContainer>
        <SmartAppBar>
          <Logo />
          <Title />
        </SmartAppBar>
        <LifecyclePanel>
          <SectionCard title="Access denied">
            <Typography>
              Nothing was shared. You can close this window.
            </Typography>
          </SectionCard>
        </LifecyclePanel>
      </StandaloneContainer>
    );
  }

  const { request, emailAddress } = loaderData as Exclude<
    typeof loaderData,
    Response
  >;

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />
        <Title />
      </SmartAppBar>

      <LifecyclePanel>
        <GlobalError actionResult={actionData} />
        {/* No form action is set, so the card posts back to this same url with
            the query string, which is how the action sees the OAuth request. */}
        <SectionCard
          title="Connect to Thrive"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="oauth-authorize"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ActionSingle({
                  text: "Allow",
                  value: "allow",
                  highlight: true,
                }),
                ActionSingle({ text: "Deny", value: "deny" }),
              ]}
            />
          }
        >
          <Typography>
            <strong>{request.client_id}</strong> wants to use Thrive as{" "}
            <strong>{emailAddress}</strong>. It will be able to read and change
            your data until you revoke it.
          </Typography>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error connecting to Thrive! Please try again!`,
});
