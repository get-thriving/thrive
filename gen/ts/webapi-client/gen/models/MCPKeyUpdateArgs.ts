/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { MCPKeyName } from './MCPKeyName';
/**
 * MCP key update args.
 */
export type MCPKeyUpdateArgs = {
    ref_id: EntityId;
    name: {
        should_change: boolean;
        value?: MCPKeyName;
    };
};

