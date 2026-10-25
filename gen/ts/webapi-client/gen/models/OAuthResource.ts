/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The resource an OAuth grant gives access to.
 *
 * This is the resource indicator from RFC 8707: the URL of the server the
 * access is for, such as the MCP endpoint. The client names it when it asks for
 * access, and the grant is tied to it so the access cannot be used for another
 * server.
 *
 */
export type OAuthResource = string;
