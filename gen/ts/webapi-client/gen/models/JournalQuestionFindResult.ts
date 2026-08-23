/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityId } from './EntityId';
import type { JournalQuestion } from './JournalQuestion';
/**
 * JournalQuestionFind result.
 */
export type JournalQuestionFindResult = {
    questions: Array<JournalQuestion>;
    order_of_questions: Record<string, Array<EntityId>>;
};

