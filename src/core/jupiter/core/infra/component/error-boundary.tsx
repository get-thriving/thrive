import { AccessLevel } from "@jupiter/webapi-client";
import { Alert, AlertTitle, Box, Button, ButtonGroup } from "@mui/material";
import {
  Link,
  isRouteErrorResponse,
  useFetcher,
  useLocation,
  useParams,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";

import { resolveShareableEntityFromPath } from "#/core/common/sub/access/resolve-shareable-entity-from-path";
import { isDevelopment } from "#/core/env";
import { GlobalPropertiesContext } from "#/core/config-client";
import {
  isUserNotAllowedAccessToEntityError,
  USER_NOT_ALLOWED_ACCESS_TO_ENTITY_LABEL,
} from "#/core/infra/errors";
import { BranchPanel } from "#/core/infra/component/layout/branch-panel";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { ToolPanel } from "#/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "#/core/infra/component/layout/trunk-panel";

const UPGRADE_REQUIRED = 426;
const REQUEST_ACCESS_ROUTE = "/app/workspace/core/access/request-access";

function ErrorDevDetails({ error }: { error: unknown }) {
  const globalProperties = useContext(GlobalPropertiesContext);

  if (!isDevelopment(globalProperties.env)) {
    return null;
  }

  if (isRouteErrorResponse(error)) {
    return (
      <Box>
        <pre>{error.statusText}</pre>
        <pre>{JSON.stringify(error.data, null, 2)}</pre>
      </Box>
    );
  }

  if (error instanceof Error) {
    return (
      <Box>
        <pre>{error.message}</pre>
        <pre>{error.stack}</pre>
      </Box>
    );
  }

  return null;
}

function AccessDeniedAlert() {
  const location = useLocation();
  const params = useParams();
  const requestFetcher = useFetcher<{ theType?: string }>();
  const [requestedLevel, setRequestedLevel] = useState<AccessLevel | null>(
    null,
  );

  const shareableEntity = resolveShareableEntityFromPath(
    location.pathname,
    params,
  );
  const inputsEnabled = requestFetcher.state === "idle";

  const requestSucceeded =
    requestedLevel !== null &&
    requestFetcher.state === "idle" &&
    requestFetcher.data?.theType === "no-error-no-data";

  function requestAccess(accessLevel: AccessLevel) {
    if (shareableEntity === null || !inputsEnabled) {
      return;
    }
    setRequestedLevel(accessLevel);
    requestFetcher.submit(
      {
        entityType: shareableEntity.entityType,
        entityRefId: shareableEntity.entityRefId,
        accessLevel,
      },
      {
        method: "post",
        action: REQUEST_ACCESS_ROUTE,
      },
    );
  }

  return (
    <Alert severity="warning">
      <AlertTitle>Access Denied</AlertTitle>
      {USER_NOT_ALLOWED_ACCESS_TO_ENTITY_LABEL}
      {shareableEntity !== null && (
        <Box sx={{ mt: 1 }}>
          {requestSucceeded ? (
            <Box>
              Access request sent. The owner can review it in Collaboration.
            </Box>
          ) : (
            <ButtonGroup>
              <Button
                variant="outlined"
                disabled={!inputsEnabled}
                onClick={() => requestAccess(AccessLevel.READER)}
              >
                Ask for read access
              </Button>
              <Button
                variant="outlined"
                disabled={!inputsEnabled}
                onClick={() => requestAccess(AccessLevel.WRITER)}
              >
                Ask for write access
              </Button>
            </ButtonGroup>
          )}
        </Box>
      )}
    </Alert>
  );
}

function SessionExpiredAlert() {
  return (
    <Alert severity="warning">
      <AlertTitle>Your session has expired! Login again!</AlertTitle>
      <ButtonGroup>
        <Button
          variant="outlined"
          component={Link}
          to="/app/lifecycle/login/local/login"
        >
          Login
        </Button>
      </ButtonGroup>
    </Alert>
  );
}

function NotFoundAlert({ label }: { label: string }) {
  return (
    <Alert severity="warning">
      <AlertTitle>Error</AlertTitle>
      {label}
    </Alert>
  );
}

function GenericErrorAlert({
  label,
  error,
}: {
  label: string;
  error: unknown;
}) {
  return (
    <Alert severity="error">
      <AlertTitle>Danger</AlertTitle>
      {label}
      <ErrorDevDetails error={error} />
    </Alert>
  );
}

function UnknownErrorAlert() {
  return (
    <Alert severity="error">
      <AlertTitle>Critical</AlertTitle>
      Unknown error!
    </Alert>
  );
}

/**
 * What the error means for the user, independent of the panel it renders in.
 * The server-side handlers in `errors.server.ts` turn API failures into
 * responses, so anything a loader or action threw arrives here as either a
 * route error response or a plain error.
 */
type ErrorKind =
  | "access-denied"
  | "session-expired"
  | "not-found"
  | "error"
  | "unknown";

function classifyError(error: unknown): ErrorKind {
  // A 401 carrying a reason is a missing grant rather than a stale session.
  if (isUserNotAllowedAccessToEntityError(error)) {
    return "access-denied";
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === UPGRADE_REQUIRED) {
      return "session-expired";
    }

    if (error.status === StatusCodes.NOT_FOUND) {
      return "not-found";
    }

    return "error";
  }

  if (error instanceof Error) {
    return "error";
  }

  return "unknown";
}

