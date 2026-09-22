/**
 * Reading a properties editor's fields out of its form.
 */
import type {
  RecurringTaskGenParams,
  SchedulingParams,
} from "@jupiter/webapi-client";
import { Difficulty, Eisen, Schedulability } from "@jupiter/webapi-client";
import { z } from "zod";

import {
  DEFAULT_SCHEDULING_EVENT_COUNT,
  DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
} from "#/core/common/scheduling-params";
import { constructFieldName } from "#/core/infra/field-names";

export type EditorFormField = (name: string) => string | null;

/** Reads fields named the way the editor with ``namePrefix`` names them. */
export function editorFormFields(
  formData: FormData,
  namePrefix: string,
): EditorFormField {
  return (name) => {
    const value = formData.get(constructFieldName(namePrefix, name));
    return typeof value === "string" ? value : null;
  };
}

/** A number from a select or input, where empty means none. */
export function nullableIntFromForm(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Ref ids a multi-select joined with commas. */
export function refIdsFromForm(value: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map((refId) => refId.trim())
    .filter((refId) => refId !== "");
}

export interface LifePlanAssociation {
  aspectRefId: string;
  chapterRefId: string | null;
  goalRefId: string | null;
}

/**
 * The aspect, chapter and goal an editor picked.
 *
 * Editors only show these when the workspace has a life plan, so without an
 * aspect there's nothing to change.
 */
export function lifePlanAssociationFromForm(
  field: EditorFormField,
): LifePlanAssociation | null {
  const aspectRefId = field("aspect");
  if (!aspectRefId) {
    return null;
  }
  return {
    aspectRefId,
    chapterRefId: field("chapter") || null,
    goalRefId: field("goal") || null,
  };
}

export function lifePlanAssociationToFormFields(
  association: LifePlanAssociation | null,
): Record<string, string> {
  if (association === null) {
    return {};
  }
  return {
    aspect: association.aspectRefId,
    chapter: association.chapterRefId ?? "",
    goal: association.goalRefId ?? "",
  };
}

export function lifePlanAssociationPatch(
  association: LifePlanAssociation | null,
): {
  aspect_ref_id?: string;
  chapter_ref_id?: string | null;
  goal_ref_id?: string | null;
} {
  if (association === null) {
    return {};
  }
  return {
    aspect_ref_id: association.aspectRefId,
    chapter_ref_id: association.chapterRefId,
    goal_ref_id: association.goalRefId,
  };
}

/** The gen params a recurring task's editor can change; periods can't. */
export interface RecurringTaskGenParamsEdit {
  eisen: Eisen;
  difficulty: Difficulty;
  actionableFromDay: number | null;
  actionableFromMonth: number | null;
  dueAtDay: number | null;
  dueAtMonth: number | null;
  skipRule: string | null;
}

const RecurringTaskGenParamsFormSchema = z.object({
  eisen: z.nativeEnum(Eisen),
  difficulty: z.nativeEnum(Difficulty),
});

/** The gen params as a ``RecurringTaskGenParamsBlock`` posts them. */
export function recurringTaskGenParamsFromForm(
  field: EditorFormField,
): RecurringTaskGenParamsEdit {
  const { eisen, difficulty } = RecurringTaskGenParamsFormSchema.parse({
    eisen: field("eisen"),
    difficulty: field("difficulty"),
  });
  return {
    eisen,
    difficulty,
    actionableFromDay: nullableIntFromForm(field("actionableFromDay")),
    actionableFromMonth: nullableIntFromForm(field("actionableFromMonth")),
    dueAtDay: nullableIntFromForm(field("dueAtDay")),
    dueAtMonth: nullableIntFromForm(field("dueAtMonth")),
    skipRule: field("skipRule") || null,
  };
}

export function recurringTaskGenParamsToFormFields(
  genParams: RecurringTaskGenParamsEdit,
): Record<string, string> {
  return {
    eisen: genParams.eisen,
    difficulty: genParams.difficulty,
    actionableFromDay: genParams.actionableFromDay?.toString() ?? "",
    actionableFromMonth: genParams.actionableFromMonth?.toString() ?? "",
    dueAtDay: genParams.dueAtDay?.toString() ?? "",
    dueAtMonth: genParams.dueAtMonth?.toString() ?? "",
    skipRule: genParams.skipRule ?? "",
  };
}

export function recurringTaskGenParamsPatch(
  current: RecurringTaskGenParams,
  genParams: RecurringTaskGenParamsEdit,
): RecurringTaskGenParams {
  return {
    ...current,
    eisen: genParams.eisen,
    difficulty: genParams.difficulty,
    actionable_from_day: genParams.actionableFromDay,
    actionable_from_month: genParams.actionableFromMonth,
    due_at_day: genParams.dueAtDay,
    due_at_month: genParams.dueAtMonth,
    skip_rule: genParams.skipRule,
  };
}

/** The scheduling params an entity's editor can change. */
export interface SchedulingParamsEdit {
  schedulability: Schedulability;
  eventDurationMins: number | null;
  eventCount: number | null;
}

const SchedulingParamsFormSchema = z.object({
  schedulability: z.nativeEnum(Schedulability),
});

/**
 * The scheduling params as a ``SchedulingParamsBlock`` posts them.
 *
 * Anything schedulable needs a duration and at least one event, so a blank
 * field reads as the default rather than as nothing.
 */
export function schedulingParamsFromForm(
  field: EditorFormField,
): SchedulingParamsEdit {
  const { schedulability } = SchedulingParamsFormSchema.parse({
    schedulability: field("schedulability") || Schedulability.SCHEDULABLE,
  });
  if (schedulability === Schedulability.NOT_SCHEDULABLE) {
    return {
      schedulability,
      eventDurationMins: null,
      eventCount: null,
    };
  }
  return {
    schedulability,
    eventDurationMins:
      nullableIntFromForm(field("schedulingEventDurationMins")) ??
      DEFAULT_SCHEDULING_EVENT_DURATION_MINS,
    eventCount:
      nullableIntFromForm(field("schedulingEventCount")) ??
      DEFAULT_SCHEDULING_EVENT_COUNT,
  };
}

export function schedulingParamsToFormFields(
  schedulingParams: SchedulingParamsEdit,
): Record<string, string> {
  return {
    schedulability: schedulingParams.schedulability,
    schedulingEventDurationMins:
      schedulingParams.eventDurationMins?.toString() ?? "",
    schedulingEventCount: schedulingParams.eventCount?.toString() ?? "",
  };
}

export function schedulingParamsPatch(
  schedulingParams: SchedulingParamsEdit,
): SchedulingParams {
  return {
    schedulability: schedulingParams.schedulability,
    event_duration_mins: schedulingParams.eventDurationMins,
    event_count: schedulingParams.eventCount,
  };
}
