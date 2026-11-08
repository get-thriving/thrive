import { WorkspaceFeature } from "@jupiter/webapi-client";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChatBubbleOutlinedIcon from "@mui/icons-material/ChatBubbleOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import HistoryIcon from "@mui/icons-material/History";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import RepeatIcon from "@mui/icons-material/Repeat";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import ViewTimelineOutlinedIcon from "@mui/icons-material/ViewTimelineOutlined";

import type { RailEntry } from "#/core/infra/component/shell/rail-entry";
import type { RailMoreGroup } from "#/core/infra/component/shell/rail-more-group";

const W = "/app/workspace";

/**
 * The entries on the rail itself, top to bottom. Same destinations, order and
 * feature gating as the classic sidebar; Inbox Tasks is the one entry promoted
 * from its Core group, and it stays at the bottom, where Core is.
 */
export const RAIL_ENTRIES: Array<RailEntry> = [
  { label: "Home", to: W, icon: GpsFixedIcon, exact: true },
  {
    label: "Todos",
    to: `${W}/apps/todos`,
    icon: CheckBoxOutlinedIcon,
    features: [WorkspaceFeature.TODO_TASK],
  },
  {
    label: "Working Mem",
    to: `${W}/apps/working-mem`,
    icon: PsychologyOutlinedIcon,
    features: [WorkspaceFeature.WORKING_MEM],
  },
  {
    label: "Time Plans",
    to: `${W}/apps/time-plans`,
    icon: ViewTimelineOutlinedIcon,
    features: [WorkspaceFeature.TIME_PLANS],
  },
  {
    label: "Calendar",
    to: `${W}/calendar`,
    icon: CalendarMonthOutlinedIcon,
    features: [WorkspaceFeature.SCHEDULE],
  },
  {
    label: "Habits",
    to: `${W}/apps/habits`,
    icon: LocalFireDepartmentOutlinedIcon,
    features: [WorkspaceFeature.HABITS],
  },
  {
    label: "Chores",
    to: `${W}/apps/chores`,
    icon: RepeatIcon,
    features: [WorkspaceFeature.CHORES],
  },
  {
    label: "Big Plans",
    to: `${W}/apps/big-plans`,
    icon: FlagOutlinedIcon,
    features: [WorkspaceFeature.BIG_PLANS],
  },
  {
    label: "Journals",
    to: `${W}/apps/journals`,
    icon: MenuBookOutlinedIcon,
    features: [WorkspaceFeature.JOURNALS],
  },
  {
    label: "Docs",
    to: `${W}/apps/docs/root-redirect`,
    icon: DescriptionOutlinedIcon,
    features: [WorkspaceFeature.DOCS],
  },
  {
    label: "Vacations",
    to: `${W}/apps/vacations`,
    icon: BeachAccessOutlinedIcon,
    features: [WorkspaceFeature.VACATIONS],
  },
  {
    label: "Life Plan",
    to: `${W}/apps/life-plan`,
    icon: LightbulbOutlinedIcon,
    features: [WorkspaceFeature.LIFE_PLAN],
  },
  {
    label: "Smart Lists",
    to: `${W}/apps/smart-lists`,
    icon: FormatListBulletedIcon,
    features: [WorkspaceFeature.SMART_LISTS],
  },
  {
    label: "Metrics",
    to: `${W}/apps/metrics`,
    icon: BarChartIcon,
    features: [WorkspaceFeature.METRICS],
  },
  {
    label: "PRM",
    to: `${W}/apps/prm/persons`,
    icon: PeopleOutlinedIcon,
    features: [WorkspaceFeature.PRM],
  },
  {
    label: "Slack Tasks",
    to: `${W}/push-integrations/slack-tasks`,
    icon: ChatBubbleOutlinedIcon,
    features: [WorkspaceFeature.SLACK_TASKS],
  },
  {
    label: "Email Tasks",
    to: `${W}/push-integrations/email-tasks`,
    icon: MailOutlinedIcon,
    features: [WorkspaceFeature.EMAIL_TASKS],
  },
  // A technical entry, so it sits last, as its Core group does in the classic
  // sidebar.
  {
    label: "Inbox Tasks",
    to: `${W}/core/inbox-tasks`,
    icon: InboxOutlinedIcon,
  },
];

/** Everything else the classic sidebar offers, behind the rail's More button. */
export const RAIL_MORE_GROUPS: Array<RailMoreGroup> = [
  {
    title: "Tools",
    entries: [
      {
        label: "Report",
        to: `${W}/tools/report`,
        icon: AssessmentOutlinedIcon,
      },
      {
        label: "Pomodoro Timer",
        to: `${W}/tools/pomodoro`,
        icon: TimerOutlinedIcon,
      },
    ],
  },
  {
    title: "Core",
    entries: [
      {
        label: "Collaboration",
        to: `${W}/core/collaboration`,
        icon: HandshakeOutlinedIcon,
      },
      { label: "Tags", to: `${W}/core/tags`, icon: SellOutlinedIcon },
      {
        label: "Contacts",
        to: `${W}/core/contacts`,
        icon: ContactsOutlinedIcon,
      },
      {
        label: "Locations",
        to: `${W}/core/locations`,
        icon: PlaceOutlinedIcon,
      },
      { label: "Notes", to: `${W}/core/notes`, icon: NoteAltOutlinedIcon },
      { label: "Publish", to: `${W}/core/publish`, icon: LinkOutlinedIcon },
      {
        label: "Mutation History",
        to: `${W}/mutation-history`,
        icon: HistoryIcon,
      },
    ],
  },
  {
    title: "Process",
    entries: [
      {
        label: "Generate Tasks",
        to: `${W}/tools/gen`,
        icon: AutoFixHighOutlinedIcon,
      },
      {
        label: "Garbage Collect",
        to: `${W}/tools/gc`,
        icon: DeleteSweepOutlinedIcon,
      },
      { label: "Compute Stats", to: `${W}/tools/stats`, icon: BarChartIcon },
    ],
  },
  {
    title: "Explore",
    entries: [
      {
        label: "More Features",
        to: `${W}/settings`,
        icon: SettingsOutlinedIcon,
      },
    ],
  },
];
