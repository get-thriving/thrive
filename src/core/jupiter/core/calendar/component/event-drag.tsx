import {
  ADate,
  EntityId,
  NamedEntityTag,
  ScheduleInDayEventEntry,
  TimeInDay,
  Timezone,
} from "@jupiter/webapi-client";
import { Box, Paper, Portal, Typography, useTheme } from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { DateTime } from "luxon";
import { useSnackbar } from "notistack";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ActionResult } from "#/core/infra/action-result";
import {
  CombinedTimeEventInDayEntry,
  calendarTimeEventInDayDurationToRems,
  calendarTimeEventInDayStartMinutesToRems,
  isTimeEventInDayBlockEditable,
  TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
  timeEventInDayBlockOwnerTheType,
} from "#/core/common/sub/time_events/time-event";
import { isCorePropertyEditable } from "#/core/apps/schedule/sub/event_in_day/root";
import { scheduleStreamColorHex } from "#/core/apps/schedule/sub/stream/color";

// Where a dropped event goes to be saved.
export const CALENDAR_RESCHEDULE_ACTION = "/app/workspace/calendar/reschedule";
// Where dropping an activity from the time plan list onto the calendar goes
// to make a time event of it.
export const CALENDAR_PLACE_ACTIVITY_ACTION =
  "/app/workspace/apps/time-plans/place-activity-time-event";
// How long a newly placed activity event lasts, matching the add-event form.
export const PLACE_ACTIVITY_DURATION_MINS = 60;

// How long you need to keep holding an event before it comes loose and starts
// following the pointer around.
const DRAG_HOLD_MS = 400;
// How far the pointer may wander during the hold before we call the gesture a
// scroll or a text selection and leave the event where it is.
const HOLD_TOLERANCE_PX = 8;
// The calendar grid gives one rem of height to every 15 minutes of the day.
const MINUTES_PER_REM = 15;
// The latest an event may be dropped at, so that it still starts in the day
// it was dropped on.
const LAST_START_MINUTE_OF_DAY = 24 * 60 - MINUTES_PER_REM;
// How close to the edge of the scroller the pointer must get before the
// calendar starts scrolling along with the drag, and how fast it can go.
const AUTO_SCROLL_BAND_PX = 60;
const AUTO_SCROLL_MAX_PX_PER_FRAME = 16;
// How long a click is swallowed after a drag, so that dropping an event
// doesn't also open it.
const CLICK_SUPPRESSION_MS = 400;
// Where the time label sits relative to the pointer.
const DRAG_LABEL_OFFSET_PX = 18;
const DRAG_LABEL_WIDTH_PX = 220;

export type CalendarEventDragKind =
  | "schedule-event-in-day"
  | "time-event-in-day-block";

export interface CalendarEventDragTarget {
  // What the server needs to know to move the event.
  kind: CalendarEventDragKind;
  refId: EntityId;
  // The time event block backing the event, in the user's timezone. For an
  // event spilling past midnight this is the block as a whole, not just the
  // piece showing up in one day's column.
  blockRefId: EntityId;
  startDate: ADate;
  startTimeInDay: TimeInDay;
  durationMins: number;
}

export interface CalendarPlaceActivitySource {
  activityRefId: EntityId;
  timePlanRefId: EntityId;
  durationMins: number;
}

function placeBlockRefId(activityRefId: EntityId): EntityId {
  return `place:${activityRefId}`;
}

// Works out what a drag of this entry would move, or nothing at all when the
// event isn't the user's to move around: events coming from an external
// calendar, and the leftover pieces of an event spilling past midnight, which
// don't carry the event's real start.
export function calendarEventDragTargetForEntry(
  entry: CombinedTimeEventInDayEntry,
): CalendarEventDragTarget | undefined {
  if (entry.split_from?.is_continuation) {
    return undefined;
  }

  const block =
    entry.split_from?.whole_time_event_in_tz ?? entry.time_event_in_tz;

  switch (timeEventInDayBlockOwnerTheType(entry.time_event_in_tz)) {
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY: {
      const scheduleEntry = entry.entry as ScheduleInDayEventEntry;
      if (!isCorePropertyEditable(scheduleEntry.event)) {
        return undefined;
      }

      return {
        kind: "schedule-event-in-day",
        refId: scheduleEntry.event.ref_id,
        blockRefId: block.ref_id,
        startDate: block.start_date,
        startTimeInDay: block.start_time_in_day,
        durationMins: block.duration_mins,
      };
    }

    default: {
      if (!isTimeEventInDayBlockEditable(entry.time_event_in_tz.owner)) {
        return undefined;
      }

      return {
        kind: "time-event-in-day-block",
        refId: block.ref_id,
        blockRefId: block.ref_id,
        startDate: block.start_date,
        startTimeInDay: block.start_time_in_day,
        durationMins: block.duration_mins,
      };
    }
  }
}

