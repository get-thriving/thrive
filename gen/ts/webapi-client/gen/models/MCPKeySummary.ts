/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { MCPKeyName } from './MCPKeyName';
/**
 * Summary of an MCP key, safe for web display.
 */
export type MCPKeySummary = {
    ref_id: EntityId;
    name: MCPKeyName;
    last_four_digits: string;
    archived: boolean;
};

