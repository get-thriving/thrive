import { MetricDirection } from "@jupiter/webapi-client";

export function metricDirectionName(direction: MetricDirection): string {
  switch (direction) {
    case MetricDirection.NONE:
      return "None";
    case MetricDirection.UP_IS_GOOD:
      return "Up Is Good";
    case MetricDirection.DOWN_IS_GOOD:
      return "Down Is Good";
  }
}