export function makeRootErrorBoundary(labelsFor: { error?: () => string }) {
  function ErrorBoundary() {
    const error = useRouteError();
    const errorLabel = labelsFor.error
      ? labelsFor.error()
      : "Error retrieving entity!";

    switch (classifyError(error)) {
      case "session-expired":
        return <SessionExpiredAlert />;
      case "access-denied":
        return <AccessDeniedAlert />;
      // The root has no entity to report as missing.
      case "not-found":
      case "error":
        return <GenericErrorAlert label={errorLabel} error={error} />;
      case "unknown":
        return <UnknownErrorAlert />;
    }
  }

  return ErrorBoundary;
}

/** The labels a panel-scoped boundary can render, keyed off the route params. */
interface EntityLabels<K extends z.ZodRawShape> {
  notFound?: (
    params: z.infer<z.ZodObject<K>>,
    searchParams: URLSearchParams,
  ) => string;
  error?: (
    params: z.infer<z.ZodObject<K>>,
    searchParams: URLSearchParams,
  ) => string;
}

type ReturnLocation<K extends z.ZodRawShape> =
  | string
  | ((
      params: z.infer<z.ZodObject<K>>,
      searchParams: URLSearchParams,
    ) => string);

function useEntityErrorContent<K extends z.ZodRawShape>(
  returnLocation: ReturnLocation<K>,
  paramsParser: z.ZodObject<K>,
  labelsFor: EntityLabels<K>,
) {
  const error = useRouteError();
  const paramsRaw = useParams();
  const parsedParams = paramsParser.safeParse(paramsRaw);
  const params = parsedParams.success
    ? parsedParams.data
    : (paramsRaw as z.infer<typeof paramsParser>);
  const [searchParams] = useSearchParams();

  const resolvedReturnLocation =
    typeof returnLocation === "function"
      ? returnLocation(params, searchParams)
      : returnLocation;

  let content;
  switch (classifyError(error)) {
    case "not-found":
      content = (
        <NotFoundAlert
          label={
            labelsFor.notFound
              ? labelsFor.notFound(params, searchParams)
              : "Could not find entity!"
          }
        />
      );
      break;
    case "access-denied":
      content = <AccessDeniedAlert />;
      break;
    case "session-expired":
      content = <SessionExpiredAlert />;
      break;
    case "error":
      content = (
        <GenericErrorAlert
          label={
            labelsFor.error
              ? labelsFor.error(params, searchParams)
              : "Error retrieving entity!"
          }
          error={error}
        />
      );
      break;
    case "unknown":
      content = <UnknownErrorAlert />;
      break;
  }

  return { content, resolvedReturnLocation };
}

export function makeLeafErrorBoundary<K extends z.ZodRawShape>(
  returnLocation: ReturnLocation<K>,
  paramsParser: z.ZodObject<K>,
  labelsFor: EntityLabels<K>,
) {
  function ErrorBoundary() {
    const { content, resolvedReturnLocation } = useEntityErrorContent(
      returnLocation,
      paramsParser,
      labelsFor,
    );

    return (
      <LeafPanel
        key="error"
        fakeKey="error"
        inputsEnabled={true}
        returnLocation={resolvedReturnLocation}
      >
        {content}
      </LeafPanel>
    );
  }

  return ErrorBoundary;
}

export function makeBranchErrorBoundary<K extends z.ZodRawShape>(
  returnLocation: ReturnLocation<K>,
  paramsParser: z.ZodObject<K>,
  labelsFor: EntityLabels<K>,
) {
  function ErrorBoundary() {
    const { content, resolvedReturnLocation } = useEntityErrorContent(
      returnLocation,
      paramsParser,
      labelsFor,
    );

    return (
      <BranchPanel
        key="error"
        inputsEnabled={true}
        returnLocation={resolvedReturnLocation}
      >
        {content}
      </BranchPanel>
    );
  }

  return ErrorBoundary;
}

export function makeTrunkErrorBoundary(
  returnLocation: string,
  labelsFor: {
    error?: () => string;
  },
) {
  function ErrorBoundary() {
    const error = useRouteError();
    const errorLabel = labelsFor.error
      ? labelsFor.error()
      : "Error retrieving entity!";

    let content;
    switch (classifyError(error)) {
      case "access-denied":
        content = <AccessDeniedAlert />;
        break;
      case "session-expired":
        content = <SessionExpiredAlert />;
        break;
      // A trunk lists entities rather than showing one, so nothing is missing.
      case "not-found":
      case "error":
        content = <GenericErrorAlert label={errorLabel} error={error} />;
        break;
      case "unknown":
        content = <UnknownErrorAlert />;
        break;
    }

    return (
      <TrunkPanel key="error" returnLocation={returnLocation}>
        {content}
      </TrunkPanel>
    );
  }

  return ErrorBoundary;
}

export function makeToolErrorBoundary(labelFn: () => string) {
  function ErrorBoundary() {
    const error = useRouteError();

    let content;
    switch (classifyError(error)) {
      case "access-denied":
        content = <AccessDeniedAlert />;
        break;
      case "session-expired":
        content = <SessionExpiredAlert />;
        break;
      case "not-found":
      case "error":
        content = <GenericErrorAlert label={labelFn()} error={error} />;
        break;
      case "unknown":
        content = <UnknownErrorAlert />;
        break;
    }

    return <ToolPanel key="error">{content}</ToolPanel>;
  }

  return ErrorBoundary;
}
