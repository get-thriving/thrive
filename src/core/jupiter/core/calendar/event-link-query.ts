/**
 * The query string an event on a calendar carries into the panel it opens.
 */

// Which time event on the calendar opened this activity, so the activity
// leaf can take that event off without taking the activity with it.
export const TIME_PLAN_ACTIVITY_TIME_EVENT_PARAM = "timeEventRefId";

// Params of the calendar's own URL that an event link never carries over.
// Which event opened a panel is the link's to say, and the three "source"
// ones describe a new event being placed rather than an existing one - the
// leaf that reads them is the one they were put there for, and they change
// with every tick of a drag.
const NOT_CARRIED_OVER: ReadonlyArray<string> = [
  TIME_PLAN_ACTIVITY_TIME_EVENT_PARAM,
  "sourceStartDate",
  "sourceStartTimeInDay",
  "sourceDurationMins",
];

// The link's own query, with the calendar's view carried along behind it.
// Gluing the two strings together instead left every param of the current URL
// on the end of the link, so an event opened from another event's panel took
// that panel's timeEventRefId with it as well as its own: the URL grew a
// param per click, no two links agreed on where they pointed, and every link
// on screen changed its target whenever any of them was followed - which, for
// a link the pointer is resting on, is another round of prefetching the whole
// plan behind it.
export function withCalendarQuery(
  basePath: string,
  query: URLSearchParams,
): string {
  const [pathname, ownQueryString] = splitPath(basePath);
  const merged = new URLSearchParams(ownQueryString);

  for (const key of new Set(query.keys())) {
    if (merged.has(key) || NOT_CARRIED_OVER.includes(key)) {
      continue;
    }
    for (const value of query.getAll(key)) {
      merged.append(key, value);
    }
  }

  const mergedQueryString = merged.toString();
  return mergedQueryString === ""
    ? pathname
    : `${pathname}?${mergedQueryString}`;
}

function splitPath(path: string): [string, string] {
  const at = path.indexOf("?");
  return at === -1 ? [path, ""] : [path.slice(0, at), path.slice(at + 1)];
}
