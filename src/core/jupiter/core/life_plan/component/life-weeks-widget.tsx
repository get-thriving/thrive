import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import { WidgetProps } from "#/core/home/component/common";
import { LifeWeeksGrid } from "#/core/life_plan/component/life-weeks-grid";

export function LifeWeeksWidget(props: WidgetProps) {
  const lifePlan = props.lifePlan!;
  const birthday = lifePlanBirthdayDate(lifePlan);
  const today = aDateToDate(props.topLevelInfo.today);

  return (
    <LifeWeeksGrid
      birthday={birthday}
      today={today}
      cellSizePx={4}
      showYearLabels={false}
    />
  );
}
