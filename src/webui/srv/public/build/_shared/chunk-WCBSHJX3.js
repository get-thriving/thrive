import {
  aDateToDate
} from "/build/_shared/chunk-72ELS2LF.js";
import {
  DateTime
} from "/build/_shared/chunk-LT7567PB.js";
import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/life_plan/partial-date.ts
var import_webapi_client = __toESM(require_dist(), 1);
function isMilestonePartialDate(partialDate) {
  return partialDate.startsWith(import_webapi_client.PartialDateType.MILESTONE);
}
function partialDateExtract(partialDate) {
  const parts = partialDate.split(" ");
  const type = parts[0];
  switch (type) {
    case import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH_DAY: {
      const year = parseInt(parts[1]);
      const month = parseInt(parts[2]);
      const day = parseInt(parts[3]);
      if (year === void 0 || month === void 0 || day === void 0) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }
      return {
        type: import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH_DAY,
        grossType: "absolute",
        year,
        month,
        day,
        milestoneRefId: void 0
      };
    }
    case import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH: {
      const year = parseInt(parts[1]);
      const month = parseInt(parts[2]);
      if (year === void 0 || month === void 0) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }
      return {
        type: import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH,
        grossType: "absolute",
        year,
        month,
        day: "N/A",
        milestoneRefId: void 0
      };
    }
    case import_webapi_client.PartialDateType.ABSOLUTE_YEAR: {
      const year = parseInt(parts[1]);
      if (year === void 0) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }
      return {
        type: import_webapi_client.PartialDateType.ABSOLUTE_YEAR,
        grossType: "absolute",
        year,
        month: "N/A",
        day: "N/A",
        milestoneRefId: void 0
      };
    }
    case import_webapi_client.PartialDateType.RELATIVE_YEAR: {
      const year = parseInt(parts[1]);
      if (year === void 0) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }
      return {
        type: import_webapi_client.PartialDateType.RELATIVE_YEAR,
        grossType: "relative",
        relativeType: "year",
        year,
        month: "N/A",
        day: "N/A",
        milestoneRefId: void 0
      };
    }
    case import_webapi_client.PartialDateType.RELATIVE_DECADE: {
      const year = parseInt(parts[1]);
      if (year === void 0) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }
      return {
        type: import_webapi_client.PartialDateType.RELATIVE_DECADE,
        grossType: "relative",
        relativeType: "decade",
        year,
        month: "N/A",
        day: "N/A",
        milestoneRefId: void 0
      };
    }
    case import_webapi_client.PartialDateType.MILESTONE: {
      const milestoneRefId = parts[1];
      if (milestoneRefId === void 0) {
        throw new Error(`Invalid partial date: ${partialDate}`);
      }
      return {
        type: import_webapi_client.PartialDateType.MILESTONE,
        grossType: "milestone",
        year: "N/A",
        month: "N/A",
        day: "N/A",
        milestoneRefId
      };
    }
    case import_webapi_client.PartialDateType.PRESENT: {
      return {
        type: import_webapi_client.PartialDateType.PRESENT,
        grossType: "present",
        relativeType: void 0,
        year: "N/A",
        month: "N/A",
        day: "N/A",
        milestoneRefId: void 0
      };
    }
    case import_webapi_client.PartialDateType.START: {
      return {
        type: import_webapi_client.PartialDateType.START,
        grossType: "start",
        relativeType: void 0,
        year: "N/A",
        month: "N/A",
        day: "N/A",
        milestoneRefId: void 0
      };
    }
    case import_webapi_client.PartialDateType.END: {
      return {
        type: import_webapi_client.PartialDateType.END,
        grossType: "end",
        relativeType: void 0,
        year: "N/A",
        month: "N/A",
        day: "N/A",
        milestoneRefId: void 0
      };
    }
    default:
      throw new Error(`Invalid partial date type: ${type}`);
  }
}
function partialDateEncode(partialDate) {
  switch (partialDate.grossType) {
    case "absolute": {
      if (partialDate.month === "N/A" && partialDate.day === "N/A") {
        return `${import_webapi_client.PartialDateType.ABSOLUTE_YEAR} ${partialDate.year}`;
      }
      if (partialDate.day === "N/A") {
        return `${import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH} ${partialDate.year} ${partialDate.month}`;
      }
      return `${import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH_DAY} ${partialDate.year} ${partialDate.month} ${partialDate.day}`;
    }
    case "relative": {
      if (partialDate.relativeType === "year") {
        return `${import_webapi_client.PartialDateType.RELATIVE_YEAR} ${partialDate.year}`;
      }
      return `${import_webapi_client.PartialDateType.RELATIVE_DECADE} ${partialDate.year}`;
    }
    case "milestone": {
      return `${import_webapi_client.PartialDateType.MILESTONE} ${partialDate.milestoneRefId}`;
    }
    case "present": {
      return import_webapi_client.PartialDateType.PRESENT;
    }
    case "start": {
      return import_webapi_client.PartialDateType.START;
    }
    case "end": {
      return import_webapi_client.PartialDateType.END;
    }
    default:
      throw new Error(
        `Invalid partial date gross type: ${partialDate.grossType}`
      );
  }
}
function midDate(partialDate, birthday, today, milestones) {
  const extracted = partialDateExtract(partialDate);
  let date;
  switch (extracted.type) {
    case import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH_DAY:
      {
        date = DateTime.fromObject({
          year: extracted.year,
          month: extracted.month,
          day: extracted.day
        });
      }
      break;
    case import_webapi_client.PartialDateType.ABSOLUTE_YEAR_MONTH:
      {
        date = DateTime.fromObject({
          year: extracted.year,
          month: extracted.month,
          day: 15
        });
      }
      break;
    case import_webapi_client.PartialDateType.ABSOLUTE_YEAR:
      {
        date = DateTime.fromObject({
          year: extracted.year,
          month: 7,
          day: 1
        });
      }
      break;
    case import_webapi_client.PartialDateType.RELATIVE_YEAR:
      {
        date = DateTime.fromObject({
          year: birthday.year + extracted.year,
          month: 7,
          day: 1
        });
      }
      break;
    case import_webapi_client.PartialDateType.RELATIVE_DECADE:
      {
        date = DateTime.fromObject({
          year: birthday.year + extracted.year + 5,
          month: 7,
          day: 1
        });
      }
      break;
    case import_webapi_client.PartialDateType.MILESTONE: {
      const milestone = milestones.find(
        (m) => m.ref_id === extracted.milestoneRefId
      );
      if (!milestone) {
        throw new Error(`Milestone not found: ${extracted.milestoneRefId}`);
      }
      date = aDateToDate(milestone.date);
      break;
    }
    case import_webapi_client.PartialDateType.PRESENT: {
      date = today;
      break;
    }
    case import_webapi_client.PartialDateType.START: {
      date = birthday;
      break;
    }
    case import_webapi_client.PartialDateType.END: {
      date = birthday.plus({ years: 100 });
      break;
    }
  }
  if (!date.isValid) {
    throw new Error(`Invalid partial date: ${partialDate}`);
  }
  return date;
}

export {
  isMilestonePartialDate,
  partialDateExtract,
  partialDateEncode,
  midDate
};
//# sourceMappingURL=/build/_shared/chunk-WCBSHJX3.js.map
