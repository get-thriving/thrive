import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../core/jupiter/core/schedule/sub/stream/color.ts
var import_webapi_client = __toESM(require_dist(), 1);
function scheduleStreamColorName(color) {
  switch (color) {
    case import_webapi_client.ScheduleStreamColor.BLUE:
      return "Blue";
    case import_webapi_client.ScheduleStreamColor.GREEN:
      return "Green";
    case import_webapi_client.ScheduleStreamColor.RED:
      return "Red";
    case import_webapi_client.ScheduleStreamColor.YELLOW:
      return "Yellow";
    case import_webapi_client.ScheduleStreamColor.PURPLE:
      return "Purple";
    case import_webapi_client.ScheduleStreamColor.ORANGE:
      return "Orange";
    case import_webapi_client.ScheduleStreamColor.GRAY:
      return "Gray";
    case import_webapi_client.ScheduleStreamColor.BROWN:
      return "Brown";
    case import_webapi_client.ScheduleStreamColor.CYAN:
      return "Cyan";
    case import_webapi_client.ScheduleStreamColor.MAGENTA:
      return "Magenta";
  }
}
function scheduleStreamColorHex(color, modify) {
  let hexColor;
  switch (color) {
    case import_webapi_client.ScheduleStreamColor.BLUE:
      hexColor = "#2196f3";
      break;
    case import_webapi_client.ScheduleStreamColor.GREEN:
      hexColor = "#4caf50";
      break;
    case import_webapi_client.ScheduleStreamColor.RED:
      hexColor = "#f44336";
      break;
    case import_webapi_client.ScheduleStreamColor.YELLOW:
      hexColor = "#f7d560";
      break;
    case import_webapi_client.ScheduleStreamColor.PURPLE:
      hexColor = "#9c27b0";
      break;
    case import_webapi_client.ScheduleStreamColor.ORANGE:
      hexColor = "#ff9800";
      break;
    case import_webapi_client.ScheduleStreamColor.GRAY:
      hexColor = "#9e9e9e";
      break;
    case import_webapi_client.ScheduleStreamColor.BROWN:
      hexColor = "#795548";
      break;
    case import_webapi_client.ScheduleStreamColor.CYAN:
      hexColor = "#00bcd4";
      break;
    case import_webapi_client.ScheduleStreamColor.MAGENTA:
      hexColor = "#e91e63";
      break;
  }
  if (modify === "lighter") {
    return adjustColor(hexColor, 30);
  } else if (modify === "darker") {
    return adjustColor(hexColor, -30);
  } else {
    return hexColor;
  }
}
function scheduleStreamColorContrastingHex(color) {
  switch (color) {
    case import_webapi_client.ScheduleStreamColor.BLUE:
      return "#ffffff";
    case import_webapi_client.ScheduleStreamColor.GREEN:
      return "#ffffff";
    case import_webapi_client.ScheduleStreamColor.RED:
      return "#ffffff";
    case import_webapi_client.ScheduleStreamColor.YELLOW:
      return "#000000";
    case import_webapi_client.ScheduleStreamColor.PURPLE:
      return "#ffffff";
    case import_webapi_client.ScheduleStreamColor.ORANGE:
      return "#000000";
    case import_webapi_client.ScheduleStreamColor.GRAY:
      return "#000000";
    case import_webapi_client.ScheduleStreamColor.BROWN:
      return "#ffffff";
    case import_webapi_client.ScheduleStreamColor.CYAN:
      return "#000000";
    case import_webapi_client.ScheduleStreamColor.MAGENTA:
      return "#ffffff";
  }
}
function adjustColor(hex, amount) {
  let usePound = false;
  if (hex[0] === "#") {
    hex = hex.slice(1);
    usePound = true;
  }
  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  if (r > 255)
    r = 255;
  else if (r < 0)
    r = 0;
  let g = (num >> 8 & 255) + amount;
  if (g > 255)
    g = 255;
  else if (g < 0)
    g = 0;
  let b = (num & 255) + amount;
  if (b > 255)
    b = 255;
  else if (b < 0)
    b = 0;
  return (usePound ? "#" : "") + (r << 16 | g << 8 | b).toString(16).padStart(6, "0");
}

export {
  scheduleStreamColorName,
  scheduleStreamColorHex,
  scheduleStreamColorContrastingHex
};
//# sourceMappingURL=/build/_shared/chunk-7YZ2X2X4.js.map