export type CalendarEventDragPhase = "idle" | "holding" | "moving";

export interface CalendarEventDragStatus {
  phase: CalendarEventDragPhase;
  dxPx: number;
  dyPx: number;
}

const IDLE_STATUS: CalendarEventDragStatus = {
  phase: "idle",
  dxPx: 0,
  dyPx: 0,
};

interface CalendarEventDragSnapshot extends CalendarEventDragStatus {
  blockRefId: EntityId;
  dayDelta: number;
  minutesDelta: number;
  pointerX: number;
  pointerY: number;
  newStartTime: DateTime;
  durationMins: number;
  // Moving an event already on the calendar, or placing an activity onto it.
  mode: "reschedule" | "place";
  // For a place, whether the pointer is over a day column. Dropping off the
  // grid does nothing.
  overCalendar: boolean;
}

interface CalendarEventDragPress {
  pointerId: number;
  mode: "reschedule" | "place";
  target: CalendarEventDragTarget | null;
  place: CalendarPlaceActivitySource | null;
  // The day column the gesture started in - which is the day of the piece
  // being dragged, not necessarily the day the event starts in. Unused when
  // placing an activity, which has no column of its own yet.
  sourceDate: ADate;
  startX: number;
  startY: number;
  startScrollTop: number;
  remPx: number;
  scroller: HTMLElement | null;
  armed: boolean;
}

interface CalendarPendingReschedule {
  blockRefId: EntityId;
  startDate: ADate;
  startTimeInDay: TimeInDay;
}

interface CalendarPendingPlace {
  startDate: ADate;
  startTimeInDay: TimeInDay;
  durationMins: number;
}

interface CalendarEventDragBeginArgs {
  target: CalendarEventDragTarget;
  sourceDate: ADate;
}

export interface CalendarEventDragController {
  beginPress(
    event: React.PointerEvent<HTMLElement>,
    args: CalendarEventDragBeginArgs,
  ): void;
  beginPlacePress(
    event: React.PointerEvent<HTMLElement>,
    source: CalendarPlaceActivitySource,
  ): void;
  consumeClickSuppression(blockRefId: EntityId): boolean;
  isPressing(): boolean;
  registerDayColumn(date: ADate, element: HTMLElement): () => void;
  statusFor(blockRefId: EntityId): CalendarEventDragStatus;
  snapshot(): CalendarEventDragSnapshot | null;
  subscribe(listener: () => void): () => void;
}

interface CalendarEventDragContextValue {
  controller: CalendarEventDragController;
  // The move waiting on the server, shown in place while it's in flight.
  pending: CalendarPendingReschedule | null;
  // An activity just dropped on the calendar, shown where it will land until
  // the new event comes back.
  pendingPlace: CalendarPendingPlace | null;
}

const CalendarEventDragContext =
  createContext<CalendarEventDragContextValue | null>(null);

