import { TimePlanActivityDoneness } from "@jupiter/webapi-client";

export function timePlanActivityDonenessName(
  doneness: TimePlanActivityDoneness,
): string {
  switch (doneness) {
    case TimePlanActivityDoneness.DONE:
      return "Finished";
    case TimePlanActivityDoneness.WORKING:
      return "Working";
    case TimePlanActivityDoneness.NOT_DONE:
      return "Not Started";
  }
}
