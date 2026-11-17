import { KeyboardAction } from "@jupiter/webapi-client";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

import type { ActionResult } from "#/core/infra/action-result";
import { GlobalError } from "#/core/infra/component/errors";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import { useHydrated } from "#/core/infra/component/use-hidrated";
import { strataKeyBindingLabel } from "#/core/infra/strata/strata-key-binding";
import { STRATA_KEY_ACTION_GROUPS } from "#/core/infra/strata/strata-key-action-info";
import type { StrataKeyBindings } from "#/core/infra/strata/strata-key-bindings";
import { strataKeyCapture } from "#/core/infra/strata/strata-key-capture";
import { strataKeyConflict } from "#/core/infra/strata/strata-key-conflict";
import { DEFAULT_KEY_BINDINGS } from "#/core/infra/strata/strata-key-defaults";

interface KeyBindingsEditorProps {
  /** The keys the user has now. */
  bindings: StrataKeyBindings;
  inputsEnabled: boolean;
}

const LABEL_OF: Record<KeyboardAction, string> = Object.fromEntries(
  STRATA_KEY_ACTION_GROUPS.flatMap((group) => group.actions).map((info) => [
    info.action,
    info.label,
  ]),
) as Record<KeyboardAction, string>;

/**
 * The keys of every keyboard action, for the user to change (ADR 0021). Click
 * on one and it waits for the key, or combination of keys, to use for it:
 * `Escape` leaves it as it was. A key that another action has is refused, with
 * a word on which one, and the choice waits for another. Every choice is saved
 * at once, to the closest route's action as `set-key-bindings`, with all the
 * keys, by a fetcher of its own; `reset-key-bindings` puts them all back to
 * what the web app starts with, `reset-key-binding` one of them.
 */
export function KeyBindingsEditor(props: KeyBindingsEditorProps) {
  const fetcher = useFetcher<ActionResult<unknown>>();
  const hydrated = useHydrated();
  const [capturing, setCapturing] = useState<KeyboardAction | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const busy = fetcher.state !== "idle";
  const canEdit = hydrated && props.inputsEnabled && !busy;
  const isDefault = Object.values(KeyboardAction).every(
    (action) => props.bindings[action] === DEFAULT_KEY_BINDINGS[action],
  );

  function save(next: StrataKeyBindings) {
    setCapturing(null);
    setWarning(null);
    const formData = new FormData();
    formData.set("intent", "set-key-bindings");
    formData.set("keyBindings", JSON.stringify(next));
    fetcher.submit(formData, { method: "post" });
  }

  function reset(intent: string, action?: KeyboardAction) {
    setCapturing(null);
    setWarning(null);
    const formData = new FormData();
    formData.set("intent", intent);
    if (action !== undefined) {
      formData.set("action", action);
    }
    fetcher.submit(formData, { method: "post" });
  }

  // While an action waits for its key, every key is its, and nothing else on
  // the page gets one: before anything else on the window.
  useEffect(() => {
    if (capturing === null) {
      return;
    }
    const action = capturing;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.isComposing) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const capture = strataKeyCapture(event);
      switch (capture.kind) {
        case "wait":
          return;
        case "cancel":
          setCapturing(null);
          setWarning(null);
          return;
        case "bind": {
          const other = strataKeyConflict(
            props.bindings,
            action,
            capture.binding,
          );
          if (other !== null) {
            setWarning(
              `${strataKeyBindingLabel(capture.binding)} is already the key to “${LABEL_OF[other]}”. Choose another key, or change that one first.`,
            );
            return;
          }
          if (capture.binding === props.bindings[action]) {
            setCapturing(null);
            setWarning(null);
            return;
          }
          save({ ...props.bindings, [action]: capture.binding });
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
    // `save` only reads what the effect already depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturing, props.bindings]);

  return (
    <Stack spacing={2} id="key-bindings">
      <Typography variant="body2">
        Click a key to change it, then press the key or combination of keys you
        want. Escape leaves it as it was.
      </Typography>
      {warning !== null && (
        <Alert id="key-bindings-warning" severity="warning">
          {warning}
        </Alert>
      )}
      {fetcher.state === "idle" && <GlobalError actionResult={fetcher.data} />}
      {STRATA_KEY_ACTION_GROUPS.map((group) => (
        <Stack key={group.title} spacing={0.5}>
          <Box
            component="span"
            sx={{
              fontFamily: strataFonts.mono,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: strataColors.textFaintest,
            }}
          >
            {group.title}
          </Box>
          {group.actions.map((info) => {
            const binding = props.bindings[info.action];
            const isCapturing = capturing === info.action;
            return (
              <Stack
                key={info.action}
                direction="row"
                spacing={1}
                sx={{ alignItems: "center", justifyContent: "space-between" }}
              >
                <Typography>{info.label}</Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  {binding !== DEFAULT_KEY_BINDINGS[info.action] && (
                    <Button
                      id={`key-binding-${info.action}-reset`}
                      type="button"
                      size="small"
                      disabled={!canEdit}
                      onClick={() => reset("reset-key-binding", info.action)}
                    >
                      Default (
                      {strataKeyBindingLabel(DEFAULT_KEY_BINDINGS[info.action])}
                      )
                    </Button>
                  )}
                  <Button
                    id={`key-binding-${info.action}`}
                    type="button"
                    variant="outlined"
                    size="small"
                    disabled={!canEdit}
                    aria-pressed={isCapturing}
                    data-strata-key-capture={isCapturing ? "true" : undefined}
                    onClick={() => {
                      setWarning(null);
                      setCapturing(isCapturing ? null : info.action);
                    }}
                    onBlur={() => {
                      if (isCapturing) {
                        setCapturing(null);
                        setWarning(null);
                      }
                    }}
                    sx={{
                      minWidth: 168,
                      fontFamily: strataFonts.mono,
                      textTransform: "none",
                      borderRadius: `${strataRadius.small}px`,
                      ...(isCapturing && {
                        borderColor: strataColors.amber,
                        color: strataColors.amber,
                      }),
                    }}
                  >
                    {isCapturing
                      ? "press a key…"
                      : strataKeyBindingLabel(binding)}
                  </Button>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      ))}
      <Box>
        <Button
          id="key-bindings-reset"
          type="button"
          variant="outlined"
          disabled={!canEdit || isDefault}
          onClick={() => reset("reset-key-bindings")}
        >
          Reset to defaults
        </Button>
      </Box>
    </Stack>
  );
}