function minutesSinceStartOfDay(timeInDay: TimeInDay): number {
  const [hours, minutes] = timeInDay.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

function daysBetweenDates(from: ADate, to: ADate): number {
  const fromDate = DateTime.fromISO(`${from}T00:00:00`, { zone: "UTC" });
  const toDate = DateTime.fromISO(`${to}T00:00:00`, { zone: "UTC" });
  return Math.round(toDate.diff(fromDate, "days").days);
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function sameStatus(
  left: CalendarEventDragStatus,
  right: CalendarEventDragStatus,
): boolean {
  return (
    left.phase === right.phase &&
    left.dxPx === right.dxPx &&
    left.dyPx === right.dyPx
  );
}

function findScroller(element: HTMLElement): HTMLElement | null {
  let candidate: HTMLElement | null = element.parentElement;
  while (candidate !== null) {
    const overflowY = window.getComputedStyle(candidate).overflowY;
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      candidate.scrollHeight > candidate.clientHeight
    ) {
      return candidate;
    }
    candidate = candidate.parentElement;
  }
  return null;
}

function rootFontSizePx(): number {
  const fontSize = window.getComputedStyle(document.documentElement).fontSize;
  return parseFloat(fontSize) || 16;
}

interface CalendarEventDragProviderProps {
  timezone: Timezone;
}

// Makes the events below draggable. Without it - the published calendar, say -
// the events stay put, since there's nothing there to move them to.
export function CalendarEventDragProvider(
  props: PropsWithChildren<CalendarEventDragProviderProps>,
) {
  const fetcher = useFetcher<ActionResult<never>>();
  const { enqueueSnackbar } = useSnackbar();

  const timezoneRef = useRef(props.timezone);
  const submitRef = useRef(fetcher.submit);
  useEffect(() => {
    timezoneRef.current = props.timezone;
    submitRef.current = fetcher.submit;
  }, [props.timezone, fetcher.submit]);

  const columnsRef = useRef(new Map<ADate, HTMLElement>());
  const listenersRef = useRef(new Set<() => void>());
  const snapshotRef = useRef<CalendarEventDragSnapshot | null>(null);
  const pressRef = useRef<CalendarEventDragPress | null>(null);
  const unlistenRef = useRef<(() => void) | null>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoScrollFrameRef = useRef<number | null>(null);
  const suppressClickRef = useRef<{
    blockRefId: EntityId;
    until: number;
  } | null>(null);

  const controller = useMemo<CalendarEventDragController>(() => {
    function publish(next: CalendarEventDragSnapshot | null) {
      snapshotRef.current = next;
      for (const listener of listenersRef.current) {
        listener();
      }
    }

    function stopAutoScroll() {
      if (autoScrollFrameRef.current !== null) {
        cancelAnimationFrame(autoScrollFrameRef.current);
        autoScrollFrameRef.current = null;
      }
    }

    function releasePress() {
      if (holdTimeoutRef.current !== null) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
      stopAutoScroll();
      if (unlistenRef.current !== null) {
        unlistenRef.current();
        unlistenRef.current = null;
      }
      if (pressRef.current?.armed) {
        document.body.style.userSelect = "";
      }
      pressRef.current = null;
    }

    function suppressionBlockRefId(press: CalendarEventDragPress): EntityId {
      if (press.target !== null) {
        return press.target.blockRefId;
      }
      if (press.place !== null) {
        return placeBlockRefId(press.place.activityRefId);
      }
      return "";
    }

    function abandonPress() {
      // An event that came loose and then went back where it was shouldn't
      // open on the click coming after the gesture either.
      if (pressRef.current?.armed) {
        suppressClickRef.current = {
          blockRefId: suppressionBlockRefId(pressRef.current),
          until: Date.now() + CLICK_SUPPRESSION_MS,
        };
      }
      releasePress();
      publish(null);
    }

    // Which column the pointer is over, and how far that is from the one the
    // drag started in. Wandering off the grid entirely - over the hours on the
    // left, say - keeps the event in its own column.
    function resolveColumn(
      press: CalendarEventDragPress,
      pointerX: number,
    ): { dayDelta: number; dxPx: number } {
      const sourceColumn = columnsRef.current.get(press.sourceDate);
      if (sourceColumn === undefined) {
        return { dayDelta: 0, dxPx: 0 };
      }
      const sourceLeft = sourceColumn.getBoundingClientRect().left;

      for (const [date, element] of columnsRef.current) {
        const rect = element.getBoundingClientRect();
        if (pointerX >= rect.left && pointerX < rect.right) {
          return {
            dayDelta: daysBetweenDates(press.sourceDate, date),
            dxPx: rect.left - sourceLeft,
          };
        }
      }

      return { dayDelta: 0, dxPx: 0 };
    }

    function computeSnapshot(
      press: CalendarEventDragPress,
      pointerX: number,
      pointerY: number,
    ): CalendarEventDragSnapshot {
      if (press.mode === "place" && press.place !== null) {
        return computePlaceSnapshot(press, press.place, pointerX, pointerY);
      }

      const target = press.target;
      if (target === null) {
        return computePlaceSnapshot(
          press,
          {
            activityRefId: "",
            timePlanRefId: "",
            durationMins: PLACE_ACTIVITY_DURATION_MINS,
          },
          pointerX,
          pointerY,
        );
      }

      const scrollTop = press.scroller?.scrollTop ?? 0;
      const contentDy =
        pointerY - press.startY + (scrollTop - press.startScrollTop);

      const startMinutes = minutesSinceStartOfDay(target.startTimeInDay);
      const minutesDelta = clamp(
        Math.round(contentDy / press.remPx) * MINUTES_PER_REM,
        -startMinutes,
        LAST_START_MINUTE_OF_DAY - startMinutes,
      );

      const { dayDelta, dxPx } = resolveColumn(press, pointerX);

      const startTime = DateTime.fromISO(
        `${target.startDate}T${target.startTimeInDay}`,
        { zone: "UTC" },
      );

      return {
        phase: dayDelta === 0 && minutesDelta === 0 ? "holding" : "moving",
        blockRefId: target.blockRefId,
        dxPx: dxPx,
        dyPx: (minutesDelta / MINUTES_PER_REM) * press.remPx,
        dayDelta: dayDelta,
        minutesDelta: minutesDelta,
        pointerX: pointerX,
        pointerY: pointerY,
        newStartTime: startTime.plus({
          days: dayDelta,
          minutes: minutesDelta,
        }),
        durationMins: target.durationMins,
        mode: "reschedule",
        overCalendar: true,
      };
    }

    function computePlaceSnapshot(
      press: CalendarEventDragPress,
      place: CalendarPlaceActivitySource,
      pointerX: number,
      pointerY: number,
    ): CalendarEventDragSnapshot {
      const hit = hitTestColumn(pointerX);
      const durationMins = place.durationMins;
      const blockRefId = placeBlockRefId(place.activityRefId);

      if (hit === undefined) {
        return {
          phase: "holding",
          blockRefId: blockRefId,
          dxPx: 0,
          dyPx: 0,
          dayDelta: 0,
          minutesDelta: 0,
          pointerX: pointerX,
          pointerY: pointerY,
          newStartTime: DateTime.fromISO("1987-09-18T00:00:00", {
            zone: "UTC",
          }),
          durationMins: durationMins,
          mode: "place",
          overCalendar: false,
        };
      }

      const minutes = clamp(
        Math.round((pointerY - hit.rect.top) / press.remPx) * MINUTES_PER_REM,
        0,
        LAST_START_MINUTE_OF_DAY,
      );
      const newStartTime = DateTime.fromISO(`${hit.date}T00:00:00`, {
        zone: "UTC",
      }).plus({ minutes: minutes });

      return {
        phase: "moving",
        blockRefId: blockRefId,
        dxPx: 0,
        dyPx: 0,
        dayDelta: 0,
        minutesDelta: minutes,
        pointerX: pointerX,
        pointerY: pointerY,
        newStartTime: newStartTime,
        durationMins: durationMins,
        mode: "place",
        overCalendar: true,
      };
    }

    function hitTestColumn(
      pointerX: number,
    ): { date: ADate; rect: DOMRect } | undefined {
      for (const [date, element] of columnsRef.current) {
        const rect = element.getBoundingClientRect();
        if (pointerX >= rect.left && pointerX < rect.right) {
          return { date: date, rect: rect };
        }
      }
      return undefined;
    }

    function trackPointer(pointerX: number, pointerY: number) {
      const press = pressRef.current;
      if (press === null) {
        return;
      }
      publish(computeSnapshot(press, pointerX, pointerY));
    }

    // Keeps the calendar scrolling while the pointer rests against the top or
    // the bottom of the scroller, so an event can be dragged to a part of the
    // day that isn't on screen yet.
    function runAutoScroll() {
      autoScrollFrameRef.current = requestAnimationFrame(() => {
        autoScrollFrameRef.current = null;

        const press = pressRef.current;
        const snapshot = snapshotRef.current;
        if (press === null || !press.armed || snapshot === null) {
          return;
        }

        const scroller = press.scroller;
        if (scroller !== null) {
          const rect = scroller.getBoundingClientRect();
          const fromTop = snapshot.pointerY - rect.top;
          const fromBottom = rect.bottom - snapshot.pointerY;

          let scrollBy = 0;
          if (fromTop < AUTO_SCROLL_BAND_PX) {
            scrollBy = -Math.ceil(
              ((AUTO_SCROLL_BAND_PX - Math.max(0, fromTop)) /
                AUTO_SCROLL_BAND_PX) *
                AUTO_SCROLL_MAX_PX_PER_FRAME,
            );
          } else if (fromBottom < AUTO_SCROLL_BAND_PX) {
            scrollBy = Math.ceil(
              ((AUTO_SCROLL_BAND_PX - Math.max(0, fromBottom)) /
                AUTO_SCROLL_BAND_PX) *
                AUTO_SCROLL_MAX_PX_PER_FRAME,
            );
          }

          if (scrollBy !== 0) {
            const before = scroller.scrollTop;
            scroller.scrollTop = before + scrollBy;
            if (scroller.scrollTop !== before) {
              trackPointer(snapshot.pointerX, snapshot.pointerY);
            }
          }
        }

        runAutoScroll();
      });
    }

    function commit() {
      const press = pressRef.current;
      const snapshot = snapshotRef.current;
      if (press === null || snapshot === null) {
        abandonPress();
        return;
      }

      const suppressionId = suppressionBlockRefId(press);
      const place = press.place;
      const target = press.target;
      releasePress();
      suppressClickRef.current = {
        blockRefId: suppressionId,
        until: Date.now() + CLICK_SUPPRESSION_MS,
      };
      publish(null);

      if (press.mode === "place") {
        if (place === null || !snapshot.overCalendar) {
          return;
        }

        submitRef.current(
          {
            timePlanActivityRefId: place.activityRefId,
            startDate: snapshot.newStartTime.toFormat("yyyy-MM-dd"),
            startTimeInDay: snapshot.newStartTime.toFormat("HH:mm"),
            durationMins: String(place.durationMins),
            userTimezone: timezoneRef.current,
          },
          { method: "post", action: CALENDAR_PLACE_ACTIVITY_ACTION },
        );
        return;
      }

      if (target === null) {
        return;
      }

      if (snapshot.dayDelta === 0 && snapshot.minutesDelta === 0) {
        return;
      }

      submitRef.current(
        {
          kind: target.kind,
          refId: target.refId,
          blockRefId: target.blockRefId,
          startDate: snapshot.newStartTime.toFormat("yyyy-MM-dd"),
          startTimeInDay: snapshot.newStartTime.toFormat("HH:mm"),
          userTimezone: timezoneRef.current,
        },
        { method: "post", action: CALENDAR_RESCHEDULE_ACTION },
      );
    }

    function attachGesture(event: React.PointerEvent<HTMLElement>) {
      function handlePointerMove(moveEvent: PointerEvent) {
        const press = pressRef.current;
        if (press === null || moveEvent.pointerId !== press.pointerId) {
          return;
        }

        if (!press.armed) {
          const distance = Math.hypot(
            moveEvent.clientX - press.startX,
            moveEvent.clientY - press.startY,
          );
          if (distance > HOLD_TOLERANCE_PX) {
            // The gesture turned out to be a scroll or a text selection.
            abandonPress();
          }
          return;
        }

        trackPointer(moveEvent.clientX, moveEvent.clientY);
      }

      function handlePointerUp(upEvent: PointerEvent) {
        const press = pressRef.current;
        if (press === null || upEvent.pointerId !== press.pointerId) {
          return;
        }

        if (press.armed) {
          commit();
        } else {
          abandonPress();
        }
      }

      function handlePointerCancel(cancelEvent: PointerEvent) {
        const press = pressRef.current;
        if (press === null || cancelEvent.pointerId !== press.pointerId) {
          return;
        }
        abandonPress();
      }

      function handleKeyDown(keyEvent: KeyboardEvent) {
        if (keyEvent.key === "Escape") {
          abandonPress();
        }
      }

      // Once the event is loose, a finger moving over it drags it rather
      // than scrolling the calendar underneath it.
      function handleTouchMove(touchEvent: TouchEvent) {
        if (pressRef.current?.armed) {
          touchEvent.preventDefault();
        }
      }

      function handleContextMenu(menuEvent: MouseEvent) {
        if (pressRef.current !== null) {
          menuEvent.preventDefault();
        }
      }

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerCancel);
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      window.addEventListener("contextmenu", handleContextMenu);

      unlistenRef.current = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerCancel);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("contextmenu", handleContextMenu);
      };

      const startX = event.clientX;
      const startY = event.clientY;
      holdTimeoutRef.current = setTimeout(() => {
        holdTimeoutRef.current = null;
        const press = pressRef.current;
        if (press === null) {
          return;
        }

        press.armed = true;
        document.body.style.userSelect = "none";
        if (typeof navigator.vibrate === "function") {
          navigator.vibrate(10);
        }
        trackPointer(startX, startY);
        runAutoScroll();
      }, DRAG_HOLD_MS);
    }

    return {
      beginPress(event, args) {
        if (pressRef.current !== null) {
          return;
        }
        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        const element = event.currentTarget;
        const scroller = findScroller(element);

        pressRef.current = {
          pointerId: event.pointerId,
          mode: "reschedule",
          target: args.target,
          place: null,
          sourceDate: args.sourceDate,
          startX: event.clientX,
          startY: event.clientY,
          startScrollTop: scroller?.scrollTop ?? 0,
          remPx: rootFontSizePx(),
          scroller: scroller,
          armed: false,
        };

        attachGesture(event);
      },

      beginPlacePress(event, source) {
        if (pressRef.current !== null) {
          return;
        }
        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        const firstColumn = [...columnsRef.current.values()][0];
        const scroller =
          firstColumn !== undefined
            ? findScroller(firstColumn)
            : findScroller(event.currentTarget);
        const sourceDate =
          [...columnsRef.current.keys()][0] ?? ("1970-01-01" as ADate);

        pressRef.current = {
          pointerId: event.pointerId,
          mode: "place",
          target: null,
          place: source,
          sourceDate: sourceDate,
          startX: event.clientX,
          startY: event.clientY,
          startScrollTop: scroller?.scrollTop ?? 0,
          remPx: rootFontSizePx(),
          scroller: scroller,
          armed: false,
        };

        attachGesture(event);
      },

      consumeClickSuppression(blockRefId) {
        const suppression = suppressClickRef.current;
        if (suppression === null) {
          return false;
        }
        if (
          suppression.blockRefId !== blockRefId ||
          suppression.until < Date.now()
        ) {
          return false;
        }
        suppressClickRef.current = null;
        return true;
      },

      isPressing() {
        return pressRef.current !== null;
      },

      registerDayColumn(date, element) {
        columnsRef.current.set(date, element);
        return () => {
          if (columnsRef.current.get(date) === element) {
            columnsRef.current.delete(date);
          }
        };
      },

      statusFor(blockRefId) {
        const snapshot = snapshotRef.current;
        if (snapshot === null || snapshot.blockRefId !== blockRefId) {
          return IDLE_STATUS;
        }
        return {
          phase: snapshot.phase,
          dxPx: snapshot.dxPx,
          dyPx: snapshot.dyPx,
        };
      },

      snapshot() {
        return snapshotRef.current;
      },

      subscribe(listener) {
        listenersRef.current.add(listener);
        return () => {
          listenersRef.current.delete(listener);
        };
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current !== null) {
        clearTimeout(holdTimeoutRef.current);
      }
      if (autoScrollFrameRef.current !== null) {
        cancelAnimationFrame(autoScrollFrameRef.current);
      }
      if (unlistenRef.current !== null) {
        unlistenRef.current();
      }
      document.body.style.userSelect = "";
    };
  }, []);

  const pendingPlace = useMemo<CalendarPendingPlace | null>(() => {
    const formData = fetcher.formData;
    if (formData === undefined) {
      return null;
    }

    const timePlanActivityRefId = formData.get("timePlanActivityRefId");
    const startDate = formData.get("startDate");
    const startTimeInDay = formData.get("startTimeInDay");
    const durationMins = formData.get("durationMins");
    if (
      typeof timePlanActivityRefId !== "string" ||
      typeof startDate !== "string" ||
      typeof startTimeInDay !== "string" ||
      typeof durationMins !== "string"
    ) {
      return null;
    }

    const duration = parseInt(durationMins, 10);
    if (Number.isNaN(duration)) {
      return null;
    }

    return {
      startDate: startDate,
      startTimeInDay: startTimeInDay,
      durationMins: duration,
    };
  }, [fetcher.formData]);

  const pending = useMemo<CalendarPendingReschedule | null>(() => {
    const formData = fetcher.formData;
    if (formData === undefined) {
      return null;
    }

    const blockRefId = formData.get("blockRefId");
    const startDate = formData.get("startDate");
    const startTimeInDay = formData.get("startTimeInDay");
    if (
      typeof blockRefId !== "string" ||
      typeof startDate !== "string" ||
      typeof startTimeInDay !== "string"
    ) {
      return null;
    }

    return {
      blockRefId: blockRefId,
      startDate: startDate,
      startTimeInDay: startTimeInDay,
    };
  }, [fetcher.formData]);

  useEffect(() => {
    const result = fetcher.data;
    if (result === undefined || result.theType !== "some-error-no-data") {
      return;
    }

    enqueueSnackbar(
      result.globalError ?? "Could not save that! Please try again!",
      { variant: "error", autoHideDuration: 4000 },
    );
  }, [fetcher.data, enqueueSnackbar]);

  const contextValue = useMemo<CalendarEventDragContextValue>(
    () => ({
      controller: controller,
      pending: pending,
      pendingPlace: pendingPlace,
    }),
    [controller, pending, pendingPlace],
  );

  return (
    <CalendarEventDragContext.Provider value={contextValue}>
      {props.children}
      <CalendarEventDragLabel controller={controller} />
    </CalendarEventDragContext.Provider>
  );
}

