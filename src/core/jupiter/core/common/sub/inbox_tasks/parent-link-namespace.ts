/** Wire values match Python ``parent_link_namespace.py`` (``type:purpose``, no ref id). */

export const TODO_TASK = "TodoTask:std";
export const WORKING_MEM_CLEANUP = "WorkingMemCollection:std";
export const TIME_PLAN = "TimePlan:std";
export const HABIT = "Habit:std";
export const CHORE = "Chore:std";
export const PROJECT = "Project:std";
export const JOURNAL = "Journal:std";
export const METRIC = "Metric:std";
export const PERSON_CATCH_UP = "Person:std";
export const PERSON_OCCASION = "Occasion:std";
export const SLACK_TASK = "SlackTask:std";
export const EMAIL_TASK = "EmailTask:std";
export const LIFE_PLAN_EVAL = "LifePlan:std";

export const ALL_INBOX_TASK_SOURCE_PARENT_LINK_NAMESPACES = [
  TODO_TASK,
  WORKING_MEM_CLEANUP,
  TIME_PLAN,
  HABIT,
  CHORE,
  PROJECT,
  JOURNAL,
  METRIC,
  PERSON_CATCH_UP,
  PERSON_OCCASION,
  SLACK_TASK,
  EMAIL_TASK,
  LIFE_PLAN_EVAL,
] as const;

/** Decode ``the_type:purpose:ref_id`` → ``the_type:purpose`` (Python ``EntityLink`` wire form). */
export function parentLinkNamespaceFromEntityLinkWire(link: string): string {
  const parts = link.split(":");
  if (parts.length < 3) {
    throw new Error(`Invalid entity link for parent namespace: ${link}`);
  }
  parts.pop(); // ref id
  const purpose = parts.pop()!;
  const theType = parts.join(":");
  return `${theType}:${purpose}`;
}

/** Last segment of ``the_type:purpose:ref_id`` wire form. */
export function entityLinkRefIdFromWire(link: string): string {
  const parts = link.split(":");
  if (parts.length < 3) {
    throw new Error(`Invalid entity link: ${link}`);
  }
  return parts[parts.length - 1]!;
}
