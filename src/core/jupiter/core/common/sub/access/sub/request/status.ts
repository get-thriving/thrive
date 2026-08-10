import { AccessRequestStatus } from "@jupiter/webapi-client";

export function accessRequestStatusName(status: AccessRequestStatus): string {
  switch (status) {
    case AccessRequestStatus.REQUESTED:
      return "Requested";
    case AccessRequestStatus.ACCEPTED:
      return "Accepted";
    case AccessRequestStatus.REJECTED:
      return "Rejected";
  }
}