// Applies the move that's still in flight to the events, so a dropped event
// stays where it was dropped until the server catches up.
export function useCalendarPendingReschedule(): (
  entries: Array<CombinedTimeEventInDayEntry>,
) => Array<CombinedTimeEventInDayEntry> {
  const pending = useContext(CalendarEventDragContext)?.pending ?? null;

  return useCallback(
    (entries) => {
      if (pending === null) {
        return entries;
      }

      return entries.map((entry) => {
        if (entry.time_event_in_tz.ref_id !== pending.blockRefId) {
          return entry;
        }

        return {
          ...entry,
          time_event_in_tz: {
            ...entry.time_event_in_tz,
            start_date: pending.startDate,
            start_time_in_day: pending.startTimeInDay,
          },
        };
      });
    },
    [pending],
  );
}

// Ties a day's column to its date, so a drag can tell which day the pointer
// has wandered into.
export function useCalendarDayColumn(
  date: ADate,
  elementRef: React.RefObject<HTMLElement>,
) {
  const controller = useContext(CalendarEventDragContext)?.controller ?? null;

  useEffect(() => {
    if (controller === null || elementRef.current === null) {
      return;
    }
    return controller.registerDayColumn(date, elementRef.current);
  }, [controller, date, elementRef]);
}

function useCalendarEventDragStatus(
  controller: CalendarEventDragController | null,
  blockRefId: EntityId,
): CalendarEventDragStatus {
  const [status, setStatus] = useState<CalendarEventDragStatus>(IDLE_STATUS);

  useEffect(() => {
    const activeController = controller;
    if (activeController === null) {
      return;
    }

    // Every event listens in, so each one only re-renders when its own drag
    // status changes and the rest of the calendar sits still.
    const sync = () => {
      setStatus((previous) => {
        const next = activeController.statusFor(blockRefId);
        return sameStatus(previous, next) ? previous : next;
      });
    };

    sync();
    return activeController.subscribe(sync);
  }, [controller, blockRefId]);

  return status;
}

