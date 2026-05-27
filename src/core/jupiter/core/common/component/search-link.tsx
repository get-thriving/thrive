import type { ADate, SearchMatch } from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import { Box } from "@mui/material";

import { SlimChip } from "#/core/infra/component/chips";
import { EntityFakeLink, EntityLink } from "#/core/infra/component/entity-card";
import { TimeDiffTag } from "#/core/common/component/time-diff-tag";

export interface SearchMatchLinkProps {
  today: ADate;
  match: SearchMatch;
  hideModifiedTime?: boolean;
  removed?: boolean;
}

/** Search result row: same entity routes as {@link EntitySummaryLink}, with FTS name + note snippets. */
export function SearchMatchLink({
  match,
  today,
  hideModifiedTime,
  removed,
}: SearchMatchLinkProps) {
  const summary = match.summary;
  const nameLine =
    match.name_snippet.length > 0 ? match.name_snippet : summary.name;

  const commonSequence = (
    <>
      <MatchSnippet snippet={nameLine} />
      {match.note_snippet.length > 0 && (
        <Box
          component="div"
          sx={{
            typography: "body2",
            color: "text.secondary",
            mt: 0.5,
            pl: 0.25,
          }}
        >
          <MatchSnippet snippet={match.note_snippet} />
        </Box>
      )}
      {summary.archived && summary.archived_time && (
        <TimeDiffTag
          today={today}
          labelPrefix="Archived"
          collectionTime={summary.archived_time}
        />
      )}
      {!summary.archived && summary.last_modified_time && !hideModifiedTime && (
        <TimeDiffTag
          today={today}
          labelPrefix="Modified"
          collectionTime={summary.last_modified_time}
        />
      )}
    </>
  );

  if (removed) {
    return (
      <EntityFakeLink>
        <SlimChip label={"Removed Entity"} color={"primary"} />
        {commonSequence}
      </EntityFakeLink>
    );
  }

  if (summary.entity_tag === NamedEntityTag.TODO_TASK) {
    return (
      <EntityLink to={`/app/workspace/todos/${summary.ref_id}`}>
        <SlimChip label={"Todo Task"} color={"primary"} />
        {commonSequence}
      </EntityLink>
    );
  }

  switch (summary.entity_tag) {
    case NamedEntityTag.SCORE_LOG_ENTRY:
      return (
        <EntityLink to={"/nowhere"} block>
          <SlimChip label={"Score Log Entry"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.WORKING_MEM:
      return (
        <EntityLink to={`/app/workspace/working-mem`}>
          <SlimChip label={"Working Mem"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.TIME_PLAN:
      return (
        <EntityLink to={`/app/workspace/time-plans/${summary.ref_id}`}>
          <SlimChip label={"Time Plan"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.TIME_PLAN_ACTIVITY:
      return (
        <EntityLink
          to={`/app/workspace/time-plans/no-parent/${summary.ref_id}`}
        >
          <SlimChip label={"Time Plan Activity"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SCHEDULE_STREAM:
      return (
        <EntityLink
          to={`/app/workspace/calendar/schedule/stream/${summary.ref_id}`}
        >
          <SlimChip label={"Schedule Stream"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SCHEDULE_EXPORT:
      return (
        <EntityLink
          to={`/app/workspace/calendar/schedule/export/${summary.ref_id}`}
        >
          <SlimChip label={"Schedule Export"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return (
        <EntityLink
          to={`/app/workspace/calendar/schedule/event-in-day/${summary.ref_id}`}
        >
          <SlimChip label={"Schedule Event In Day"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return (
        <EntityLink
          to={`/app/workspace/calendar/schedule/event-full-days/${summary.ref_id}`}
        >
          <SlimChip label={"Schedule Event Full Days"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SCHEDULE_EXTERNAL_SYNC_LOG:
      return <></>; // This isn't really a supported entity
    case NamedEntityTag.HABIT:
      return (
        <EntityLink to={`/app/workspace/habits/${summary.ref_id}`}>
          <SlimChip label={"Habit"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.CHORE:
      return (
        <EntityLink to={`/app/workspace/chores/${summary.ref_id}`}>
          <SlimChip label={"Chore"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.BIG_PLAN:
      return (
        <EntityLink to={`/app/workspace/big-plans/${summary.ref_id}`}>
          <SlimChip label={"Big Plan"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.JOURNAL:
      return (
        <EntityLink to={`/app/workspace/journals/${summary.ref_id}`}>
          <SlimChip label={"Journal"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.DIR:
      return (
        <EntityLink to={`/app/workspace/docs/${summary.ref_id}`}>
          <SlimChip label={"Folder"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.DOC:
      return (
        <EntityLink to={`/app/workspace/docs/no-parent/${summary.ref_id}`}>
          <SlimChip label={"Doc"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.VACATION:
      return (
        <EntityLink to={`/app/workspace/vacations/${summary.ref_id}`}>
          <SlimChip label={"Vacation"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.ASPECT:
      return (
        <EntityLink to={`/app/workspace/life-plan/aspects/${summary.ref_id}`}>
          <SlimChip label={"Aspect"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.CHAPTER:
      return (
        <EntityLink to={`/app/workspace/life-plan/chapters/${summary.ref_id}`}>
          <SlimChip label={"Chapter"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.GOAL:
      return (
        <EntityLink to={`/app/workspace/life-plan/goals/${summary.ref_id}`}>
          <SlimChip label={"Goal"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.MILESTONE:
      return (
        <EntityLink
          to={`/app/workspace/life-plan/milestones/${summary.ref_id}`}
        >
          <SlimChip label={"Milestone"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.VISION:
      return (
        <EntityLink to={`/app/workspace/life-plan/visions/${summary.ref_id}`}>
          <SlimChip label={"Vision"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SMART_LIST:
      return (
        <EntityLink to={`/app/workspace/smart-lists/${summary.ref_id}`}>
          <SlimChip label={"Smart List"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SMART_LIST_ITEM:
      return (
        <EntityLink
          to={`/app/workspace/smart-lists/no-parent/${summary.ref_id}`}
        >
          <SlimChip label={"Smart List Item"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.METRIC:
      return (
        <EntityLink to={`/app/workspace/metrics/${summary.ref_id}`}>
          <SlimChip label={"Metric"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.METRIC_ENTRY:
      return (
        <EntityLink to={`/app/workspace/metrics/no-parent/${summary.ref_id}`}>
          <SlimChip label={"Metric Entry"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.PERSON:
      return (
        <EntityLink to={`/app/workspace/prm/persons/${summary.ref_id}`}>
          <SlimChip label={"Persons"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.CIRCLE:
      return (
        <EntityLink to={`/app/workspace/prm/circles/${summary.ref_id}`}>
          <SlimChip label={"Circle"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.SLACK_TASK:
      return (
        <EntityLink
          to={`/app/workspace/push-integrations/slack-tasks/${summary.ref_id}`}
        >
          <SlimChip label={"Slack Tasks"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
    case NamedEntityTag.EMAIL_TASK:
      return (
        <EntityLink
          to={`/app/workspace/push-integrations/email-tasks/${summary.ref_id}`}
        >
          <SlimChip label={"Email Tasks"} color={"primary"} />
          {commonSequence}
        </EntityLink>
      );
  }
}

interface MatchSnippetProps {
  snippet: string;
}

function MatchSnippet({ snippet }: MatchSnippetProps) {
  const matchSnippetArr: Array<{ text: string; bold: boolean }> = [];

  let currentStr = "";
  let bold = false;
  for (let i = 0; i < snippet.length; i++) {
    if (bold === false && snippet.startsWith("[found]", i)) {
      if (currentStr.length > 0) {
        matchSnippetArr.push({
          text: currentStr,
          bold: false,
        });
      }
      i += 6;
      currentStr = "";
      bold = true;
    } else if (bold === true && snippet.startsWith("[/found]", i)) {
      if (currentStr.length > 0) {
        matchSnippetArr.push({
          text: currentStr,
          bold: true,
        });
      }
      i += 7;
      currentStr = "";
      bold = false;
    } else {
      currentStr += snippet[i];
    }
  }

  if (currentStr.length > 0) {
    matchSnippetArr.push({
      text: currentStr,
      bold: bold,
    });
  }

  return (
    <div>
      {matchSnippetArr.map((item, idx) => {
        if (item.bold) {
          return <strong key={idx}>{item.text}</strong>;
        } else {
          return <span key={idx}>{item.text}</span>;
        }
      })}
    </div>
  );
}
