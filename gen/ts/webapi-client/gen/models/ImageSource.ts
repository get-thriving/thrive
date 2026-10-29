/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Where a stored image came from.
 *
 * It decides who may replace it: a refresh from a social login only ever
 * replaces a picture that same login brought, never one the user chose.
 *
 */
export enum ImageSource {
    UPLOADED = 'uploaded',
    GOOGLE = 'google',
}
