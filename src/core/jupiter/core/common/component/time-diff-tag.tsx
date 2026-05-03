import type { ADate, Timestamp } from "@jupiter/webapi-client";
import { DateTime } from "luxon";

import { FatChip } from "#/core/infra/component/chips";
import { aDateToDate } from "#/core/common/adate";
import { timestampToDate } from "#/core/common/timestamp";
import { ClientOnly } from "#/core/infra/component/client-only";

interface TimeDiffTagProps {
  today: ADate;
  labelPrefix: string;
  collectionTime: ADate | Timestamp;
  /** Shorter label prefix (e.g. "Last modified" → "Modified") and largest unit only (`10m ago`, `5d ago`, …). */
  compact?: boolean;
}

function abbreviatedTimeDiffLabelPrefix(labelPrefix: string): string {
  const match = /^Last\s+(.+)$/i.exec(labelPrefix.trim());
  if (match) {
    const rest = match[1];
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return labelPrefix;
}

/** Compact text like `10y ago`, `10m ago` (months), `10d ago`, `5h ago`, `15min ago`. Uses full timestamp when present. */
function compactRelativeDiffAgo(collectionIso: string): string {
  const then = DateTime.fromISO(collectionIso);
  if (!then.isValid) {
    return "today";
  }
  const now = DateTime.now();
  if (then > now) {
    return "today";
  }
  const duration = now.diff(then, [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
  ]);
  const o = duration.toObject();
  const y = Math.floor(o.years ?? 0);
  const mo = Math.floor(o.months ?? 0);
  const d = Math.floor(o.days ?? 0);
  const h = Math.floor(o.hours ?? 0);
  const mi = Math.floor(o.minutes ?? 0);

  if (y > 0) {
    return `${y}y ago`;
  }
  if (mo > 0) {
    return `${mo}m ago`;
  }
  if (d > 0) {
    return `${d}d ago`;
  }
  if (h > 0) {
    return `${h}h ago`;
  }
  if (mi > 0) {
    return `${mi}min ago`;
  }
  return "today";
}

export function TimeDiffTag(props: TimeDiffTagProps) {
  let diffStr = "";
  if (props.compact) {
    diffStr = compactRelativeDiffAgo(String(props.collectionTime));
  } else {
    const today = aDateToDate(props.today);
    const collectionTime = timestampToDate(props.collectionTime);
    const diff = today.diff(collectionTime, ["years", "months", "days"]);

    const diffYears = Math.ceil(diff.years);
    const diffMonths = Math.ceil(diff.months);
    const diffDays = Math.ceil(diff.days);

    if (diffYears > 0) {
      if (diffYears === 1) {
        diffStr += "1 year";
      } else {
        diffStr += `${diffYears} years`;
      }
    }

    if (diffMonths > 0) {
      if (diffStr.length > 0) {
        diffStr += ", ";
      }
      if (diffMonths === 1) {
        diffStr += "1 month";
      } else {
        diffStr += `${diffMonths} months`;
      }
    }

    if (diffDays > 0) {
      if (diffStr.length > 0) {
        diffStr += ", ";
      }
      if (diffDays === 1) {
        diffStr += "1 day";
      } else {
        diffStr += `${diffDays} days`;
      }
    }

    if (diffStr.length === 0) {
      diffStr = "today";
    } else {
      diffStr += " ago";
    }
  }

  const labelPrefix = props.compact
    ? abbreviatedTimeDiffLabelPrefix(props.labelPrefix)
    : props.labelPrefix;

  return (
    <ClientOnly fallback={<></>}>
      {() => <FatChip label={`${labelPrefix} ${diffStr}`} color="info" />}
    </ClientOnly>
  );
}
