/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UiStyle } from './UiStyle';
/**
 * Web UI settings update args.
 */
export type WebUiSettingsUpdateArgs = {
    use_night_mode: {
        should_change: boolean;
        value?: boolean;
    };
    ui_style: {
        should_change: boolean;
        value?: UiStyle;
    };
    use_expanded_rail: {
        should_change: boolean;
        value?: boolean;
    };
};