export interface CalendarEventDragBinding {
  isDragging: boolean;
  // Whether the event is being held right now, drag or no drag yet. A press
  // in progress swallows the gestures that would otherwise ride along with
  // it, like the context menu a long press raises on a phone.
  isPressing: () => boolean;
  handleProps: {
    onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void;
    onClickCapture?: (event: React.MouseEvent<HTMLElement>) => void;
    style?: React.CSSProperties;
  };
}

// Makes one event on the calendar draggable: hold it for a moment and it comes
// loose and follows the pointer, dropping onto whatever quarter hour it lands.
export function useCalendarEventDrag(
  entry: CombinedTimeEventInDayEntry,
): CalendarEventDragBinding {
  const theme = useTheme();
  const controller = useContext(CalendarEventDragContext)?.controller ?? null;

  const blockRefId = entry.time_event_in_tz.ref_id;
  const sourceDate = entry.time_event_in_tz.start_date;
  const target = useMemo(() => calendarEventDragTargetForEntry(entry), [entry]);
  const status = useCalendarEventDragStatus(controller, blockRefId);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (controller === null || target === undefined) {
        return;
      }
      controller.beginPress(event, {
        target: target,
        sourceDate: sourceDate,
      });
    },
    [controller, target, sourceDate],
  );

  const onClickCapture = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (controller === null) {
        return;
      }
      // Letting go of an event just moved it - it shouldn't also open it.
      if (controller.consumeClickSuppression(blockRefId)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [controller, blockRefId],
  );

  const isPressing = useCallback(
    () => controller !== null && controller.isPressing(),
    [controller],
  );

  if (controller === null || target === undefined) {
    return { isDragging: false, isPressing: isPressing, handleProps: {} };
  }

  return {
    isDragging: status.phase !== "idle",
    isPressing: isPressing,
    handleProps: {
      onPointerDown: onPointerDown,
      onClickCapture: onClickCapture,
      style:
        status.phase === "idle"
          ? undefined
          : {
              transform: `translate3d(${status.dxPx}px, ${status.dyPx}px, 0) scale(1.02)`,
              zIndex: theme.zIndex.modal,
              boxShadow: theme.shadows[12],
              opacity: 0.9,
              cursor: "grabbing",
              transition: "none",
            },
    },
  };
}

