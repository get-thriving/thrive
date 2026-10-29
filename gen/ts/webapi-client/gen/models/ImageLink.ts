/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImageUrl } from './ImageUrl';
import type { Timestamp } from './Timestamp';
/**
 * A link to serve an image from, and for how long it is good.
 *
 * Public stores hand out links that never expire. A store that signs its
 * links (a private bucket) would set ``expires_at``, and callers must not
 * keep such a link around past that moment.
 *
 */
export type ImageLink = {
    url: ImageUrl;
    expires_at?: (Timestamp | null);
};

