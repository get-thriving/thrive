/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorScheme } from './ColorScheme';
import type { KeyBinding } from './KeyBinding';
/**
 * Web UI settings update args.
 */
export type WebUiSettingsUpdateArgs = {
    color_scheme: {
        should_change: boolean;
        value?: ColorScheme;
    };
    use_expanded_rail: {
        should_change: boolean;
        value?: boolean;
    };
    key_bindings: {
        should_change: boolean;
        value?: Record<string, KeyBinding>;
    };
};

