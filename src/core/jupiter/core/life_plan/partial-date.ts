import {
  MilestoneSummary,
  PartialDate,
  PartialDateType,
} from "@jupiter/webapi-client";
import { DateTime, DateTimeMaybeValid } from "luxon";

import { aDateToDate } from "#/core/common/adate";

interface PartialDateAbsoluteYMD {
  type: PartialDateType.ABSOLUTE_YEAR_MONTH_DAY;
  grossType: "absolute";
  relativeType?: undefined;
  year: number;
  month: number;
  day: number;
  milestoneRefId: undefined;
}

interface PartialDateAbsoluteYM {
  type: PartialDateType.ABSOLUTE_YEAR_MONTH;
  grossType: "absolute";
  relativeType?: undefined;
  year: number;
  month: number;
  day: "N/A";
  milestoneRefId: undefined;
}

interface PartialDateAbsoluteY {
  type: PartialDateType.ABSOLUTE_YEAR;
  grossType: "absolute";
  relativeType?: undefined;
  year: number;
  month: "N/A";
  day: "N/A";
  milestoneRefId: undefined;
}

interface PartialDateRelativeYear {
  type: PartialDateType.RELATIVE_YEAR;
  grossType: "relative";
  relativeType?: "year";
  year: number;
  month: "N/A";
  day: "N/A";
  milestoneRefId: undefined;
}

interface PartialDateRelativeDecade {
  type: PartialDateType.RELATIVE_DECADE;
  grossType: "relative";
  relativeType?: "decade";
  year: number;
  month: "N/A";
  day: "N/A";
  milestoneRefId: undefined;
}

interface PartialDateMilestone {
  type: PartialDateType.MILESTONE;
  grossType: "milestone";
  relativeType?: undefined;
  year: "N/A";
  month: "N/A";
  day: "N/A";
  milestoneRefId: string;
}

interface PartialDatePresent {
  type: PartialDateType.PRESENT;
  grossType: "present";
  relativeType?: undefined;
  year: "N/A";
  month: "N/A";
  day: "N/A";
  milestoneRefId: undefined;
}

type PartialDateExtracted =
  | PartialDateAbsoluteYMD
  | PartialDateAbsoluteYM
  | PartialDateAbsoluteY
  | PartialDateRelativeYear
  | PartialDateRelativeDecade
  | PartialDateMilestone
  | PartialDatePresent;

export function isMilestonePartialDate(partialDate: PartialDate): boolean {
  return partialDate.startsWith(PartialDateType.MILESTONE);
}

export function partialDateExtract(
  partialDate: PartialDate,
): PartialDateExtracted {
  const parts = partialDate.split(" ");
  const type = parts[0];

  switch (type) {
    case PartialDateType.ABSOLUTE_YEAR_MONTH_DAY: {
      const year = parseInt(parts[1]);
      const month = parseInt(parts[2]);
      const day = parseInt(parts[3]);

      if (year === undefined || month === undefined || day === undefined) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }

      return {
        type: PartialDateType.ABSOLUTE_YEAR_MONTH_DAY,
        grossType: "absolute",
        year,
        month,
        day,
        milestoneRefId: undefined,
      };
    }

    case PartialDateType.ABSOLUTE_YEAR_MONTH: {
      const year = parseInt(parts[1]);
      const month = parseInt(parts[2]);

      if (year === undefined || month === undefined) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }

      return {
        type: PartialDateType.ABSOLUTE_YEAR_MONTH,
        grossType: "absolute",
        year,
        month,
        day: "N/A",
        milestoneRefId: undefined,
      };
    }

    case PartialDateType.ABSOLUTE_YEAR: {
      const year = parseInt(parts[1]);

      if (year === undefined) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }

      return {
        type: PartialDateType.ABSOLUTE_YEAR,
        grossType: "absolute",
        year,
        month: "N/A",
        day: "N/A",
        milestoneRefId: undefined,
      };
    }

    case PartialDateType.RELATIVE_YEAR: {
      const year = parseInt(parts[1]);

      if (year === undefined) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }

      return {
        type: PartialDateType.RELATIVE_YEAR,
        grossType: "relative",
        relativeType: "year",
        year,
        month: "N/A",
        day: "N/A",
        milestoneRefId: undefined,
      };
    }

    case PartialDateType.RELATIVE_DECADE: {
      const year = parseInt(parts[1]);

      if (year === undefined) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }

      return {
        type: PartialDateType.RELATIVE_DECADE,
        grossType: "relative",
        relativeType: "decade",
        year,
        month: "N/A",
        day: "N/A",
        milestoneRefId: undefined,
      };
    }

    case PartialDateType.MILESTONE: {
      const milestoneRefId = parts[1];

      if (milestoneRefId === undefined) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }

      return {
        type: PartialDateType.MILESTONE,
        grossType: "milestone",
        year: "N/A",
        month: "N/A",
        day: "N/A",
        milestoneRefId: milestoneRefId,
      };
    }

    case PartialDateType.PRESENT: {
      return {
        type: PartialDateType.PRESENT,
        grossType: "present",
        relativeType: undefined,
        year: "N/A",
        month: "N/A",
        day: "N/A",
        milestoneRefId: undefined,
      };
    }

    default:
      throw new Error(`Invalid partial date type: ${type}`);
  }
}

