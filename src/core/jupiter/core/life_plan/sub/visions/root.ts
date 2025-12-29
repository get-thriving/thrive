import { Vision, VisionStatus } from "@jupiter/webapi-client";

export function isVisionEditable(vision: Vision): boolean {
  return vision.status === VisionStatus.DRAFT;
}

export function isVisionActivable(vision: Vision): boolean {
  return vision.status === VisionStatus.DRAFT;
}