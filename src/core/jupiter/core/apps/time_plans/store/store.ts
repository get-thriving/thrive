/**
 * The client-side store behind the time plan view.
 *
 * Every entity the view shows lives here once, keyed by its ref id, whichever
 * loader brought it in. Loaders "seed" their contribution under a source key,
 * edits are queued as pending mutations folded over the confirmed state, and a
 * mutation's result is merged back in when it arrives. Nothing here knows about
 * React Router or React - see ADR 0013.
 */
import type {
  BigPlan,
  BigPlanStats,
  Chore,
  ChoreStack,
  Habit,
  HabitStack,
  InboxTask,
  TimeEventInDayBlock,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TodoTask,
} from "@jupiter/webapi-client";

import { computeActivityDoneness } from "#/core/apps/time_plans/sub/activity/compute-doneness";

export type EntityTable<T> = Readonly<Record<string, T>>;

export interface TimePlanEntities {
  activities: EntityTable<TimePlanActivity>;
  inboxTasks: EntityTable<InboxTask>;
  bigPlans: EntityTable<BigPlan>;
  todoTasks: EntityTable<TodoTask>;
  habits: EntityTable<Habit>;
  habitStacks: EntityTable<HabitStack>;
  chores: EntityTable<Chore>;
  choreStacks: EntityTable<ChoreStack>;
  timeEventBlocks: EntityTable<TimeEventInDayBlock>;
  // Keyed by the big plan's ref id. Stats have no version of their own.
  bigPlanStats: EntityTable<BigPlanStats>;
}

export type TimePlanEntityKind = keyof TimePlanEntities;

type EntityOf<K extends TimePlanEntityKind> =
  TimePlanEntities[K] extends EntityTable<infer T> ? T : never;

export type TimePlanEntitySnapshot = {
  [K in TimePlanEntityKind]?: ReadonlyArray<EntityOf<K>>;
};

export interface TimePlanEntityDelta extends TimePlanEntitySnapshot {
  removed?: { [K in TimePlanEntityKind]?: ReadonlyArray<string> };
}

export interface PendingTimePlanMutation {
  id: string;
  applyOptimistic: (entities: TimePlanEntities) => TimePlanEntities;
}

export interface TimePlanStore {
  confirmed: TimePlanEntities;
  // For every entity, the sources (loaders, or mutations that created it) that
  // contributed it. An entity goes away once no source holds it any more.
  owners: Readonly<
    Record<TimePlanEntityKind, Readonly<Record<string, ReadonlyArray<string>>>>
  >;
  pending: ReadonlyArray<PendingTimePlanMutation>;
}

const ENTITY_KINDS: ReadonlyArray<TimePlanEntityKind> = [
  "activities",
  "inboxTasks",
  "bigPlans",
  "todoTasks",
  "habits",
  "habitStacks",
  "chores",
  "choreStacks",
  "timeEventBlocks",
  "bigPlanStats",
];

interface AnyEntity {
  ref_id?: string;
  big_plan_ref_id?: string;
  version?: number;
}

type AnyTables = Record<TimePlanEntityKind, EntityTable<AnyEntity>>;
type AnyOwners = TimePlanStore["owners"];

function keyOf(kind: TimePlanEntityKind, entity: AnyEntity): string {
  const key = kind === "bigPlanStats" ? entity.big_plan_ref_id : entity.ref_id;
  if (key === undefined) {
    throw new Error(`Entity of kind ${kind} has no key`);
  }
  return key;
}

function isAtLeastAsNew(
  incoming: AnyEntity,
  existing: AnyEntity | undefined,
): boolean {
  if (existing === undefined) {
    return true;
  }
  if (incoming.version === undefined || existing.version === undefined) {
    return true;
  }
  return incoming.version >= existing.version;
}

function emptyEntities(): TimePlanEntities {
  return {
    activities: {},
    inboxTasks: {},
    bigPlans: {},
    todoTasks: {},
    habits: {},
    habitStacks: {},
    chores: {},
    choreStacks: {},
    timeEventBlocks: {},
    bigPlanStats: {},
  };
}

function emptyOwners(): AnyOwners {
  return {
    activities: {},
    inboxTasks: {},
    bigPlans: {},
    todoTasks: {},
    habits: {},
    habitStacks: {},
    chores: {},
    choreStacks: {},
    timeEventBlocks: {},
    bigPlanStats: {},
  };
}

export function createTimePlanStore(): TimePlanStore {
  return { confirmed: emptyEntities(), owners: emptyOwners(), pending: [] };
}

/**
 * Replace everything ``source`` contributes with ``snapshot``.
 *
 * Kinds missing from the snapshot count as empty. Entities the source no
 * longer contributes go away unless another source still holds them. An entity
 * already held at a newer version (say, from a mutation result that raced the
 * loader) is kept.
 */
