/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The namespace an instance's images live under in a store.
 *
 * Instances of one environment (the per-PR ones on staging) share a bucket,
 * and the namespace keeps their images apart, and lets one instance's
 * cleanup list its own images only. It is also a directory on disk, so it is
 * a single segment of safe characters and never starts with a dot: it can
 * neither climb out of a directory nor be a hidden one.
 *
 */
export type InstanceNamespace = string;