interface CalendarEventDragLabelProps {
  controller: CalendarEventDragController;
}

// The time the event would land on, following the pointer about.
function CalendarEventDragLabel(props: CalendarEventDragLabelProps) {
  const theme = useTheme();
  const [snapshot, setSnapshot] = useState<CalendarEventDragSnapshot | null>(
    null,
  );

  useEffect(() => {
    function sync() {
      setSnapshot(props.controller.snapshot());
    }

    sync();
    return props.controller.subscribe(sync);
  }, [props.controller]);

  if (snapshot === null) {
    return null;
  }

  const overCalendar = snapshot.overCalendar;
  const startTime = snapshot.newStartTime;
  const endTime = startTime.plus({ minutes: snapshot.durationMins });

  const left = Math.min(
    snapshot.pointerX + DRAG_LABEL_OFFSET_PX,
    Math.max(0, window.innerWidth - DRAG_LABEL_WIDTH_PX),
  );

  // Out of the calendar and onto the page itself, since the panels the
  // calendar lives in are animated, and an animated ancestor is what a fixed
  // position would otherwise be measured against.
  return (
    <Portal>
      <Box
        sx={{
          position: "fixed",
          top: `${snapshot.pointerY + DRAG_LABEL_OFFSET_PX}px`,
          left: `${left}px`,
          zIndex: theme.zIndex.tooltip,
          pointerEvents: "none",
        }}
      >
        <Paper elevation={6} sx={{ padding: "0.25rem 0.5rem" }}>
          <Typography variant="caption">
            {snapshot.mode === "place" && !overCalendar
              ? "Drop on the calendar"
              : `${startTime.toFormat("ccc dd MMM")} [${startTime.toFormat("HH:mm")} - ${endTime.toFormat("HH:mm")}]`}
          </Typography>
        </Paper>
      </Box>
    </Portal>
  );
}

