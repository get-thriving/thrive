import type { ADate, TimeInDay } from "@jupiter/webapi-client";
import { useSearchParams } from "@remix-run/react";
import { useEffect } from "react";

interface TimeEventParamsSourceParams {
  startDate: ADate;
  startTimeInDay: TimeInDay;
  durationMins: number;
}

const SOURCE_START_DATE = "sourceStartDate";
const SOURCE_START_TIME_IN_DAY = "sourceStartTimeInDay";
const SOURCE_DURATION_MINS = "sourceDurationMins";

export function TimeEventParamsSource(props: TimeEventParamsSourceParams) {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const startDate = props.startDate.toString();
    const startTimeInDay = props.startTimeInDay.toString();
    const durationMins = props.durationMins.toString();
    // Remember which page put these in the query. On the way out Remix has
    // often already moved, and writing the old query onto that next page
    // would wipe whatever it was keeping there - a time plan's view among
    // them.
    const pathWhenWritten = window.location.pathname;

    setSearchParams(
      (prev) => {
        if (
          prev.get(SOURCE_START_DATE) === startDate &&
          prev.get(SOURCE_START_TIME_IN_DAY) === startTimeInDay &&
          prev.get(SOURCE_DURATION_MINS) === durationMins
        ) {
          return prev;
        }
        const next = new URLSearchParams(prev);
        next.set(SOURCE_START_DATE, startDate);
        next.set(SOURCE_START_TIME_IN_DAY, startTimeInDay);
        next.set(SOURCE_DURATION_MINS, durationMins);
        return next;
      },
      { replace: true },
    );

    return () => {
      if (window.location.pathname !== pathWhenWritten) {
        return;
      }

      setSearchParams(
        (prev) => {
          if (
            !prev.has(SOURCE_START_DATE) &&
            !prev.has(SOURCE_START_TIME_IN_DAY) &&
            !prev.has(SOURCE_DURATION_MINS)
          ) {
            return prev;
          }
          const next = new URLSearchParams(prev);
          next.delete(SOURCE_START_DATE);
          next.delete(SOURCE_START_TIME_IN_DAY);
          next.delete(SOURCE_DURATION_MINS);
          return next;
        },
        { replace: true },
      );
    };
  }, [
    setSearchParams,
    props.startDate,
    props.startTimeInDay,
    props.durationMins,
  ]);

  return null;
}
