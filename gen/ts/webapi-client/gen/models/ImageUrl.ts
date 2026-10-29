/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * A link an image can be fetched from.
 *
 * Either absolute (a public bucket) or relative to the origin the page was
 * served from (``/images/...``, the WebUI serves those). The relative form
 * keeps the local store free of host and port settings: the browser resolves
 * it against whatever server the app is talking to.
 *
 */
export type ImageUrl = string;