// Makes an activity in the time plan list placeable on the calendar: hold it
// for a moment and drag it onto a day, and a time event is made of it there.
export function useCalendarPlaceActivity(args: {
  activityRefId: EntityId;
  timePlanRefId: EntityId;
  archived: boolean;
}): CalendarEventDragBinding {
  const theme = useTheme();
  const controller = useContext(CalendarEventDragContext)?.controller ?? null;
  const blockRefId = placeBlockRefId(args.activityRefId);
  const status = useCalendarEventDragStatus(controller, blockRefId);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (controller === null || args.archived) {
        return;
      }
      controller.beginPlacePress(event, {
        activityRefId: args.activityRefId,
        timePlanRefId: args.timePlanRefId,
        durationMins: PLACE_ACTIVITY_DURATION_MINS,
      });
    },
    [controller, args.archived, args.activityRefId, args.timePlanRefId],
  );

  const onClickCapture = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (controller === null) {
        return;
      }
      if (controller.consumeClickSuppression(blockRefId)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [controller, blockRefId],
  );

  const isPressing = useCallback(
    () => controller !== null && controller.isPressing(),
    [controller],
  );

  if (controller === null || args.archived) {
    return { isDragging: false, isPressing: isPressing, handleProps: {} };
  }

  return {
    isDragging: status.phase !== "idle",
    isPressing: isPressing,
    handleProps: {
      onPointerDown: onPointerDown,
      onClickCapture: onClickCapture,
      style:
        status.phase === "idle"
          ? { cursor: "grab" }
          : {
              opacity: 0.45,
              cursor: "grabbing",
              boxShadow: theme.shadows[8],
            },
    },
  };
}

