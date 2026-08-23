/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { TimePlanQuestion } from './TimePlanQuestion';
/**
 * TimePlanQuestionFind result.
 */
export type TimePlanQuestionFindResult = {
    questions: Array<TimePlanQuestion>;
    order_of_questions: Record<string, Array<EntityId>>;
};