export function seedTimePlanSource(
  store: TimePlanStore,
  source: string,
  snapshot: TimePlanEntitySnapshot,
): TimePlanStore {
  const confirmed = { ...store.confirmed } as AnyTables;
  const owners = { ...store.owners } as Record<
    TimePlanEntityKind,
    Readonly<Record<string, ReadonlyArray<string>>>
  >;

  for (const kind of ENTITY_KINDS) {
    const incoming = (snapshot[kind] ?? []) as ReadonlyArray<AnyEntity>;
    const incomingKeys = new Set(incoming.map((e) => keyOf(kind, e)));
    const kindOwners = store.owners[kind];
    const previousKeys = Object.keys(kindOwners).filter((key) =>
      kindOwners[key].includes(source),
    );

    if (incoming.length === 0 && previousKeys.length === 0) {
      continue;
    }

    const table: Record<string, AnyEntity> = { ...confirmed[kind] };
    const nextOwners: Record<string, ReadonlyArray<string>> = { ...kindOwners };

    for (const key of previousKeys) {
      if (incomingKeys.has(key)) {
        continue;
      }
      const remaining = nextOwners[key].filter((owner) => owner !== source);
      if (remaining.length === 0) {
        delete nextOwners[key];
        delete table[key];
      } else {
        nextOwners[key] = remaining;
      }
    }

    for (const entity of incoming) {
      const key = keyOf(kind, entity);
      if (isAtLeastAsNew(entity, table[key])) {
        table[key] = entity;
      }
      const current = nextOwners[key] ?? [];
      if (!current.includes(source)) {
        nextOwners[key] = [...current, source];
      }
    }

    confirmed[kind] = table;
    owners[kind] = nextOwners;
  }

  return {
    confirmed: confirmed as unknown as TimePlanEntities,
    owners,
    pending: store.pending,
  };
}

export type TimePlanStoreSources = Readonly<
  Record<string, TimePlanEntitySnapshot | undefined>
>;

/**
 * Move ``store`` from the ``previous`` sources to the ``next`` ones.
 *
 * Only sources whose snapshot changed are reseeded, and sources that went away
 * are dropped - so passing the same snapshots again leaves the store as is.
 */
export function syncTimePlanSources(
  store: TimePlanStore,
  previous: TimePlanStoreSources,
  next: TimePlanStoreSources,
): TimePlanStore {
  let result = store;
  const names = new Set([...Object.keys(previous), ...Object.keys(next)]);
  for (const name of names) {
    const snapshot = next[name];
    if (snapshot === previous[name]) {
      continue;
    }
    result =
      snapshot === undefined
        ? dropTimePlanSource(result, name)
        : seedTimePlanSource(result, name, snapshot);
  }
  return result;
}

/** Forget everything ``source`` contributed (e.g. the leaf panel closed). */
export function dropTimePlanSource(
  store: TimePlanStore,
  source: string,
): TimePlanStore {
  return seedTimePlanSource(store, source, {});
}

export function enqueueTimePlanMutation(
  store: TimePlanStore,
  mutation: PendingTimePlanMutation,
): TimePlanStore {
  return { ...store, pending: [...store.pending, mutation] };
}

/**
 * A mutation finished: stop applying it optimistically and merge what the
 * server sent back.
 *
 * Entities the store doesn't hold yet (e.g. a newly created time event) are
 * attributed to ``source``, so they go away with it.
 */
export function resolveTimePlanMutation(
  store: TimePlanStore,
  mutationId: string,
  delta: TimePlanEntityDelta,
  source: string,
): TimePlanStore {
  const confirmed = { ...store.confirmed } as AnyTables;
  const owners = { ...store.owners } as Record<
    TimePlanEntityKind,
    Readonly<Record<string, ReadonlyArray<string>>>
  >;

  for (const kind of ENTITY_KINDS) {
    const incoming = (delta[kind] ?? []) as ReadonlyArray<AnyEntity>;
    const removed = delta.removed?.[kind] ?? [];
    if (incoming.length === 0 && removed.length === 0) {
      continue;
    }

    const table: Record<string, AnyEntity> = { ...confirmed[kind] };
    const nextOwners: Record<string, ReadonlyArray<string>> = {
      ...owners[kind],
    };

    for (const entity of incoming) {
      const key = keyOf(kind, entity);
      if (isAtLeastAsNew(entity, table[key])) {
        table[key] = entity;
      }
      if (nextOwners[key] === undefined) {
        nextOwners[key] = [source];
      }
    }

    for (const key of removed) {
      delete table[key];
      delete nextOwners[key];
    }

    confirmed[kind] = table;
    owners[kind] = nextOwners;
  }

  return {
    confirmed: confirmed as unknown as TimePlanEntities,
    owners,
    pending: store.pending.filter((mutation) => mutation.id !== mutationId),
  };
}

/** A mutation failed: drop it, which rolls back its optimistic changes. */
export function rejectTimePlanMutation(
  store: TimePlanStore,
  mutationId: string,
): TimePlanStore {
  return {
    ...store,
    pending: store.pending.filter((mutation) => mutation.id !== mutationId),
  };
}

/** What the view renders: the pending mutations applied over the confirmed state. */
export function selectTimePlanEntities(store: TimePlanStore): TimePlanEntities {
  return store.pending.reduce(
    (entities, mutation) => mutation.applyOptimistic(entities),
    store.confirmed,
  );
}

/** Doneness for the activities of ``timePlan``, derived from the entities. */
export function selectActivityDoneness(
  entities: TimePlanEntities,
  timePlan: Pick<TimePlan, "ref_id" | "start_date" | "end_date">,
): Record<string, TimePlanActivityDoneness> {
  return computeActivityDoneness({
    timePlan,
    activities: Object.values(entities.activities).filter(
      (activity) =>
        activity.time_plan_ref_id === timePlan.ref_id && !activity.archived,
    ),
    inboxTasks: Object.values(entities.inboxTasks),
    bigPlans: Object.values(entities.bigPlans),
    habits: Object.values(entities.habits),
    habitStacks: Object.values(entities.habitStacks),
    chores: Object.values(entities.chores),
    choreStacks: Object.values(entities.choreStacks),
  });
}
