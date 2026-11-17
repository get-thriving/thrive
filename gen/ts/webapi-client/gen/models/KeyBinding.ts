/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A key, or a combination of keys, on the keyboard.
 *
 * Written as the web app reads it off a key press: zero or more modifiers in
 * the order `Ctrl+`, `Alt+`, `Meta+`, `Shift+`, and then the key itself. A key
 * that types a character is that character (`j`, `.`, `[`), a letter in
 * lowercase and with `Shift+` in front when shifted (`Shift+k`), as other
 * characters already say it in the character (`{`). Any other key is named
 * (`Enter`, `Escape`, `ArrowDown`, `Space`).
 *
 */
export type KeyBinding = string;
