/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecoveryTokenPlain } from './RecoveryTokenPlain';
import type { Workspace } from './Workspace';
/**
 * Init create workspace use case result.
 */
export type InitCreateWorkspaceResult = {
    new_workspace: Workspace;
    recovery_token?: (RecoveryTokenPlain | null);
};