export function partialDateEncode(
  partialDate: Omit<PartialDateExtracted, "type">,
): PartialDate {
  switch (partialDate.grossType) {
    case "absolute": {
      if (partialDate.month === "N/A" && partialDate.day === "N/A") {
        return `${PartialDateType.ABSOLUTE_YEAR} ${partialDate.year}`;
      }
      if (partialDate.day === "N/A") {
        return `${PartialDateType.ABSOLUTE_YEAR_MONTH} ${partialDate.year} ${partialDate.month}`;
      }
      return `${PartialDateType.ABSOLUTE_YEAR_MONTH_DAY} ${partialDate.year} ${partialDate.month} ${partialDate.day}`;
    }
    case "relative": {
      if (partialDate.relativeType === "year") {
        return `${PartialDateType.RELATIVE_YEAR} ${partialDate.year}`;
      }
      return `${PartialDateType.RELATIVE_DECADE} ${partialDate.year}`;
    }
    case "milestone": {
      return `${PartialDateType.MILESTONE} ${partialDate.milestoneRefId}`;
    }
    case "present": {
      return PartialDateType.PRESENT;
    }
    default:
      throw new Error(
        `Invalid partial date gross type: ${partialDate.grossType}`,
      );
  }
}

export function midDate(
  partialDate: PartialDate,
  birthday: DateTime<true>,
  today: DateTime<true>,
  milestones: MilestoneSummary[],
): DateTime<true> {
  const extracted = partialDateExtract(partialDate);
  let date: DateTimeMaybeValid;

  switch (extracted.type) {
    case PartialDateType.ABSOLUTE_YEAR_MONTH_DAY:
      {
        date = DateTime.fromObject({
          year: extracted.year,
          month: extracted.month,
          day: extracted.day,
        });
      }
      break;
    case PartialDateType.ABSOLUTE_YEAR_MONTH:
      {
        date = DateTime.fromObject({
          year: extracted.year,
          month: extracted.month,
          day: 15,
        });
      }
      break;
    case PartialDateType.ABSOLUTE_YEAR:
      {
        date = DateTime.fromObject({
          year: extracted.year,
          month: 7,
          day: 1,
        });
      }
      break;
    case PartialDateType.RELATIVE_YEAR:
      {
        date = DateTime.fromObject({
          year: birthday.year + extracted.year,
          month: 7,
          day: 1,
        });
      }
      break;
    case PartialDateType.RELATIVE_DECADE:
      {
        date = DateTime.fromObject({
          year: birthday.year + extracted.year + 5,
          month: 7,
          day: 1,
        });
      }
      break;
    case PartialDateType.MILESTONE: {
      const milestone = milestones.find(
        (m) => m.ref_id === extracted.milestoneRefId,
      );
      if (!milestone) {
        throw new Error(`Milestone not found: ${extracted.milestoneRefId}`);
      }
      date = aDateToDate(milestone.date);
      break;
    }
    case PartialDateType.PRESENT: {
      date = today;
      break;
    }
  }

  if (!date.isValid) {
    throw new Error(`Invalid partial date: ${partialDate}`);
  }

  return date;
}
