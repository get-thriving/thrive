import { KeyboardAction } from "@jupiter/webapi-client";

/**
 * The key of every action, as the web app starts with them: the ones the user
 * has until they change them (ADR 0021). The WebAPI keeps the same ones
 * (`default_key_bindings.py`, whose test checks that they agree), and gives
 * them to a user at sign-up and on a reset; this copy is for before the
 * settings are known, and for what a user's settings lack.
 */
export const DEFAULT_KEY_BINDINGS: Record<KeyboardAction, string> = {
  [KeyboardAction.COLUMN_PREVIOUS]: "h",
  [KeyboardAction.COLUMN_NEXT]: "l",
  [KeyboardAction.COLUMN_NARROWER]: "u",
  [KeyboardAction.COLUMN_WIDER]: "i",
  [KeyboardAction.NEXT]: "j",
  [KeyboardAction.PREVIOUS]: "k",
  [KeyboardAction.OPEN]: "Enter",
  [KeyboardAction.EDIT]: "e",
  [KeyboardAction.COLLAPSE]: "z",
  [KeyboardAction.SPLIT]: "c",
  [KeyboardAction.FOLD_BACK]: "Shift+c",
  [KeyboardAction.HINTS]: "s",
  [KeyboardAction.MAP]: "a",
  [KeyboardAction.APPS]: "q",
  [KeyboardAction.COMMANDS]: "x",
  [KeyboardAction.NEW]: "n",
  [KeyboardAction.FIND]: "f",
  [KeyboardAction.POSITION_PREVIOUS]: "o",
  [KeyboardAction.POSITION_NEXT]: "p",
  [KeyboardAction.SCROLL_TOP]: "Shift+k",
  [KeyboardAction.SCROLL_BOTTOM]: "Shift+j",
  [KeyboardAction.MENU]: ".",
  [KeyboardAction.CLOSE]: "Escape",
};
