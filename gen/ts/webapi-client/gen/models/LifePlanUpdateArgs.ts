/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Birthday } from './Birthday';
import type { BirthYear } from './BirthYear';
/**
 * Life plan update args.
 */
export type LifePlanUpdateArgs = {
    birthday: {
        should_change: boolean;
        value?: Birthday;
    };
    birth_year: {
        should_change: boolean;
        value?: BirthYear;
    };
};

