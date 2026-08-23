import type { EntityId, JournalQuestion } from "@jupiter/webapi-client";
import { RecurringTaskPeriod } from "@jupiter/webapi-client";

export function sortQuestionsByOrder(
  questions: JournalQuestion[],
  order: EntityId[],
): JournalQuestion[] {
  return [...questions].sort((a, b) => {
    const orderA = order.indexOf(a.ref_id);
    const orderB = order.indexOf(b.ref_id);
    if (orderA === -1 && orderB === -1) {
      return 0;
    }
    if (orderA === -1) {
      return 1;
    }
    if (orderB === -1) {
      return -1;
    }
    return orderA - orderB;
  });
}

export function shiftQuestionUpInList(
  question: JournalQuestion,
  order: EntityId[],
): EntityId[] {
  const index = order.indexOf(question.ref_id);
  if (index === -1) {
    throw new Error("Invariant violation");
  }
  if (index === 0) {
    return order;
  }
  const newOrder = [...order];
  newOrder[index] = order[index - 1];
  newOrder[index - 1] = order[index];
  return newOrder;
}

export function shiftQuestionDownInList(
  question: JournalQuestion,
  order: EntityId[],
): EntityId[] {
  const index = order.indexOf(question.ref_id);
  if (index === -1) {
    throw new Error("Invariant violation");
  }
  if (index === order.length - 1) {
    return order;
  }
  const newOrder = [...order];
  newOrder[index] = order[index + 1];
  newOrder[index + 1] = order[index];
  return newOrder;
}

export const JOURNAL_QUESTION_PERIOD_DISPLAY_ORDER: RecurringTaskPeriod[] = [
  RecurringTaskPeriod.YEARLY,
  RecurringTaskPeriod.QUARTERLY,
  RecurringTaskPeriod.MONTHLY,
  RecurringTaskPeriod.WEEKLY,
  RecurringTaskPeriod.DAILY,
];
