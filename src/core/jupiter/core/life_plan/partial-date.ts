import { PartialDate, PartialDateType } from "@jupiter/webapi-client";

interface PartialDateAbsoluteYMD {
  type: PartialDateType.ABSOLUTE_YEAR_MONTH_DAY;
  grossType: "absolute";
  relativeType?: undefined;
  year: number;
  month: number;
  day: number;
}
interface PartialDateAbsoluteYM {
  type: PartialDateType.ABSOLUTE_YEAR_MONTH;
  grossType: "absolute";
  relativeType?: undefined;
  year: number;
  month: number;
  day: "N/A";
}
interface PartialDateAbsoluteY {
  type: PartialDateType.ABSOLUTE_YEAR;
  grossType: "absolute";
  relativeType?: undefined;
  year: number;
  month: "N/A";
  day: "N/A";
}
interface PartialDateRelativeYear {
  type: PartialDateType.RELATIVE_YEAR;
  grossType: "relative";
  relativeType?: "year";
  year: number;
  month: "N/A";
  day: "N/A";
}
interface PartialDateRelativeDecade {
  type: PartialDateType.RELATIVE_DECADE;
  grossType: "relative";
  relativeType?: "decade";
  year: number;
  month: "N/A";
  day: "N/A";
}

type PartialDateExtracted =
  | PartialDateAbsoluteYMD
  | PartialDateAbsoluteYM
  | PartialDateAbsoluteY
  | PartialDateRelativeYear
  | PartialDateRelativeDecade;

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
    default:
      throw new Error(
        `Invalid partial date gross type: ${partialDate.grossType}`,
      );
  }
}
