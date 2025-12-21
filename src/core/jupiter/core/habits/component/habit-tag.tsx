import type { Habit } from "@jupiter/webapi-client";

import { LinkTag } from "#/core/infra/component/link-tag";

interface Props {
  habit: Habit;
}

export function HabitTag(props: Props) {
  return <LinkTag label={props.habit.name} color="primary" />;
}
