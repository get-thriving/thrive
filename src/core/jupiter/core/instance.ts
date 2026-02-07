import { Instance } from "@jupiter/webapi-client";

const TO_FILL_INSTANCE = "TO-FILL";

export function newOrGenerateInstance(
  value: string,
  branchName: string,
): Instance {
  if (value === TO_FILL_INSTANCE) {
    return branchName.replace("/", "--");
  }

  return value;
}
