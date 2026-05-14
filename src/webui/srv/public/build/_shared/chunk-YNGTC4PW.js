import {
  timestampToDate
} from "/build/_shared/chunk-X6MG2JXZ.js";
import {
  ClientOnly
} from "/build/_shared/chunk-Z3RPM676.js";
import {
  FatChip
} from "/build/_shared/chunk-QEY3CJSK.js";
import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";
import {
  Fragment,
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";

// ../core/jupiter/core/common/component/time-diff-tag.tsx
function abbreviatedTimeDiffLabelPrefix(labelPrefix) {
  const match = /^Last\s+(.+)$/i.exec(labelPrefix.trim());
  if (match) {
    const rest = match[1];
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  return labelPrefix;
}
function compactRelativeDiffAgo(collectionIso) {
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
    "minutes"
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
function TimeDiffTag(props) {
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
  const labelPrefix = props.compact ? abbreviatedTimeDiffLabelPrefix(props.labelPrefix) : props.labelPrefix;
  return /* @__PURE__ */ jsxDEV(ClientOnly, { fallback: /* @__PURE__ */ jsxDEV(Fragment, {}, void 0, false, {
    fileName: "../core/jupiter/core/common/component/time-diff-tag.tsx",
    lineNumber: 123,
    columnNumber: 27
  }, this), children: () => /* @__PURE__ */ jsxDEV(FatChip, { label: `${labelPrefix} ${diffStr}`, color: "info" }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/time-diff-tag.tsx",
    lineNumber: 124,
    columnNumber: 14
  }, this) }, void 0, false, {
    fileName: "../core/jupiter/core/common/component/time-diff-tag.tsx",
    lineNumber: 123,
    columnNumber: 5
  }, this);
}

export {
  TimeDiffTag
};
//# sourceMappingURL=/build/_shared/chunk-YNGTC4PW.js.map
