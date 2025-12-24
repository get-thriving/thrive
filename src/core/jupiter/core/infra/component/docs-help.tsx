import { DocsHelpSubject } from "@jupiter/webapi-client";
import { HelpCenter as HelpCenterIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useContext } from "react";

import { GlobalPropertiesContext } from "#/core/config-client";

interface DocsHelpProps {
  size: "small" | "medium" | "large";
  subject: DocsHelpSubject;
  theId?: string;
}

export function DocsHelp(props: DocsHelpProps) {
  const globalProperties = useContext(GlobalPropertiesContext);

  const helpUrl = new URL(
    subjectToUrl(props.subject),
    globalProperties.docsUrl,
  );

  return (
    <IconButton
      id={props.theId}
      component={"a"}
      size={props.size}
      disableRipple
      color="inherit"
      href={helpUrl.toString()}
      target="_blank"
    >
      <HelpCenterIcon fontSize={props.size} />
    </IconButton>
  );
}

function subjectToUrl(subject: DocsHelpSubject) {
  switch (subject) {
    case DocsHelpSubject.ROOT:
      return "";
    case DocsHelpSubject.HOME:
      return "concepts/home";
    case DocsHelpSubject.GAMIFICATION:
      return "concepts/gamification";
    case DocsHelpSubject.INBOX_TASKS:
      return "concepts/inbox-tasks";
    case DocsHelpSubject.WORKING_MEM:
      return "concepts/working-mem";
    case DocsHelpSubject.TIME_PLANS:
      return "concepts/time-plans";
    case DocsHelpSubject.SCHEDULE:
      return "concepts/calendar";
    case DocsHelpSubject.HABITS:
      return "concepts/habits";
    case DocsHelpSubject.CHORES:
      return "concepts/chores";
    case DocsHelpSubject.DOCS:
      return "concepts/docs";
    case DocsHelpSubject.BIG_PLANS:
      return "concepts/big-plans";
    case DocsHelpSubject.JOURNALS:
      return "concepts/journals";
    case DocsHelpSubject.VACATIONS:
      return "concepts/vacations";
    case DocsHelpSubject.LIFE_PLAN:
      return "concepts/life-plan";
    case DocsHelpSubject.PROJECTS:
      return "concepts/life-plan/projects";
    case DocsHelpSubject.CHAPTERS:
      return "concepts/life-plan/chapters";
    case DocsHelpSubject.SMART_LISTS:
      return "concepts/smart-lists";
    case DocsHelpSubject.METRICS:
      return "concepts/metrics";
    case DocsHelpSubject.PERSONS:
      return "concepts/persons";
    case DocsHelpSubject.SLACK_TASKS:
      return "concepts/slack-tasks";
    case DocsHelpSubject.EMAIL_TASKS:
      return "concepts/email-tasks";
    case DocsHelpSubject.SELF_HOSTING:
      return "how-tos/self-hosting";
  }
}
