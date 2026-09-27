/**
 * Running edits against the time plan store.
 *
 * An edit is applied to the store right away, posted to a resource route, and
 * reconciled with what the route sends back. Edits go out with ``fetch`` rather
 * than a router fetcher: several can be in flight at once without cancelling
 * each other, and nothing asks React Router to reload the view afterwards.
 */
import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";

import type { ActionResult, SomeErrorNoData } from "#/core/infra/action-result";
import { aGlobalError } from "#/core/infra/action-result";
import { useTimePlanStore } from "#/core/apps/time_plans/store/context";
import type {
  TimePlanEntities,
  TimePlanEntityDelta,
} from "#/core/apps/time_plans/store/store";

export interface TimePlanMutation<Args, Result> {
  // The resource route the edit is posted to.
  action: string;
  toFormFields: (args: Args) => Record<string, string>;
  applyOptimistic: (entities: TimePlanEntities, args: Args) => TimePlanEntities;
  toDelta: (result: Result) => TimePlanEntityDelta;
  // The store source new entities from the result belong to.
  source?: string;
}

const COULD_NOT_SAVE = "Could not save that! Please try again!";

/** Post ``fields`` to a resource route and read back its action result. */
export async function postMutation<Result>(
  action: string,
  fields: Record<string, string>,
): Promise<ActionResult<Result>> {
  try {
    const response = await fetch(action, {
      method: "POST",
      body: new URLSearchParams(fields),
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });
    if (!response.ok) {
      return aGlobalError(COULD_NOT_SAVE);
    }
    return (await response.json()) as ActionResult<Result>;
  } catch {
    return aGlobalError(COULD_NOT_SAVE);
  }
}

export interface TimePlanMutationRunner<Args, Result> {
  run: (args: Args) => void;
  // Like ``run``, for callers that need what the route sent back - the ids of
  // entities it created, say. Null when the edit failed.
  runForResult: (args: Args) => Promise<Result | null>;
  inFlight: boolean;
  error: SomeErrorNoData | null;
}

export function useTimePlanMutation<Args, Result>(
  mutation: TimePlanMutation<Args, Result>,
): TimePlanMutationRunner<Args, Result> {
  const { enqueueMutation, resolveMutation, rejectMutation } =
    useTimePlanStore();
  const { enqueueSnackbar } = useSnackbar();
  const [inFlightCount, setInFlightCount] = useState(0);
  const [error, setError] = useState<SomeErrorNoData | null>(null);

  const runForResult = useCallback(
    (args: Args): Promise<Result | null> => {
      const mutationId = crypto.randomUUID();
      enqueueMutation({
        id: mutationId,
        applyOptimistic: (entities) => mutation.applyOptimistic(entities, args),
      });
      setInFlightCount((count) => count + 1);
      setError(null);

      return postMutation<Result>(mutation.action, mutation.toFormFields(args))
        .then((result) => {
          switch (result.theType) {
            case "no-error-some-data":
              resolveMutation(
                mutationId,
                mutation.toDelta(result.data),
                mutation.source ?? "plan",
              );
              return result.data;
            case "no-error-no-data":
              resolveMutation(mutationId, {}, mutation.source ?? "plan");
              return null;
            case "some-error-no-data":
              rejectMutation(mutationId);
              setError(result);
              // Whatever started the edit may be gone by now (a closed panel,
              // say), so the error is also shown where it can't be missed.
              enqueueSnackbar(result.globalError ?? COULD_NOT_SAVE, {
                variant: "error",
                autoHideDuration: 4000,
              });
              return null;
          }
        })
        .finally(() => setInFlightCount((count) => count - 1));
    },
    [
      mutation,
      enqueueMutation,
      resolveMutation,
      rejectMutation,
      enqueueSnackbar,
    ],
  );

  const run = useCallback(
    (args: Args) => {
      void runForResult(args);
    },
    [runForResult],
  );

  return { run, runForResult, inFlight: inFlightCount > 0, error };
}