interface CalendarPlaceGhostProps {
  date: ADate;
  deltaHour: number;
}

// The slot an activity would land in while it's being dragged over this day,
// and the same slot while the new event is still on its way back from the
// server.
export function CalendarPlaceGhost(props: CalendarPlaceGhostProps) {
  const context = useContext(CalendarEventDragContext);
  const controller = context?.controller ?? null;
  const pendingPlace = context?.pendingPlace ?? null;
  const [snapshot, setSnapshot] = useState<CalendarEventDragSnapshot | null>(
    null,
  );

  useEffect(() => {
    if (controller === null) {
      return;
    }
    function sync() {
      setSnapshot(controller?.snapshot() ?? null);
    }
    sync();
    return controller.subscribe(sync);
  }, [controller]);

  let startDate: ADate | null = null;
  let startTimeInDay: TimeInDay | null = null;
  let durationMins = PLACE_ACTIVITY_DURATION_MINS;

  if (snapshot !== null && snapshot.mode === "place" && snapshot.overCalendar) {
    startDate = snapshot.newStartTime.toFormat("yyyy-MM-dd") as ADate;
    startTimeInDay = snapshot.newStartTime.toFormat("HH:mm") as TimeInDay;
    durationMins = snapshot.durationMins;
  } else if (pendingPlace !== null) {
    startDate = pendingPlace.startDate;
    startTimeInDay = pendingPlace.startTimeInDay;
    durationMins = pendingPlace.durationMins;
  }

  if (
    startDate === null ||
    startTimeInDay === null ||
    startDate !== props.date
  ) {
    return null;
  }

  const [hours, minutes] = startTimeInDay.split(":");
  const minutesSinceStartOfDay =
    parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  const topRems = calendarTimeEventInDayStartMinutesToRems(
    minutesSinceStartOfDay,
    props.deltaHour,
  );
  if (topRems === undefined) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: topRems,
        height: calendarTimeEventInDayDurationToRems(
          minutesSinceStartOfDay,
          durationMins,
        ),
        backgroundColor: scheduleStreamColorHex(
          TIME_PLAN_ACTIVITY_TIME_EVENT_COLOR,
        ),
        opacity: 0.55,
        borderRadius: "0.25rem",
        border: "1px dashed black",
        minWidth: "calc(7rem - 0.5rem)",
        width: "calc(100% - 0.5rem)",
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}
