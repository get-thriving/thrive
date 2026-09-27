/**
 * Regenerating a habit's or chore's inbox tasks from the time plan view.
 *
 * Regen isn't a local edit: it can create, change or archive any of the tasks,
 * so once it's done the view reloads.
 */
import { Button } from "@mui/material";
import { useRevalidator } from "react-router";
import { useSnackbar } from "notistack";
import { useCallback } from "react";

import { postMutation } from "#/core/apps/time_plans/store/mutation";
import {
  REGEN_CHORE_ACTION,
  REGEN_HABIT_ACTION,
} from "#/core/apps/time_plans/store/regen";

export type RegenKind = "habit" | "chore";

const REGEN_ACTIONS: Record<RegenKind, string> = {
  habit: REGEN_HABIT_ACTION,
  chore: REGEN_CHORE_ACTION,
};

const COULD_NOT_REGEN = "Could not regenerate the tasks! Please try again!";

export interface RegenRunner {
  regen: (kind: RegenKind, refId: string) => Promise<void>;
  // Shows a snackbar offering to regen, for edits that changed generation.
  offerRegen: (kind: RegenKind, refId: string, name: string) => void;
}

export function useRegen(): RegenRunner {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  // The panel that asked is usually gone by the time this runs; the revalidator
  // belongs to the router, so it still reloads the view.
  const { revalidate } = useRevalidator();

  const regen = useCallback(
    async (kind: RegenKind, refId: string) => {
      const result = await postMutation<unknown>(REGEN_ACTIONS[kind], {
        refId,
      });
      if (result.theType === "some-error-no-data") {
        enqueueSnackbar(result.globalError ?? COULD_NOT_REGEN, {
          variant: "error",
          autoHideDuration: 4000,
        });
        return;
      }
      revalidate();
    },
    [enqueueSnackbar, revalidate],
  );

  const offerRegen = useCallback(
    (kind: RegenKind, refId: string, name: string) => {
      enqueueSnackbar(
        `The ${kind === "habit" ? "habit" : "chore"} "${name}" was saved. Its current tasks keep the old settings until they're regenerated.`,
        {
          variant: "info",
          autoHideDuration: 10000,
          action: (snackbarKey) => (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                closeSnackbar(snackbarKey);
                void regen(kind, refId);
              }}
            >
              Regenerate
            </Button>
          ),
        },
      );
    },
    [enqueueSnackbar, closeSnackbar, regen],
  );

  return { regen, offerRegen };
}
