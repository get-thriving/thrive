import { createContext } from "react";

// Display thresholds for marking tasks as overdue. Each service provides
// these from its own service properties.
export interface OverdueThresholds {
  overdueInfoDays: number;
  overdueWarningDays: number;
  overdueDangerDays: number;
}

export const OverdueThresholdsContext = createContext<OverdueThresholds>({
  overdueInfoDays: 1,
  overdueWarningDays: 2,
  overdueDangerDays: 3,
});
