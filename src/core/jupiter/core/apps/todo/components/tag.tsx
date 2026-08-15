import type { TodoTask } from "@jupiter/webapi-client";

import { LinkTag } from "#/core/infra/component/link-tag";

interface Props {
  todoTask: TodoTask;
}

export function TodoTaskTag(props: Props) {
  return <LinkTag label={props.todoTask.name} color="primary" />;
}
