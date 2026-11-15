/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColorScheme } from './ColorScheme';
import type { EntityId } from './EntityId';
import type { KeyBinding } from './KeyBinding';
import type { Timestamp } from './Timestamp';
/**
 * Web UI settings for a user.
 */
export type WebUiSettings = {
    ref_id: EntityId;
    version: number;
    archived: boolean;
    archival_reason?: (string | null);
    created_time: Timestamp;
    last_modified_time: Timestamp;
    archived_time?: (Timestamp | null);
    user_ref_id: string;
    color_scheme: ColorScheme;
    use_expanded_rail: boolean;
    key_bindings: Record<string, KeyBinding>;
};

